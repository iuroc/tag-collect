package route

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strings"
	"tag-collect/serve/db"
	"tag-collect/serve/util"
)

func Add(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	conn := db.GetConn()
	defer conn.Close()
	username, err := CheckTokenByCookie(conn, r.Cookies())
	if err != nil {
		w.Write(util.MakeErr("身份校验失败"))
		return
	}
	// POST 方式请求登录
	if err := r.ParseForm(); err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	url := r.Form.Get("url")
	title := r.Form.Get("title")
	text := r.Form.Get("text")
	tagList := strings.Split(r.Form.Get("tagList"), "||")
	if url == "" && text == "" {
		w.Write(util.MakeErr("URL 和描述文本不能同时为空"))
		return
	}
	if err := AddCollect(conn, url, title, text, tagList, username); err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	w.Write(util.MakeSuc("添加成功", nil))
}

// 添加收藏记录
func AddCollect(
	conn *sql.DB,
	url string,
	title string,
	text string,
	tagList []string,
	username string,
) error {
	// URL 不为空时，判断 URL 是否重复
	if UrlExists(conn, url, username) {
		return errors.New("当前 URL 已经存在")
	}
	// 插入收藏记录
	result, err := conn.Exec("INSERT INTO tag_collect_collect (url, title, text, username) VALUES (?, ?, ?, ?)",
		url, title, text, username)
	if err != nil {
		return errors.New("收藏记录插入失败")
	}
	// 获取新插入的收藏 ID
	lastId, err := result.LastInsertId()
	if err != nil {
		return errors.New("获取 lastId 失败")
	}
	// 插入标签列表记录
	if err := InsertTagList(conn, int(lastId), tagList); err != nil {
		return errors.New("标签插入失败")
	}
	return nil
}

func InsertTagList(conn *sql.DB, collectId int, tagList []string) error {
	smtp, err := conn.Prepare("INSERT INTO tag_collect_tag_of_collect (collect_id, tag_id) VALUES (?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	for _, tag := range tagList {
		tagId := GetTagId(conn, tag)
		if _, err := smtp.Exec(collectId, tagId); err != nil {
			return err
		}
	}
	return nil
}

// 获取标签 ID，如果不存在则自动创建
func GetTagId(conn *sql.DB, tag string) int {
	var tagId int
	var count int
	conn.QueryRow("SELECT COUNT(*), id FROM tag_collect_tag WHERE name = ?", tag).Scan(&tagId, &count)
	if count == 0 {
		return CreateNewTag(conn, tag)
	}
	return tagId
}

// 创建新标签，返回标签 ID
func CreateNewTag(conn *sql.DB, tag string) int {
	result, err := conn.Exec("INSERT INTO tag_collect_tag (name) VALUES (?)", tag)
	if err != nil {
		log.Fatal(err)
	}
	lastId, err := result.LastInsertId()
	if err != nil {
		log.Fatal(err)
	}
	return int(lastId)
}

// 判断 URL 是否存在
func UrlExists(conn *sql.DB, url string, username string) bool {
	var count int
	conn.QueryRow("SELECT COUNT(*) FROM tag_collect_collect WHERE url = ? AND username = ?", url, username).Scan(&count)
	return count > 0
}
