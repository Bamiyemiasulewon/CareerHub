use axum::{
    extract::{Path, State},
    routing::{get, put},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::{
    config::Config,
    models::{UpdateUserDto, User},
    utils::{
        auth::{auth_middleware, AuthUser},
        error::{AppError, Result},
    },
};

pub fn router() -> Router {
    Router::new()
        .route("/profile", get(get_profile))
        .route("/profile", put(update_profile))
        .layer(axum::middleware::from_fn(auth_middleware))
}

async fn get_profile(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
) -> Result<Json<User>> {
    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE id = $1",
        auth_user.id
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

    Ok(Json(user))
}

async fn update_profile(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Json(dto): Json<UpdateUserDto>,
) -> Result<Json<User>> {
    dto.validate()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    let user = sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name)
        WHERE id = $3
        RETURNING *
        "#,
        dto.first_name,
        dto.last_name,
        auth_user.id
    )
    .fetch_optional(&pool)
    .await?
    .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

    Ok(Json(user))
} 