use axum::{
    extract::State,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};
use sqlx::PgPool;
use tower_cookies::Cookies;
use uuid::Uuid;

use crate::{
    config::Config,
    models::User,
    utils::{error::AppError, jwt::validate_token},
};

#[derive(Clone)]
pub struct AuthUser {
    pub id: Uuid,
    pub role: String,
}

pub async fn auth_middleware<B>(
    State(config): State<Config>,
    State(pool): State<PgPool>,
    cookies: Cookies,
    req: Request<B>,
    next: Next<B>,
) -> Result<Response, AppError> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|header| header.to_str().ok())
        .ok_or_else(|| AppError::Auth("Missing authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Auth("Invalid token format".to_string()))?;

    let claims = validate_token(token, &config.jwt_secret)
        .map_err(|_| AppError::Auth("Invalid token".to_string()))?;

    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE id = $1",
        Uuid::parse_str(&claims.sub).map_err(|_| AppError::Auth("Invalid user ID".to_string()))?
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::Auth("User not found".to_string()))?;

    let auth_user = AuthUser {
        id: user.id,
        role: user.role.to_string(),
    };

    let mut req = req;
    req.extensions_mut().insert(auth_user);

    Ok(next.run(req).await)
}

pub async fn admin_middleware<B>(
    State(config): State<Config>,
    State(pool): State<PgPool>,
    cookies: Cookies,
    req: Request<B>,
    next: Next<B>,
) -> Result<Response, AppError> {
    let auth_user = auth_middleware(State(config), State(pool), cookies, req, next).await?;

    if auth_user.role != "admin" {
        return Err(AppError::Forbidden("Admin access required".to_string()));
    }

    Ok(auth_user)
} 