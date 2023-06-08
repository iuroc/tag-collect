package route

import (
	"log"
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	if err := r.ParseForm(); err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	username := r.Form.Get("username")
	passwordMd5 := r.Form.Get("passwordMd5")
	verCode := r.Form.Get("verCode")
	email, err := db.GetUserEmail(conn, username)
	if err != nil {
		log.Fatal(err)
	}
	if !db.CheckVerCode(conn, email, verCode) {
		w.Write(util.MakeErr("验证码错误，请重新填写"))
		return
	}
	if !db.CheckLogin(conn, username, passwordMd5) {
		w.Write(util.MakeErr("用户名或密码错误，请检查后重新填写"))
		return
	}
	token, err := db.InsertToken(conn, username)
	if err != nil {
		log.Fatal(err)
	}
	data := make(map[string]interface{})
	data["expires"] = SetTokenCookie(w, token)
	w.Write(util.MakeSuc("登录成功", data))
}
