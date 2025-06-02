use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Company {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub website: Option<String>,
    pub logo_url: Option<String>,
    pub location: String,
    pub industry: String,
    pub size: CompanySize,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "company_size", rename_all = "lowercase")]
pub enum CompanySize {
    Small,
    Medium,
    Large,
    Enterprise,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateCompanyDto {
    #[validate(length(min = 2, max = 100))]
    pub name: String,
    #[validate(length(min = 50))]
    pub description: String,
    #[validate(url)]
    pub website: Option<String>,
    #[validate(url)]
    pub logo_url: Option<String>,
    #[validate(length(min = 2))]
    pub location: String,
    #[validate(length(min = 2))]
    pub industry: String,
    pub size: CompanySize,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateCompanyDto {
    #[validate(length(min = 2, max = 100))]
    pub name: Option<String>,
    #[validate(length(min = 50))]
    pub description: Option<String>,
    #[validate(url)]
    pub website: Option<String>,
    #[validate(url)]
    pub logo_url: Option<String>,
    #[validate(length(min = 2))]
    pub location: Option<String>,
    #[validate(length(min = 2))]
    pub industry: Option<String>,
    pub size: Option<CompanySize>,
} 