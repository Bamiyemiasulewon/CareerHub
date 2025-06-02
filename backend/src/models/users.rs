use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool}; // Changed to PgPool for PostgreSQL
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use rand_core::OsRng;
use sqlx::Error;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub password_hash: String,
    pub name: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateUserDto {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
    #[validate(length(min = 1, max = 100))]
    pub name: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateUserDto {
    #[validate(email)]
    pub email: Option<String>,
    #[validate(length(min = 8))]
    pub password: Option<String>,
    #[validate(length(min = 1, max = 100))]
    pub name: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginDto {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

impl User {
    pub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = PasswordHash::generate(argon2, password.as_bytes(), &salt)?;
        Ok(password_hash.to_string())
    }

    pub fn verify_password(password: &str, password_hash: &str) -> Result<bool, argon2::password_hash::Error> {
        let parsed_hash = PasswordHash::new(password_hash)?;
        Ok(Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok())
    }

    pub async fn get_by_email(db: &PgPool, email: &str) -> Result<Option<Self>, Error> {
        let user = sqlx::query_as!(
            Self,
            r#"
            SELECT id, email, password_hash, name, created_at, updated_at
            FROM users
            WHERE email = $1
            "#,
            email
        )
        .fetch_optional(db)
        .await?;

        Ok(user)
    }
}