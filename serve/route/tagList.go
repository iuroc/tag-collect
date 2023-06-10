package route

import (
	"net/http"
	"strings"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

// 加载标签列表，可模糊搜索
func TagList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	queryParams := r.URL.Query()
	keyword := queryParams.Get("keyword")
	keyword = strings.ReplaceAll(keyword, " ", "%")
	rows, err := conn.Query("SELECT name FROM tag_collect_tag WHERE name LIKE ?", "%"+keyword+"%")
	if err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	result := []string{}
	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)
		if err != nil {
			w.Write(util.MakeErr("查询失败"))
			return
		}
		result = append(result, tag)
	}
	w.Write(util.MakeSuc("获取成功", result))
}
