use serde::{Deserialize, Serialize};
use sqlx::{Type, FromRow};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Type)]
#[sqlx(type_name = "application_status", rename_all = "lowercase")]
pub enum ApplicationStatus {
    Pending,
    UnderReview,
    Shortlisted,
    Rejected,
    Accepted,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Application {
    pub id: Uuid,
    pub user_id: Uuid,
    pub job_id: Uuid,
    pub status: ApplicationStatus,
    pub resume_url: String,
    pub cover_letter: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ApplicationWithDetails {
    pub id: Uuid,
    pub user_id: Uuid,
    pub job_id: Uuid,
    pub status: ApplicationStatus,
    pub resume_url: String,
    pub cover_letter: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub job_title: String,
    pub company_name: String,
    pub user_email: String,
    pub user_name: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateApplicationDto {
    pub job_id: Uuid,
    #[validate(url)]
    pub resume_url: String,
    pub cover_letter: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateApplicationStatusDto {
    pub status: ApplicationStatus,
} 