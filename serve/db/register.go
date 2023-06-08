package db

import (
	"database/sql"
)

// 判断用户是否存在
func CheckUserExists(conn *sql.DB, username string, email string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_user WHERE username = '" + username + "' OR email = '" + email + "'").Scan(&count)
	return count != 0
}
