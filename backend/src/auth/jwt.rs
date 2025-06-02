use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{Duration, Utc};
use std::env;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,  // user id
    pub exp: i64,     // expiration time
    pub iat: i64,     // issued at
}

#[derive(Clone)]
pub struct JwtConfig {
    pub secret: String,
    pub expiration: Duration,
}

impl JwtConfig {
    pub fn from_env() -> Self {
        Self {
            secret: env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            expiration: Duration::hours(24),
        }
    }
}

pub fn generate_token(user_id: Uuid, config: &JwtConfig) -> Result<String, jsonwebtoken::errors::Error> {
    let now = Utc::now();
    let exp = (now + config.expiration).timestamp();
    let iat = now.timestamp();

    let claims = Claims {
        sub: user_id.to_string(),
        exp,
        iat,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.secret.as_bytes()),
    )
}

pub fn validate_token(token: &str, config: &JwtConfig) -> Result<Claims, jsonwebtoken::errors::Error> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(config.secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
} 