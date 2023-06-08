package route

import (
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

// 用户注册
//  /api/register
func Register(w http.ResponseWriter, r *http.Request) {
	conn := db.GetConn()
	defer conn.Close()
	if err := r.ParseForm(); err != nil {
		w.Write(util.MakeErr(err.Error()))
	}
	username := r.Form.Get("username")
	email := r.Form.Get("email")
	passwordMd5 := r.Form.Get("passwordMd5")
	verCode := r.Form.Get("verCode")
	// 判断用户是否已经注册
	if db.CheckUserExists(conn, username, email) {
		w.Write(util.MakeErr("用户名或邮箱已经注册，您可以直接登录"))
		return
	}
	// 校验验证码
	if !db.CheckVerCode(conn, email, verCode) {
		w.Write(util.MakeErr("验证码错误，请重新填写"))
		return
	}
	stmt, _ := conn.Prepare("INSERT INTO tag_collect_user (username, email, password_md5) VALUES (?, ?, ?)")
	if _, err := stmt.Exec(username, email, passwordMd5); err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	w.Write(util.MakeSuc("注册成功", nil))
}
