package route

import (
	"net/http"
	"strings"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

// 搜索标签
func SearchTag(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	queryParams := r.URL.Query()
	keyword := queryParams.Get("keyword")
	keyword = strings.ReplaceAll(keyword, " ", "%")
	rows, err := conn.Query("SELECT id, name FROM tag_collect_tag WHERE name LIKE ?", "%"+keyword+"%")
	if err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	result := []TagInfo{}
	for rows.Next() {
		var (
			id   int
			name string
		)
		err := rows.Scan(&id, &name)
		if err != nil {
			w.Write(util.MakeErr("查询失败"))
			return
		}
		result = append(result, TagInfo{
			Id:   id,
			Name: name,
		})
	}
	w.Write(util.MakeSuc("获取成功", result))
}

type TagInfo struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}
