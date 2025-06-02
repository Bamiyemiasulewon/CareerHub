use axum::{
    extract::State,
    routing::post,
    Json, Router,
};
use sqlx::PgPool;
use crate::{
    models::auth::{AuthResponse, LoginRequest, RegisterRequest, AuthUser},
    services::auth,
    utils::Result,
};

pub fn router() -> Router {
    Router::new()
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
}

async fn register(
    State(pool): State<PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>> {
    let user = auth::register(&pool, payload).await?;
    let token = crate::utils::jwt::create_token(&user, "your-secret-key")?;

    Ok(Json(AuthResponse {
        token,
        user,
    }))
}

async fn login(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>> {
    let user = auth::login(&pool, payload).await?;
    let token = crate::utils::jwt::create_token(&user, "your-secret-key")?;

    Ok(Json(AuthResponse {
        token,
        user,
    }))
}