use actix_web::{web, HttpResponse, Scope};
use sqlx::PgPool;
use validator::Validate;
use crate::models::jobs::{Job, CreateJobDto, UpdateJobDto, JobQuery};
use uuid::Uuid;

pub fn jobs_scope() -> Scope {
    web::scope("/jobs")
        .route("", web::get().to(list_jobs))
        .route("", web::post().to(create_job))
        .route("/{job_id}", web::get().to(get_job))
        .route("/{job_id}", web::put().to(update_job))
        .route("/{job_id}", web::delete().to(delete_job))
}

pub async fn list_jobs(
    pool: web::Data<PgPool>,
    query: web::Query<JobQuery>,
) -> HttpResponse {
    let mut sql = String::from("SELECT * FROM jobs WHERE 1=1");
    let mut params: Vec<String> = Vec::new();
    let mut param_count = 1;

    if let Some(title) = &query.title {
        sql.push_str(&format!(" AND title ILIKE ${}", param_count));
        params.push(format!("%{}%", title));
        param_count += 1;
    }

    if let Some(location) = &query.location {
        sql.push_str(&format!(" AND location ILIKE ${}", param_count));
        params.push(format!("%{}%", location));
        param_count += 1;
    }

    if let Some(job_type) = &query.job_type {
        sql.push_str(&format!(" AND job_type = ${}", param_count));
        params.push(job_type.to_string());
        param_count += 1;
    }

    if let Some(experience_level) = &query.experience_level {
        sql.push_str(&format!(" AND experience_level = ${}", param_count));
        params.push(experience_level.to_string());
        param_count += 1;
    }

    if let Some(skills) = &query.skills {
        for skill in skills {
            sql.push_str(&format!(" AND ${} = ANY(skills)", param_count));
            params.push(skill.clone());
            param_count += 1;
        }
    }

    if let Some(search) = &query.search {
        sql.push_str(&format!(" AND (title ILIKE ${} OR description ILIKE ${})", param_count, param_count + 1));
        params.push(format!("%{}%", search));
        params.push(format!("%{}%", search));
    }

    let page = query.page.unwrap_or(1);
    let per_page = query.per_page.unwrap_or(10);
    let offset = (page - 1) * per_page;

    sql.push_str(&format!(" ORDER BY created_at DESC LIMIT {} OFFSET {}", per_page, offset));

    let result = sqlx::query_as::<_, Job>(&sql)
        .bind(&params)
        .fetch_all(&**pool)
        .await;

    match result {
        Ok(jobs) => HttpResponse::Ok().json(jobs),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn get_job(
    pool: web::Data<PgPool>,
    job_id: web::Path<Uuid>,
) -> HttpResponse {
    let result = sqlx::query_as!(
        Job,
        r#"
        SELECT id, title, description, company_id, location, job_type as "job_type: _", 
               experience_level as "experience_level: _", salary_range, skills, is_active, 
               created_at, updated_at
        FROM jobs
        WHERE id = $1
        "#,
        *job_id
    )
    .fetch_optional(&**pool)
    .await;

    match result {
        Ok(Some(job)) => HttpResponse::Ok().json(job),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn create_job(
    pool: web::Data<PgPool>,
    job_dto: web::Json<CreateJobDto>,
) -> HttpResponse {
    if let Err(_) = job_dto.validate() {
        return HttpResponse::BadRequest().finish();
    }

    let result = sqlx::query_as!(
        Job,
        r#"
        INSERT INTO jobs (title, description, company_id, location, job_type, experience_level,
                         salary_range, skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, title, description, company_id, location, job_type as "job_type: _",
                  experience_level as "experience_level: _", salary_range, skills, is_active,
                  created_at, updated_at
        "#,
        job_dto.title,
        job_dto.description,
        job_dto.company_id,
        job_dto.location,
        job_dto.job_type as _,
        job_dto.experience_level as _,
        job_dto.salary_range,
        &job_dto.skills
    )
    .fetch_one(&**pool)
    .await;

    match result {
        Ok(job) => HttpResponse::Created().json(job),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn update_job(
    pool: web::Data<PgPool>,
    job_id: web::Path<Uuid>,
    job_dto: web::Json<UpdateJobDto>,
) -> HttpResponse {
    if let Err(_) = job_dto.validate() {
        return HttpResponse::BadRequest().finish();
    }

    let mut sql = String::from("UPDATE jobs SET");
    let mut params: Vec<String> = Vec::new();
    let mut param_count = 1;

    if let Some(title) = &job_dto.title {
        sql.push_str(&format!(" title = ${},", param_count));
        params.push(title.clone());
        param_count += 1;
    }

    if let Some(description) = &job_dto.description {
        sql.push_str(&format!(" description = ${},", param_count));
        params.push(description.clone());
        param_count += 1;
    }

    if let Some(location) = &job_dto.location {
        sql.push_str(&format!(" location = ${},", param_count));
        params.push(location.clone());
        param_count += 1;
    }

    if let Some(job_type) = &job_dto.job_type {
        sql.push_str(&format!(" job_type = ${},", param_count));
        params.push(job_type.to_string());
        param_count += 1;
    }

    if let Some(experience_level) = &job_dto.experience_level {
        sql.push_str(&format!(" experience_level = ${},", param_count));
        params.push(experience_level.to_string());
        param_count += 1;
    }

    if let Some(salary_range) = &job_dto.salary_range {
        sql.push_str(&format!(" salary_range = ${},", param_count));
        params.push(serde_json::to_string(salary_range).unwrap());
        param_count += 1;
    }

    if let Some(skills) = &job_dto.skills {
        sql.push_str(&format!(" skills = ${},", param_count));
        params.push(serde_json::to_string(skills).unwrap());
        param_count += 1;
    }

    if let Some(is_active) = job_dto.is_active {
        sql.push_str(&format!(" is_active = ${},", param_count));
        params.push(is_active.to_string());
        param_count += 1;
    }

    sql.push_str(" updated_at = CURRENT_TIMESTAMP");
    sql.push_str(&format!(" WHERE id = ${}", param_count));
    params.push(job_id.to_string());

    sql.push_str(" RETURNING id, title, description, company_id, location, job_type as \"job_type: _\", experience_level as \"experience_level: _\", salary_range, skills, is_active, created_at, updated_at");

    let result = sqlx::query_as::<_, Job>(&sql)
        .bind(&params)
        .fetch_optional(&**pool)
        .await;

    match result {
        Ok(Some(job)) => HttpResponse::Ok().json(job),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn delete_job(
    pool: web::Data<PgPool>,
    job_id: web::Path<Uuid>,
) -> HttpResponse {
    let result = sqlx::query!(
        r#"
        DELETE FROM jobs
        WHERE id = $1
        "#,
        *job_id
    )
    .execute(&**pool)
    .await;

    match result {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
} 