use axum::{
    extract::{Path, Query, State},
    routing::{get, post, put},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{
    config::Config,
    models::{
        Application, ApplicationStatus, ApplicationWithDetails, CreateApplicationDto,
        UpdateApplicationStatusDto,
    },
    utils::{
        auth::{auth_middleware, AuthUser},
        error::{AppError, Result},
    },
};

pub fn router() -> Router {
    Router::new()
        .route("/", post(create_application))
        .route("/user/:id", get(list_user_applications))
        .route("/:id/status", put(update_application_status))
        .layer(axum::middleware::from_fn(auth_middleware))
}

async fn create_application(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Json(dto): Json<CreateApplicationDto>,
) -> Result<Json<Application>> {
    dto.validate()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    // Check if job exists and is active
    let job = sqlx::query!(
        "SELECT id FROM jobs WHERE id = $1 AND is_active = true",
        dto.job_id
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Job not found or inactive".to_string()))?;

    // Check if user has already applied
    let existing_application = sqlx::query!(
        "SELECT id FROM applications WHERE user_id = $1 AND job_id = $2",
        auth_user.id,
        dto.job_id
    )
    .fetch_optional(&pool)
    .await?;

    if existing_application.is_some() {
        return Err(AppError::Validation("You have already applied for this job".to_string()));
    }

    let application = sqlx::query_as!(
        Application,
        r#"
        INSERT INTO applications (user_id, job_id, cover_letter)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
        auth_user.id,
        dto.job_id,
        dto.cover_letter
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(application))
}

async fn list_user_applications(
    State(pool): State<PgPool>,
    Path(user_id): Path<Uuid>,
    auth_user: AuthUser,
) -> Result<Json<Vec<ApplicationWithDetails>>> {
    // Only allow users to view their own applications or admins to view any
    if auth_user.id != user_id && auth_user.role != "admin" {
        return Err(AppError::Forbidden("Not authorized to view these applications".to_string()));
    }

    let applications = sqlx::query!(
        r#"
        SELECT 
            a.*,
            j.*,
            u.*
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.user_id = u.id
        WHERE a.user_id = $1
        ORDER BY a.created_at DESC
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await?;

    let applications_with_details = applications
        .into_iter()
        .map(|row| ApplicationWithDetails {
            application: Application {
                id: row.id,
                user_id: row.user_id,
                job_id: row.job_id,
                status: row.status,
                resume_url: row.resume_url,
                cover_letter: row.cover_letter,
                created_at: row.created_at,
                updated_at: row.updated_at,
            },
            job: crate::models::Job {
                id: row.job_id,
                title: row.title,
                description: row.description,
                company_id: row.company_id,
                location: row.location,
                job_type: row.job_type,
                experience_level: row.experience_level,
                salary_range: row.salary_range,
                skills: row.skills,
                is_active: row.is_active,
                created_at: row.job_created_at,
                updated_at: row.job_updated_at,
            },
            user: crate::models::User {
                id: row.user_id,
                email: row.email,
                password_hash: row.password_hash,
                first_name: row.first_name,
                last_name: row.last_name,
                role: row.role,
                is_verified: row.is_verified,
                created_at: row.user_created_at,
                updated_at: row.user_updated_at,
            },
        })
        .collect();

    Ok(Json(applications_with_details))
}

async fn update_application_status(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    auth_user: AuthUser,
    Json(dto): Json<UpdateApplicationStatusDto>,
) -> Result<Json<Application>> {
    // Only allow admins to update application status
    if auth_user.role != "admin" {
        return Err(AppError::Forbidden("Only admins can update application status".to_string()));
    }

    let application = sqlx::query_as!(
        Application,
        r#"
        UPDATE applications
        SET status = $1
        WHERE id = $2
        RETURNING *
        "#,
        dto.status as _,
        id
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Application not found".to_string()))?;

    Ok(Json(application))
} 