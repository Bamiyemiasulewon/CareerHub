use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
};
use futures::future::{ready, LocalBoxFuture, Ready};
use std::rc::Rc;
use crate::auth::jwt::{JwtConfig, validate_token};
use actix_web::error::ErrorUnauthorized;

pub struct AuthMiddleware {
    config: JwtConfig,
}

impl AuthMiddleware {
    pub fn new(config: JwtConfig) -> Self {
        Self { config }
    }
}

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddlewareService<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddlewareService {
            service: Rc::new(service),
            config: self.config.clone(),
        }))
    }
}

pub struct AuthMiddlewareService<S> {
    service: Rc<S>,
    config: JwtConfig,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let service = Rc::clone(&self.service);
        let config = self.config.clone();

        Box::pin(async move {
            let auth_header = req
                .headers()
                .get("Authorization")
                .and_then(|h| h.to_str().ok())
                .and_then(|s| s.strip_prefix("Bearer "));

            match auth_header {
                Some(token) => {
                    match validate_token(token, &config) {
                        Ok(_claims) => {
                            let res = service.call(req).await?;
                            Ok(res)
                        }
                        Err(_) => Err(ErrorUnauthorized("Invalid token")),
                    }
                }
                None => Err(ErrorUnauthorized("Missing token")),
            }
        })
    }
} 