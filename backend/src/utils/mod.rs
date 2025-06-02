pub mod jwt;
pub mod password;
pub mod error;

pub use error::AppError;
pub type Result<T> = std::result::Result<T, AppError>; 