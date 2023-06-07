package route

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/joho/godotenv"
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
	to := queryParams.Get("to")
	if to == "" {
		w.Write(util.MakeErr("请输入收件人地址，示例：?to=user@example.com"))
		return
	}
	godotenv.Load(".env")
	verCode := MakeVerCode()
	if err := mail.SendVerCode(to, verCode); err != nil {
		log.Fatal(err)
	} else {
		mail.InsertVerCode(conn, to, verCode)
		w.Write(util.MakeSuc("邮件发送成功", nil))
	}
}

// 生成验证码
func MakeVerCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprint(rand.Intn(9000) + 1000)
}
