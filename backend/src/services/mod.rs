pub mod auth;
pub mod jobs;
pub mod companies;
pub mod applications;

use sqlx::PgPool;
use crate::config::Config;

pub struct AppState {
    pub db: PgPool,
    pub config: Config,
} 