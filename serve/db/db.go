package db

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"log"
	"os"
)

// 获取数据库连接
func GetConn() *sql.DB {
	godotenv.Load(".env")
	host := os.Getenv("mysql_host")
	port := os.Getenv("mysql_port")
	username := os.Getenv("mysql_username")
	password := os.Getenv("mysql_password")
	database := os.Getenv("mysql_database")
	conn, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, host, port, database))
	if err != nil {
		log.Fatal(err)
	}
	if err := conn.Ping(); err != nil {
		log.Fatal(err)
	}
	return conn
}

// 初始化数据表
func InitTable() error {
	conn := GetConn()
	defer conn.Close()

	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_user (
			username VARCHAR(255) PRIMARY KEY COMMENT '用户名',
			password_md5 VARCHAR(255) NOT NULL COMMENT '密码 md5',
			email VARCHAR(255) NOT NULL COMMENT '邮箱',
			create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
		) COLLATE utf8mb4_bin`); err != nil {
		return err
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
		) COLLATE utf8mb4_bin`); err != nil {
		return err
	}
	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_tag (
			id INT(11) AUTO_INCREMENT PRIMARY KEY COMMENT '标签 ID',
            name VARCHAR(255) NOT NULL COMMENT '标签名称'
		) COLLATE utf8mb4_bin`); err != nil {
		return err
	}
	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_tag_of_collect (
			tag_id INT(11) NOT NULL COMMENT '标签 ID',
            collect_id INT(11) NOT NULL COMMENT '收藏 ID'
		) COLLATE utf8mb4_bin`); err != nil {
		return err
	}
	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_ver_code (
			email VARCHAR(255) NOT NULL COMMENT '收件人邮箱',
			create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
			ver_code VARCHAR(255) NOT NULL COMMENT '验证码内容'
		) COLLATE utf8mb4_bin`); err != nil {
		return err
	}
	if _, err := conn.Exec(`
		CREATE TABLE IF NOT EXISTS tag_collect_token (
			username VARCHAR(255) NOT NULL COMMENT '用户名',
			token VARCHAR(255) NOT NULL COMMENT '密钥',
			create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
		) COLLATE utf8mb4_bin`); err != nil {
		return err
	}
	return nil
}
