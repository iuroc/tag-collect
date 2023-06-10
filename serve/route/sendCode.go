package route

import (
	"fmt"
	"log"
	"math/rand"
	"database/sql"
	"net/http"
	"time"

	"tag-collect/serve/db"
	"tag-collect/serve/mail"
	"tag-collect/serve/util"
)

// 发送邮件
func SendCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	queryParams := r.URL.Query()
	// 用户名或邮箱
	to := queryParams.Get("to")
	// 如果 login == "true" 则需要确保用户存在，否则不发送验证码
	login := queryParams.Get("login")
	if to == "" {
		w.Write(util.MakeErr("请输入收件人地址，示例：?to=user@example.com"))
		return
	}
	email, err := GetUserEmail(conn, to)
	// 用户不存在
	if err != nil {
		if login == "true" {
			w.Write(util.MakeErr("用户不存在，请检查用户名或邮箱"))
			return
		} else {
			email = to
		}
	}

	// 正则校验邮箱地址格式
	if !util.CheckEmail(email) {
		w.Write(util.MakeErr("邮箱格式错误，请检查后重新输入"))
		return
	}

	// 判断是否频繁请求发送验证码
	if !CheckVerCodeAllow(conn, email) {
		w.Write(util.MakeErr("请勿频繁请求发送验证码"))
		return
	}
	// 生成验证码
	verCode := MakeVerCode()
	// 发送验证码
	if err := mail.SendVerCode(email, verCode); err != nil {
		w.Write(util.MakeErr("邮件发送失败"))
		return
	}
	// 插入验证码记录
	if err := InsertVerCode(conn, email, verCode); err != nil {
		log.Fatal(err)
	}

	w.Write(util.MakeSuc("验证码已经成功发送到您的邮箱，请注意查收", nil))
}

// 生成验证码
func MakeVerCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprint(rand.Intn(9000) + 1000)
}



// 插入验证码记录，并删除该邮箱之前的验证码，以及删除其他过期验证码
func InsertVerCode(conn *sql.DB, email string, verCode string) error {
	RemoveVerCode(conn, email)
	stmp, _ := conn.Prepare("INSERT INTO tag_collect_ver_code (email, ver_code) VALUES (?, ?)")
	if _, err := stmp.Exec(email, verCode); err != nil {
		return err
	}
	return nil
}

// 移除某条验证码记录，并移除过期验证码
func RemoveVerCode(conn *sql.DB, email string) error {
	_, err := conn.Exec("DELETE FROM tag_collect_ver_code WHERE email = ? OR create_time < (CURRENT_TIMESTAMP - INTERVAL 5 MINUTE)")
	return err
}

// 检查是否允许发送验证码
func CheckVerCodeAllow(conn *sql.DB, email string) bool {
	var count int
	// 检查当前邮箱是否在一分钟内发送过验证码
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_ver_code WHERE email = ? AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 1 MINUTE)", email).Scan(&count)
	return count == 0
}

// 校验验证码
func CheckVerCode(conn *sql.DB, email string, verCode string) bool {
	var count int
	stmp, _ := conn.Prepare("SELECT COUNT(*) FROM tag_collect_ver_code WHERE email = ? AND ver_code = ? AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 5 MINUTE)")
	stmp.QueryRow(email, verCode).Scan(&count)
	return count > 0
}
