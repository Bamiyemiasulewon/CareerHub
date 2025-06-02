use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Serialize, Deserialize)]
pub struct Job {
    pub id: String,
    pub title: String,
    pub description: String,
    pub company: String,
    pub location: String,
}

#[derive(Deserialize)]
pub struct CreateJobRequest {
    pub title: String,
    pub description: String,
    pub company: String,
    pub location: String,
}

pub fn router(pool: PgPool) -> Router {
    Router::new()
        .route("/jobs", get(get_jobs).post(create_job))
        .with_state(pool)
}

async fn get_jobs(
    State(_pool): State<PgPool>,
) -> Result<Json<Vec<Job>>, StatusCode> {
    // TODO: Implement get jobs logic
    Ok(Json(vec![]))
}

async fn create_job(
    State(_pool): State<PgPool>,
    Json(_payload): Json<CreateJobRequest>,
) -> Result<Json<Job>, StatusCode> {
    // TODO: Implement create job logic
    Err(StatusCode::NOT_IMPLEMENTED)
}