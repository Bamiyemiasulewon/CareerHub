use axum::{
    extract::State,
    http::StatusCode,
    routing::post,
    Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Deserialize)]
pub struct CreateApplicationRequest {
    pub job_id: String,
    pub cover_letter: Option<String>,
}

pub fn router(pool: PgPool) -> Router {
    Router::new()
        .route("/applications", post(create_application))
        .with_state(pool)
}

async fn create_application(
    State(_pool): State<PgPool>,
    Json(_payload): Json<CreateApplicationRequest>,
) -> Result<StatusCode, StatusCode> {
    // TODO: Implement create application logic
    Err(StatusCode::NOT_IMPLEMENTED)
}