package util

import (
	// "crypto/tls"
	"fmt"
	"log"
	// "log"
	"net/smtp"
	"strings"
)

// SMTP 邮件配置
type SmtpOption struct {
	// SMTP 主机
	Host string
	// SMTP 端口
	Port int
	// SMPT 账号
	Username string
	// SMTP 密码
	Password string
	// 发件人邮箱
	From string
	// 头部 Content-Type 值
	ContentType string
	// 发件人昵称
	Nick string
	// 收件人邮箱列表
	To []string
	// 邮件主题
	Subject string
	// 邮件主体
	Body string
}

func SendSmtp(option SmtpOption) error {
	if option.Username == "" {
		option.Username = option.From
	}
	if option.From == "" {
		option.From = option.Username
	}
	header := make(map[string]string)
	header["From"] = option.Nick + "<" + option.From + ">"
	header["To"] = strings.Join(option.To, ", ")
	header["Subject"] = option.Subject
	header["Content-Type"] = option.ContentType
	message := ""
	for key, value := range header {
		message += key + ": " + value + "\r\n"
	}
	message += "\r\n" + option.Body
	auth := smtp.PlainAuth("", option.Username, option.Password, option.Host)
	err := smtp.SendMail(option.Host+":"+fmt.Sprint(option.Port), auth, option.From, option.To, []byte(message))
	if err == nil {
		fmt.Println("邮件发送成功")
	} else {
		log.Println(err)
	}
	return nil
}
