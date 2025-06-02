use bcrypt::{hash, verify, DEFAULT_COST};
use crate::utils::{AppError, Result};

pub fn hash_password(password: &str) -> Result<String> {
    hash(password.as_bytes(), DEFAULT_COST)
        .map_err(|_| AppError::Internal("Failed to hash password".into()))
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
    verify(password, hash)
        .map_err(|_| AppError::Internal("Failed to verify password".into()))
} 