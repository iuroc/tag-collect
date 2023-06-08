package db

import (
	"database/sql"
)

// 插入验证码记录
func InsertVerCode(conn *sql.DB, email string, verCode string) error {
	RemoveVerCode(conn, email)
	stmp, _ := conn.Prepare("INSERT INTO tag_collect_ver_code (email, ver_code) VALUES (?, ?)")
	if _, err := stmp.Exec(email, verCode); err != nil {
		return err
	}
	return nil
}

// 移除验证码记录
func RemoveVerCode(conn *sql.DB, email string) error {
	_, err := conn.Exec("DELETE FROM tag_collect_ver_code WHERE email = '" + email + "'")
	return err
}

// 检查是否允许发送验证码
func CheckVerCodeAllow(conn *sql.DB, to string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_ver_code WHERE email = '" + to + "' AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 1 MINUTE)").Scan(&count)
	return count == 0
}

// 校验验证码
func CheckVerCode(conn *sql.DB, email string, verCode string) bool {
	var count int
	stmp, _ := conn.Prepare("SELECT COUNT(*) FROM tag_collect_ver_code WHERE email = ? AND ver_code = ? AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 5 MINUTE)")
	stmp.QueryRow(email, verCode).Scan(&count)
	if count > 0 {
		// 校验成功，移除验证码记录
		RemoveVerCode(conn, email)
	}
	return count > 0
}
