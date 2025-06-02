use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use sqlx::postgres::PgPoolOptions;
use dotenv::dotenv;
use std::env;
use chrono::Duration;

mod models;
mod routes;
mod auth;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    let jwt_config = auth::jwt::JwtConfig {
        secret: jwt_secret,
        expiration: Duration::hours(24),
    };

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(jwt_config.clone()))
            .service(
                web::scope("/api")
                    .service(routes::auth::auth_scope())
                    .service(
                        web::scope("")
                            .wrap(auth::middleware::AuthMiddleware::new(jwt_config.clone()))
                            .service(routes::jobs::jobs_scope())
                            .service(routes::companies::companies_scope())
                            .service(routes::users::users_scope())
                    )
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
        .await
}