package route

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"tag-collect/serve/db"
	"tag-collect/serve/mail"
	"tag-collect/serve/util"

	"github.com/joho/godotenv"
)

// 发送邮件
func SendCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	queryParams := r.URL.Query()
	to := queryParams.Get("to")
	if to == "" {
		w.Write(util.MakeErr("请输入收件人地址，示例：?to=user@example.com"))
		return
	}
	email, err := db.GetUserEmail(conn, to)
	if email == "" || err != nil {
		email = to
	}
	// 判断是否频繁请求发送验证码
	if !db.CheckVerCodeAllow(conn, email) {
		w.Write(util.MakeErr("请勿频繁请求发送验证码"))
		return
	}

	godotenv.Load(".env")
	verCode := MakeVerCode()
	// 发送验证码
	if err := mail.SendVerCode(email, verCode); err != nil {
		w.Write(util.MakeErr("邮件发送失败"))
		return
	}
	// 插入验证码记录
	if err := db.InsertVerCode(conn, email, verCode); err != nil {
		log.Fatal(err)
	}

	w.Write(util.MakeSuc("验证码已经成功发送到您的邮箱，请注意查收", nil))
}

// 生成验证码
func MakeVerCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprint(rand.Intn(9000) + 1000)
}
