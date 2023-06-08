package db

import (
	"database/sql"
	"tag-collect/serve/util"
)

// 判断用户是否存在
func CheckUserExists(conn *sql.DB, username string, email string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_user WHERE username = '" + username + "' OR email = '" + email + "'").Scan(&count)
	return count != 0
}

// 插入 Token 记录
func InsertToken(conn *sql.DB, username string) (string, error) {
	token, _ := util.MakeToken(128)
	_, err := conn.Exec("INSERT INTO tag_collect_token (username, token) VALUES ('" + username + "', '" + token + "')")
	return token, err
}
