use axum::{
    extract::State,
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::Serialize;
use sqlx::PgPool;

#[derive(Serialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub full_name: String,
}

pub fn router(pool: PgPool) -> Router {
    Router::new()
        .route("/users/profile", get(get_profile))
        .with_state(pool)
}

async fn get_profile(
    State(_pool): State<PgPool>,
) -> Result<Json<User>, StatusCode> {
    // TODO: Implement get profile logic
    Err(StatusCode::NOT_IMPLEMENTED)
}