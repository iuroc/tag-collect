package route

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/oyps/gosmtp"
)

func SendCode(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	to := queryParams.Get("to")
	godotenv.Load(".env")
	verCode := MakeVerCode()
	port, _ := strconv.Atoi(os.Getenv("smtp_port"))
	username := os.Getenv("smtp_username")
	err := gosmtp.SendSmtp(gosmtp.SmtpOption{
		Host:        os.Getenv("smtp_host"),
		Port:        port,
		Username:    username,
		Password:    os.Getenv("smtp_password"),
		From:        username,
		ContentType: "text/html; charset=utf-8",
		Nick:        "鹏优创邮件服务",
		To:          []string{to},
		Subject:     "来自 Tag Collect 的验证码",
		Body:        "您的验证码是 <b style=\"color: red; font-size: 30px;\">" + verCode + "</b>，5 分钟有效期。",
	})
	if err == nil {
		log.Println("邮件发送成功")
		w.Write([]byte("邮件发送成功"))
	} else {
		log.Println(err)
		w.Write([]byte("邮件发送失败"))
	}
}

// 生成验证码
func MakeVerCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprint(rand.Intn(9000) + 1000)
}
