use serde::Deserialize;
use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expires_in: i64,
    pub refresh_token_expires_in: i64,
    pub server_port: u16,
    pub environment: Environment,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Environment {
    Development,
    Production,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        Ok(Config {
            database_url: env::var("DATABASE_URL")?,
            jwt_secret: env::var("JWT_SECRET")?,
            jwt_expires_in: env::var("JWT_EXPIRES_IN")
                .unwrap_or_else(|_| "3600".to_string())
                .parse()
                .unwrap_or(3600),
            refresh_token_expires_in: env::var("REFRESH_TOKEN_EXPIRES_IN")
                .unwrap_or_else(|_| "604800".to_string())
                .parse()
                .unwrap_or(604800),
            server_port: env::var("PORT")
                .unwrap_or_else(|_| "3000".to_string())
                .parse()
                .unwrap_or(3000),
            environment: match env::var("ENVIRONMENT")
                .unwrap_or_else(|_| "development".to_string())
                .as_str()
            {
                "production" => Environment::Production,
                _ => Environment::Development,
            },
        })
    }
}

#[derive(Debug, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
}

impl Default for DatabaseConfig {
    fn default() -> Self {
        Self {
            url: "postgres://postgres:postgres@localhost:5432/careerhub".to_string(),
            max_connections: 5,
        }
    }
} 