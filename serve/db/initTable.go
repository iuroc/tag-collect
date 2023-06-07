package db

import (
	"log"

	_ "github.com/go-sql-driver/mysql"
)

// 初始化数据表
func InitTable() {
	conn := GetConn()
	defer conn.Close()

	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_user (
			username VARCHAR(255) PRIMARY KEY COMMENT '用户名',
			password_md5 VARCHAR(255) NOT NULL COMMENT '密码 md5',
			email VARCHAR(255) NOT NULL COMMENT '邮箱',
			create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
		)`); err != nil {
		log.Fatal(err)
	}
	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_collect (
			id INT(11) AUTO_INCREMENT PRIMARY KEY COMMENT '收藏记录 ID',
	        title VARCHAR(255) COMMENT '网页标题',
	        url VARCHAR(255) COMMENT '网页 URL',
	        text TEXT COMMENT '描述文本',
            username TEXT NOT NULL COMMENT '创建者用户名',
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
		)`); err != nil {
		log.Fatal(err)
	}
	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_ver_code (
			email VARCHAR(255) NOT NULL COMMENT '收件人邮箱',
			create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
			ver_code VARCHAR(255) NOT NULL COMMENT '验证码内容'
		)`); err != nil {
		log.Fatal(err)
	}
}
