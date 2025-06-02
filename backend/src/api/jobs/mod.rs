use axum::{
    extract::{Path, Query, State},
    routing::{delete, get, post, put},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{
    config::Config,
    models::{CreateJobDto, Job, JobQuery, UpdateJobDto},
    utils::{
        auth::{auth_middleware, AuthUser},
        error::{AppError, Result},
    },
};

pub fn router() -> Router {
    Router::new()
        .route("/", get(list_jobs))
        .route("/", post(create_job))
        .route("/:id", get(get_job))
        .route("/:id", put(update_job))
        .route("/:id", delete(delete_job))
        .layer(axum::middleware::from_fn(auth_middleware))
}

async fn list_jobs(
    State(pool): State<PgPool>,
    Query(query): Query<JobQuery>,
) -> Result<Json<Vec<Job>>> {
    let mut sql = String::from("SELECT * FROM jobs WHERE 1=1");
    let mut params: Vec<String> = Vec::new();
    let mut param_count = 1;

    if let Some(search) = query.search {
        sql.push_str(&format!(
            " AND (title ILIKE ${} OR description ILIKE ${})",
            param_count, param_count
        ));
        params.push(format!("%{}%", search));
        param_count += 1;
    }

    if let Some(job_type) = query.job_type {
        sql.push_str(&format!(" AND job_type = ${}", param_count));
        params.push(job_type.to_string());
        param_count += 1;
    }

    if let Some(experience_level) = query.experience_level {
        sql.push_str(&format!(" AND experience_level = ${}", param_count));
        params.push(experience_level.to_string());
        param_count += 1;
    }

    if let Some(location) = query.location {
        sql.push_str(&format!(" AND location ILIKE ${}", param_count));
        params.push(format!("%{}%", location));
        param_count += 1;
    }

    if let Some(skills) = query.skills {
        sql.push_str(&format!(" AND skills && ${}", param_count));
        params.push(format!("{{{}}}", skills.join(",")));
        param_count += 1;
    }

    let page = query.page.unwrap_or(1);
    let per_page = query.per_page.unwrap_or(10);
    let offset = (page - 1) * per_page;

    sql.push_str(&format!(" LIMIT {} OFFSET {}", per_page, offset));

    let jobs = sqlx::query_as::<_, Job>(&sql)
        .bind(&params)
        .fetch_all(&pool)
        .await?;

    Ok(Json(jobs))
}

async fn create_job(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Json(dto): Json<CreateJobDto>,
) -> Result<Json<Job>> {
    dto.validate()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    let job = sqlx::query_as!(
        Job,
        r#"
        INSERT INTO jobs (title, description, company_id, location, job_type, experience_level, salary_range, skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        "#,
        dto.title,
        dto.description,
        dto.company_id,
        dto.location,
        dto.job_type as _,
        dto.experience_level as _,
        dto.salary_range as _,
        &dto.skills
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(job))
}

async fn get_job(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Job>> {
    let job = sqlx::query_as!(
        Job,
        "SELECT * FROM jobs WHERE id = $1",
        id
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Job not found".to_string()))?;

    Ok(Json(job))
}

async fn update_job(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(dto): Json<UpdateJobDto>,
) -> Result<Json<Job>> {
    dto.validate()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    let job = sqlx::query_as!(
        Job,
        r#"
        UPDATE jobs
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            location = COALESCE($3, location),
            job_type = COALESCE($4, job_type),
            experience_level = COALESCE($5, experience_level),
            salary_range = COALESCE($6, salary_range),
            skills = COALESCE($7, skills),
            is_active = COALESCE($8, is_active)
        WHERE id = $9
        RETURNING *
        "#,
        dto.title,
        dto.description,
        dto.location,
        dto.job_type as _,
        dto.experience_level as _,
        dto.salary_range as _,
        dto.skills as _,
        dto.is_active,
        id
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("Job not found".to_string()))?;

    Ok(Json(job))
}

async fn delete_job(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<()>> {
    sqlx::query!("DELETE FROM jobs WHERE id = $1", id)
        .execute(&pool)
        .await?;

    Ok(Json(()))
} 