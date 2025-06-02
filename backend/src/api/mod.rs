pub mod auth;
pub mod jobs;
pub mod companies;
pub mod applications;

use axum::{
    routing::{get, post},
    Router,
};

pub fn create_router() -> Router {
    Router::new()
        .merge(auth::router())
        .merge(jobs::router())
        .merge(companies::router())
        .merge(applications::router())
} 