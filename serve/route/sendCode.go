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

// 发送邮件
func SendCode(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	to := queryParams.Get("to")
	if to == "" {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte("请输入收件人地址 ?to=user@example.com"))
		return
	}
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
		Body: `
<div class="card" style="margin: 30px auto; max-width: 400px; border: 1px solid rgba(230, 230, 230); border-radius: 10px; padding: 10px; text-align: center;">
	<div class="title" style="padding: 20px 0; user-select: none; letter-spacing: 1px; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(230, 230, 230);">Tag Collect 的验证码</div>
	<div class="body" style="padding: 20px 0; font-size: 60px; font-weight: bold; color: #6495ed; border-bottom: 1px solid rgba(230, 230, 230); letter-spacing: 3px;">` + verCode + `</div>
	<div class="footer" style="padding: 20px 0; user-select: none; letter-spacing: 1px;">验证码有效期 5 分钟</div>
</div>`,
	})
	if err == nil {
		log.Println("邮件发送成功")
		w.Write([]byte("邮件发送成功，验证码为：" + verCode))
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
