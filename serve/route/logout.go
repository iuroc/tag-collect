package route

import (
	"log"
	"net/http"
	"tag-collect/serve/db"
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
	if err := db.RemoveToken(conn, token); err != nil {
		log.Fatal(err)
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
