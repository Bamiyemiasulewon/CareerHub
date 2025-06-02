use sqlx::PgPool;

pub struct UserService {
    pub pool: PgPool,
}

impl UserService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // TODO: Add user-related methods
}