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
	if err := RemoveToken(conn, username); err != nil {
		return "", err
	}
	token, _ := util.MakeToken(128)
	_, err := conn.Exec("INSERT INTO tag_collect_token (username, token) VALUES ('" + username + "', '" + token + "')")
	return token, err
}

// 校验登录（账号密码）
func CheckLogin(conn *sql.DB, usernameOrEmail string, passwordMd5 string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_user WHERE (username = ? OR email = ?) AND password_md5 = ?",
		usernameOrEmail, usernameOrEmail, passwordMd5).Scan(&count)
	return count > 0
}

// 校验 Token
func CheckToken(conn *sql.DB, token string) (bool, error) {
	var count int
	err := conn.QueryRow("SELECT COUNT(*) FROM tag_collect_token WHERE token = ?", token).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// 移除 Token 记录
func RemoveToken(conn *sql.DB, tokenOrUsername string) error {
	_, err := conn.Exec("DELETE FROM tag_collect_token WHERE token = ? OR username = ?", tokenOrUsername, tokenOrUsername)
	return err
}

// 根据账号或邮箱获取用户表中的邮箱
func GetUserEmail(conn *sql.DB, usernameOrEmail string) (string, error) {
	var email string
	err := conn.QueryRow("SELECT email FROM tag_collect_user WHERE username = ? OR email = ?",
		usernameOrEmail, usernameOrEmail).Scan(&email)
	return email, err
}
