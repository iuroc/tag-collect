package route

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"strings"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

// 获取收藏列表
func CollectList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	username, err := CheckTokenByCookie(conn, r.Cookies())
	if err != nil {
		w.Write(util.MakeErr("身份校验失败"))
		return
	}
	queryParams := r.URL.Query()
	pageStr := queryParams.Get("page")
	if pageStr == "" {
		pageStr = "0"
	}
	pageSizeStr := queryParams.Get("pageSize")
	if pageSizeStr == "" {
		pageSizeStr = "30"
	}
	page, err1 := strconv.Atoi(pageStr)
	pageSize, err2 := strconv.Atoi(pageSizeStr)
	keyword := queryParams.Get("keyword")
	if err1 != nil || err2 != nil {
		w.Write(util.MakeErr("参数错误"))
		return
	}
	collectList := GetCollectList(conn, page, pageSize, keyword, username)
	w.Write(util.MakeSuc("获取成功", collectList))
}

// 获取收藏列表，可搜索
func GetCollectList(conn *sql.DB, page int, pageSize int, keyword string, username string) []CollectRow {
	offset := page * pageSize
	limit := 36
	keyword = strings.ReplaceAll(keyword, " ", "%")
	keyword = "%" + keyword + "%"
	rows, err := conn.Query(`SELECT id, url, title, text, create_time, update_time
		FROM tag_collect_collect
		WHERE username = ?
		AND (title LIKE ? OR url LIKE ?)
		LIMIT ? OFFSET ?`,
		username, keyword, keyword, limit, offset)
	if err != nil {
		log.Fatal(err)
	}
	result := []CollectRow{}
	for rows.Next() {
		collectRow := CollectRow{}
		if err := rows.Scan(
			&collectRow.Id,
			&collectRow.Url,
			&collectRow.Title,
			&collectRow.Text,
			&collectRow.CreateTime,
			&collectRow.UpdateTime,
		); err != nil {
			log.Fatal(err)
		}
		result = append(result, collectRow)
	}
	return result
}

// 收藏记录
type CollectRow struct {
	Id         int    `json:"id"`
	Url        string `json:"url"`
	Title      string `json:"title"`
	Text       string `json:"text"`
	CreateTime string `json:"create_time"`
	UpdateTime string `json:"update_time"`
}
