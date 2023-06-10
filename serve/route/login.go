package route

import (
	"database/sql"
	"log"
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	// POST 方式请求登录
	if err := r.ParseForm(); err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	username := r.Form.Get("username")
	passwordMd5 := r.Form.Get("passwordMd5")
	verCode := r.Form.Get("verCode")
	email, err := GetUserEmail(conn, username)
	if err != nil {
		w.Write(util.MakeErr("用户不存在，请检查用户名或邮箱"))
		return
	}
	if !CheckVerCode(conn, email, verCode) {
		w.Write(util.MakeErr("验证码错误，请重新填写"))
		return
	}
	if !CheckLogin(conn, username, passwordMd5) {
		w.Write(util.MakeErr("用户名或密码错误，请检查后重新填写"))
		return
	}

	token, err := InsertToken(conn, username)
	if err != nil {
		log.Fatal(err)
	}
	data := make(map[string]interface{})
	data["expires"] = SetTokenCookie(w, token)
	// 校验成功，移除验证码记录
	RemoveVerCode(conn, email)
	w.Write(util.MakeSuc("登录成功", data))
}

// 判断用户是否存在
func CheckUserExists(conn *sql.DB, username string, email string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_user WHERE username = ? OR email = ?",
		username, email).Scan(&count)
	return count != 0
}

// 插入 Token 记录
func InsertToken(conn *sql.DB, username string) (string, error) {
	if err := RemoveExpiresToken(conn); err != nil {
		log.Fatal(err)
	}
	token := util.MakeToken(128)
	_, err := conn.Exec("INSERT INTO tag_collect_token (username, token) VALUES (?, ?)", username, token)
	return token, err
}

// 校验登录（账号密码）
func CheckLogin(conn *sql.DB, usernameOrEmail string, passwordMd5 string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_user WHERE (username = ? OR email = ?) AND password_md5 = ?",
		usernameOrEmail, usernameOrEmail, passwordMd5).Scan(&count)
	return count > 0
}

// 校验 Token, 返回用户名
func CheckToken(conn *sql.DB, token string) (string, error) {
	var username string
	err := conn.QueryRow("SELECT username FROM tag_collect_token WHERE token = ? AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 1 MONTH)", token).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}

// 移除过期 Token 记录
func RemoveExpiresToken(conn *sql.DB) error {
	_, err := conn.Exec("DELETE FROM tag_collect_token WHERE create_time < (CURRENT_TIMESTAMP - INTERVAL 1 MONTH)")
	return err
}

// 移除某个 Token 记录
func RemoveToken(conn *sql.DB, token string) error {
	_, err := conn.Exec("DELETE FROM tag_collect_token WHERE token = ?", token)
	return err
}


// 根据用户名或邮箱获取用户表中的邮箱
func GetUserEmail(conn *sql.DB, usernameOrEmail string) (string, error) {
	var email string
	err := conn.QueryRow("SELECT email FROM tag_collect_user WHERE username = ? OR email = ?",
		usernameOrEmail, usernameOrEmail).Scan(&email)
	return email, err
}
