package route

import (
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

func Add(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	if !CheckTokenByCookie(conn, r.Cookies()) {
		w.Write(util.MakeErr("身份校验失败"))
		return
	}
	// POST 方式请求登录
	if err := r.ParseForm(); err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	w.Write(util.MakeSuc("成功", nil))
}
