use sqlx::PgPool;

pub struct AuthService {
    pub pool: PgPool,
}

impl AuthService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // TODO: Add authentication methods
}