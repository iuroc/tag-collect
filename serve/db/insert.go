package db

import (
	"database/sql"
)

// 插入验证码记录
func InsertVerCode(conn *sql.DB, to string, verCode string) error {
	if _, err := conn.Exec("DELETE FROM tag_collect_ver_code WHERE email = '" + to + "'"); err != nil {
		return err
	}
	stmp, _ := conn.Prepare("INSERT INTO tag_collect_ver_code (email, ver_code) VALUES (?, ?)")
	if _, err := stmp.Exec(to, verCode); err != nil {
		return err
	}
	return nil
}

// 检查是否允许发送验证码
func CheckVerCodeAllow(conn *sql.DB, to string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_ver_code WHERE email = '" + to + "' AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 1 MINUTE)").Scan(&count)
	return count == 0
}
