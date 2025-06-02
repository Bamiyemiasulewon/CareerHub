use actix_web::{web, HttpResponse, Responder, Scope};
use sqlx::PgPool;
use validator::Validate;
use crate::models::companies::{Company, CreateCompanyDto, UpdateCompanyDto};

pub fn companies_scope() -> Scope {
    web::scope("/companies")
        .route("", web::get().to(list_companies))
        .route("", web::post().to(create_company))
        .route("/{company_id}", web::get().to(get_company))
        .route("/{company_id}", web::put().to(update_company))
        .route("/{company_id}", web::delete().to(delete_company))
}

pub async fn list_companies(
    pool: web::Data<PgPool>,
) -> impl Responder {
    let companies = sqlx::query_as!(
        Company,
        r#"
        SELECT id, name, description, location, website, created_at, updated_at
        FROM companies
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(&**pool)
    .await;

    match companies {
        Ok(companies) => HttpResponse::Ok().json(companies),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn get_company(
    pool: web::Data<PgPool>,
    company_id: web::Path<uuid::Uuid>,
) -> impl Responder {
    let company = sqlx::query_as!(
        Company,
        r#"
        SELECT id, name, description, location, website, created_at, updated_at
        FROM companies
        WHERE id = $1
        "#,
        *company_id
    )
    .fetch_optional(&**pool)
    .await;

    match company {
        Ok(Some(company)) => HttpResponse::Ok().json(company),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn create_company(
    pool: web::Data<PgPool>,
    company_dto: web::Json<CreateCompanyDto>,
) -> impl Responder {
    if let Err(e) = company_dto.validate() {
        return HttpResponse::BadRequest().json(e);
    }

    let result = sqlx::query_as!(
        Company,
        r#"
        INSERT INTO companies (name, description, location, website)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, description, location, website, created_at, updated_at
        "#,
        company_dto.name,
        company_dto.description,
        company_dto.location,
        company_dto.website
    )
    .fetch_one(&**pool)
    .await;

    match result {
        Ok(company) => HttpResponse::Created().json(company),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn update_company(
    pool: web::Data<PgPool>,
    company_id: web::Path<uuid::Uuid>,
    company_dto: web::Json<UpdateCompanyDto>,
) -> impl Responder {
    if let Err(e) = company_dto.validate() {
        return HttpResponse::BadRequest().json(e);
    }

    let mut sql = String::from(
        r#"
        UPDATE companies
        SET
        "#,
    );

    let mut params: Vec<String> = Vec::new();
    let mut param_count = 1;
    let mut updates = Vec::new();

    if let Some(name) = &company_dto.name {
        updates.push(format!("name = ${}", param_count));
        params.push(name.clone());
        param_count += 1;
    }

    if let Some(description) = &company_dto.description {
        updates.push(format!("description = ${}", param_count));
        params.push(description.clone());
        param_count += 1;
    }

    if let Some(location) = &company_dto.location {
        updates.push(format!("location = ${}", param_count));
        params.push(location.clone());
        param_count += 1;
    }

    if let Some(website) = &company_dto.website {
        updates.push(format!("website = ${}", param_count));
        params.push(website.clone());
        param_count += 1;
    }

    if updates.is_empty() {
        return HttpResponse::BadRequest().json("No fields to update");
    }

    sql.push_str(&updates.join(", "));
    sql.push_str(&format!(
        r#"
        , updated_at = CURRENT_TIMESTAMP
        WHERE id = ${}
        RETURNING id, name, description, location, website, created_at, updated_at
        "#,
        param_count
    ));
    params.push(company_id.to_string());

    let result = sqlx::query_as::<_, Company>(&sql)
        .bind(&params[0])
        .bind(&params[1])
        .bind(&params[2])
        .bind(&params[3])
        .bind(&params[4])
        .fetch_optional(&**pool)
        .await;

    match result {
        Ok(Some(company)) => HttpResponse::Ok().json(company),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn delete_company(
    pool: web::Data<PgPool>,
    company_id: web::Path<uuid::Uuid>,
) -> impl Responder {
    let result = sqlx::query!(
        r#"
        DELETE FROM companies
        WHERE id = $1
        "#,
        *company_id
    )
    .execute(&**pool)
    .await;

    match result {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
} 