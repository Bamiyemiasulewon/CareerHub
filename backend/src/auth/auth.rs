pub async fn get_by_email(db: &Database, email: &str) -> Result<Option<Self>, Error> {
    let user = sqlx::query_as!(
        Self,
        r#"
        SELECT id, email, password_hash, name, role, created_at, updated_at
        FROM users
        WHERE email = $1
        "#,
        email
    )
    .fetch_optional(db)
    .await?;

    Ok(user)
} 