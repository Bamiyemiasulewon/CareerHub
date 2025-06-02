use serde::{Deserialize, Serialize};
use sqlx::{Type, FromRow};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::fmt;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Type)]
#[sqlx(type_name = "job_type", rename_all = "lowercase")]
pub enum JobType {
    Fulltime,
    Parttime,
    Contract,
    Internship,
    Remote,
}

impl fmt::Display for JobType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            JobType::Fulltime => write!(f, "fulltime"),
            JobType::Parttime => write!(f, "parttime"),
            JobType::Contract => write!(f, "contract"),
            JobType::Internship => write!(f, "internship"),
            JobType::Remote => write!(f, "remote"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
#[sqlx(type_name = "experience_level", rename_all = "lowercase")]
pub enum ExperienceLevel {
    Entry,
    Junior,
    Mid,
    Senior,
    Lead,
}

impl fmt::Display for ExperienceLevel {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ExperienceLevel::Entry => write!(f, "entry"),
            ExperienceLevel::Junior => write!(f, "junior"),
            ExperienceLevel::Mid => write!(f, "mid"),
            ExperienceLevel::Senior => write!(f, "senior"),
            ExperienceLevel::Lead => write!(f, "lead"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Job {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub company_id: Uuid,
    pub location: String,
    pub job_type: JobType,
    pub experience_level: ExperienceLevel,
    pub salary_range: serde_json::Value,
    pub skills: Vec<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateJobDto {
    #[validate(length(min = 1, max = 100))]
    pub title: String,
    #[validate(length(min = 1))]
    pub description: String,
    pub company_id: Uuid,
    #[validate(length(min = 1, max = 100))]
    pub location: String,
    pub job_type: JobType,
    pub experience_level: ExperienceLevel,
    pub salary_range: serde_json::Value,
    pub skills: Vec<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateJobDto {
    #[validate(length(min = 1, max = 100))]
    pub title: Option<String>,
    #[validate(length(min = 1))]
    pub description: Option<String>,
    #[validate(length(min = 1, max = 100))]
    pub location: Option<String>,
    pub job_type: Option<JobType>,
    pub experience_level: Option<ExperienceLevel>,
    pub salary_range: Option<serde_json::Value>,
    pub skills: Option<Vec<String>>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct JobQuery {
    pub title: Option<String>,
    pub location: Option<String>,
    pub job_type: Option<JobType>,
    pub experience_level: Option<ExperienceLevel>,
    pub skills: Option<Vec<String>>,
    pub search: Option<String>,
    pub page: Option<i64>,
    pub per_page: Option<i64>,
} 