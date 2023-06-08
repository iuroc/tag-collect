package mail

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type SmtpOption struct {
	Host        string
	Port        int
	Password    string
	Username    string
	Nick        string
	To          []string
	Subject     string
	Body        string
	ContentType string
}

// 发送非加密邮件
func EasySend(option SmtpOption) error {
	auth := smtp.PlainAuth("", option.Username, option.Password, option.Host)
	header := make(map[string]string)
	header["From"] = fmt.Sprintf("%s<%s>", option.Nick, option.Username)
	header["To"] = strings.Join(option.To, ", ")
	header["Subject"] = option.Subject
	header["Content-Type"] = option.ContentType
	message := ""
	for key, value := range header {
		message += key + ": " + value + "\r\n"
	}
	message += "\r\n" + option.Body
	err := smtp.SendMail(fmt.Sprintf("%s:%d", option.Host, option.Port), auth, option.Username, option.To, []byte(message))
	return err
}

// 发送验证码
func SendVerCode(to string, verCode string) error {
	godotenv.Load(".env")
	port, err := strconv.Atoi(os.Getenv("smtp_port"))
	if err != nil {
		log.Fatal(err)
	}
	return EasySend(SmtpOption{
		Host:     os.Getenv("smtp_host"),
		Port:     port,
		Username: os.Getenv("smtp_username"),
		Password: os.Getenv("smtp_password"),
		Nick:     os.Getenv("smtp_nick"),
		To:       []string{to},
		Subject:  "来自 " + os.Getenv("smtp_app_name") + " 的验证码",
		Body: `
		<div class="card" style="margin: 30px auto; max-width: 400px; border: 1px solid rgba(230, 230, 230); border-radius: 10px; padding: 10px; text-align: center;">
			<div class="title" style="padding: 20px 0; user-select: none; letter-spacing: 1px; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(230, 230, 230);">` + os.Getenv("smtp_app_name") + ` 的验证码</div>
			<div class="body" style="padding: 20px 0; font-size: 60px; font-weight: bold; color: #6495ed; border-bottom: 1px solid rgba(230, 230, 230); letter-spacing: 3px;">` + verCode + `</div>
			<div class="footer" style="padding: 20px 0; user-select: none; letter-spacing: 1px;">验证码有效期 5 分钟</div>
		</div>`,
		ContentType: "text/html; charset=utf-8",
	})
}
