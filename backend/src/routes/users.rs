use actix_web::{web, HttpResponse, Scope};
use sqlx::PgPool;
use validator::Validate;
use crate::{
    models::users::{User, UpdateUserDto},
    auth::jwt::Claims,
};

pub fn users_scope() -> Scope {
    web::scope("/users")
        .route("/profile", web::get().to(get_profile))
        .route("/profile", web::put().to(update_profile))
}

pub async fn get_profile(
    pool: web::Data<PgPool>,
    claims: web::ReqData<Claims>,
) -> HttpResponse {
    let user_id = uuid::Uuid::parse_str(&claims.sub).unwrap();

    let result = sqlx::query_as!(
        User,
        r#"
        SELECT id, email, password_hash, name, created_at, updated_at
        FROM users
        WHERE id = $1
        "#,
        user_id
    )
    .fetch_optional(&**pool)
    .await;

    match result {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn update_profile(
    pool: web::Data<PgPool>,
    claims: web::ReqData<Claims>,
    user_dto: web::Json<UpdateUserDto>,
) -> HttpResponse {
    if let Err(_) = user_dto.validate() {
        return HttpResponse::BadRequest().finish();
    }

    let user_id = uuid::Uuid::parse_str(&claims.sub).unwrap();

    let mut sql = String::from("UPDATE users SET");
    let mut params: Vec<String> = Vec::new();
    let mut param_count = 1;

    if let Some(email) = &user_dto.email {
        sql.push_str(&format!(" email = ${},", param_count));
        params.push(email.clone());
        param_count += 1;
    }

    if let Some(password) = &user_dto.password {
        sql.push_str(&format!(" password_hash = ${},", param_count));
        params.push(crate::models::User::hash_password(password).unwrap());
        param_count += 1;
    }

    if let Some(name) = &user_dto.name {
        sql.push_str(&format!(" name = ${},", param_count));
        params.push(name.clone());
        param_count += 1;
    }

    sql.push_str(" updated_at = CURRENT_TIMESTAMP");
    sql.push_str(&format!(" WHERE id = ${}", param_count));
    params.push(user_id.to_string());

    sql.push_str(" RETURNING id, email, password_hash, name, created_at, updated_at");

    let result = sqlx::query_as::<_, User>(&sql)
        .bind(&params[0])
        .bind(&params[1])
        .bind(&params[2])
        .bind(&params[3])
        .fetch_optional(&**pool)
        .await;

    match result {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
} 