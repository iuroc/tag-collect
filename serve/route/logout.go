package route

import (
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
	"time"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	conn := db.GetConn()
	defer conn.Close()
	cookies := r.Cookies()
	token := ""
	for _, cookie := range cookies {
		if cookie.Name == "token" {
			token = cookie.Value
		}
	}
	// 退出登录，则移除当前 Cookie-Token，不影响其他设备登录状态
	if err := RemoveToken(conn, token); err != nil {
		w.Write(util.MakeErr("Token 异常"))
		return
	}
	cookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		Expires:  time.Now(),
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)
	http.Redirect(w, r, "/", http.StatusFound)
}
