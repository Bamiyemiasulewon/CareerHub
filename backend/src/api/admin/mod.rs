use axum::{
    extract::State,
    http::StatusCode,
    routing::get,
    Json, Router,
};
use sqlx::PgPool;

pub fn router(pool: PgPool) -> Router {
    Router::new()
        .route("/admin/stats", get(get_stats))
        .with_state(pool)
}

async fn get_stats(
    State(_pool): State<PgPool>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // TODO: Implement admin stats logic
    Err(StatusCode::NOT_IMPLEMENTED)
}