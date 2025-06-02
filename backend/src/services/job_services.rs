use sqlx::PgPool;

pub struct JobService {
    pub pool: PgPool,
}

impl JobService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // TODO: Add job-related methods
}