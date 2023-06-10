package route

import (
	"database/sql"
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
	"time"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	conn := db.GetConn()
	defer conn.Close()
	token := util.GetCookieValue(r.Cookies(), "token")
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

// 移除某个 Token 记录，并自动移除过期 Token
func RemoveToken(conn *sql.DB, token string) error {
	if err := RemoveExpiresToken(conn); err != nil {
		return err
	}
	_, err := conn.Exec("DELETE FROM tag_collect_token WHERE token = ?", token)
	return err
}
