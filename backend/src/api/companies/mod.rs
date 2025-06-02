use axum::{
    extract::{Path, Query, State},
    routing::{get, post, put, delete},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::companies::{Company, CreateCompanyDto, UpdateCompanyDto},
    utils::Result,
};

pub fn router() -> Router {
    Router::new()
        .route("/companies", get(list_companies))
        .route("/companies", post(create_company))
        .route("/companies/:id", get(get_company))
        .route("/companies/:id", put(update_company))
        .route("/companies/:id", delete(delete_company))
}

async fn list_companies(
    State(_pool): State<PgPool>,
) -> Result<Json<Vec<Company>>> {
    Err(crate::utils::AppError::NotImplemented("List companies not implemented".into()))
}

async fn create_company(
    State(_pool): State<PgPool>,
    Json(_payload): Json<CreateCompanyDto>,
) -> Result<Json<Company>> {
    Err(crate::utils::AppError::NotImplemented("Create company not implemented".into()))
}

async fn get_company(
    State(_pool): State<PgPool>,
    Path(_id): Path<Uuid>,
) -> Result<Json<Company>> {
    Err(crate::utils::AppError::NotImplemented("Get company not implemented".into()))
}

async fn update_company(
    State(_pool): State<PgPool>,
    Path(_id): Path<Uuid>,
    Json(_payload): Json<UpdateCompanyDto>,
) -> Result<Json<Company>> {
    Err(crate::utils::AppError::NotImplemented("Update company not implemented".into()))
}

async fn delete_company(
    State(_pool): State<PgPool>,
    Path(_id): Path<Uuid>,
) -> Result<Json<()>> {
    Err(crate::utils::AppError::NotImplemented("Delete company not implemented".into()))
} 