package mail

import (
	"database/sql"
	"log"
)

// 插入验证码记录
func InsertVerCode(conn *sql.DB, to string, verCode string) {
	stmp, _ := conn.Prepare("INSERT INTO tag_collect_ver_code (email, ver_code) VALUES (?, ?)")
	result, err := stmp.Exec(to, verCode)
	if err != nil {
		log.Fatal(err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	if rowsAffected > 0 {
		log.Println("Insert successful!")
	} else {
		log.Fatalln("Insert failed!")
	}
}
