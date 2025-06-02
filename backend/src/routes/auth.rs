use actix_web::{web, HttpResponse, Responder, Scope};
use sqlx::PgPool;
use validator::Validate;
use crate::{
    models::users::{User, CreateUserDto, LoginDto},
    auth::jwt::{JwtConfig, generate_token},
};

pub fn auth_scope() -> Scope {
    web::scope("/auth")
        .route("/register", web::post().to(register))
        .route("/login", web::post().to(login))
}

pub async fn register(
    pool: web::Data<PgPool>,
    user_dto: web::Json<CreateUserDto>,
) -> impl Responder {
    if let Err(e) = user_dto.validate() {
        return HttpResponse::BadRequest().json(e);
    }

    let password_hash = match User::hash_password(&user_dto.password) {
        Ok(hash) => hash,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let result = sqlx::query!(
        r#"
        INSERT INTO users (email, password_hash, name)
        VALUES ($1, $2, $3)
        RETURNING id
        "#,
        user_dto.email,
        password_hash,
        user_dto.name
    )
    .fetch_one(&**pool)
    .await;

    match result {
        Ok(record) => HttpResponse::Created().json(record.id),
        Err(e) => {
            if e.as_database_error()
                .and_then(|e| e.code())
                .map(|code| code == "23505")
                .unwrap_or(false)
            {
                HttpResponse::Conflict().json("Email already exists")
            } else {
                HttpResponse::InternalServerError().finish()
            }
        }
    }
}

pub async fn login(
    pool: web::Data<PgPool>,
    jwt_config: web::Data<JwtConfig>,
    login_dto: web::Json<LoginDto>,
) -> impl Responder {
    if let Err(e) = login_dto.validate() {
        return HttpResponse::BadRequest().json(e);
    }

    let user = sqlx::query_as!(
        User,
        r#"
        SELECT id, email, password_hash, name, created_at, updated_at
        FROM users
        WHERE email = $1
        "#,
        login_dto.email
    )
    .fetch_optional(&**pool)
    .await;

    match user {
        Ok(Some(user)) => {
            if User::verify_password(&login_dto.password, &user.password_hash).unwrap_or(false) {
                match generate_token(user.id, &jwt_config) {
                    Ok(token) => HttpResponse::Ok().json(serde_json::json!({
                        "token": token,
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "name": user.name
                        }
                    })),
                    Err(_) => HttpResponse::InternalServerError().finish(),
                }
            } else {
                HttpResponse::Unauthorized().json("Invalid credentials")
            }
        }
        Ok(None) => HttpResponse::Unauthorized().json("Invalid credentials"),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
} 