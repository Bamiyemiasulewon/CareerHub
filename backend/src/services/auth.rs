use sqlx::PgPool;
use uuid::Uuid;
use bcrypt::{hash, verify, DEFAULT_COST};

use crate::{
    models::auth::{AuthUser, LoginRequest, RegisterRequest},
    utils::{AppError, Result},
};

pub async fn register(
    pool: &PgPool,
    req: RegisterRequest,
) -> Result<AuthUser> {
    let password_hash = hash(req.password.as_bytes(), DEFAULT_COST)
        .map_err(|_| AppError::Internal("Failed to hash password".into()))?;

    let user = sqlx::query_as!(
        AuthUser,
        r#"
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, role as "role: _"
        "#,
        req.email,
        password_hash,
        req.first_name,
        req.last_name,
    )
    .fetch_one(pool)
    .await?;

    Ok(user)
}

pub async fn login(
    pool: &PgPool,
    req: LoginRequest,
) -> Result<AuthUser> {
    let user = sqlx::query_as!(
        AuthUser,
        r#"
        SELECT id, email, role as "role: _"
        FROM users
        WHERE email = $1
        "#,
        req.email,
    )
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::Auth("Invalid credentials".into()))?;

    let password_hash = sqlx::query!(
        r#"
        SELECT password_hash
        FROM users
        WHERE id = $1
        "#,
        user.id
    )
    .fetch_one(pool)
    .await?
    .password_hash;

    if !verify(req.password, &password_hash)
        .map_err(|_| AppError::Internal("Failed to verify password".into()))?
    {
        return Err(AppError::Auth("Invalid credentials".into()));
    }

    Ok(user)
} 