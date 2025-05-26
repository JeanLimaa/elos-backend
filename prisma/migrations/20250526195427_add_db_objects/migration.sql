/* Função que calcula o tempo desde a denúncia */
CREATE FUNCTION days_since_event(event_date DATETIME)
RETURNS INT
DETERMINISTIC
RETURN DATEDIFF(CURDATE(), event_date);

/* Lista de denúncias com nome de usuário e status  */
CREATE VIEW view_complaints_with_user AS
SELECT
    c.id AS complaint_id,
    u.name AS user_name,
    u.email AS user_email,
    c.title AS complaint_title,
    c.type AS complaint_type,
    c.status AS complaint_status,
    c.createdAt AS complaint_created_at
FROM complaint c
JOIN user u ON c.userId = u.id;

/* Encerrar denúncias IN_REVIEW há mais de 30 dias */
CREATE PROCEDURE close_old_complaints()
BEGIN
    UPDATE complaint
    SET status = 'COMPLETED'
    WHERE status = 'IN_REVIEW'
      AND DATEDIFF(CURDATE(), createdAt) > 30;
END;
