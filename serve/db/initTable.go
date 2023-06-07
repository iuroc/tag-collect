package db

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func InitTable() {
	godotenv.Load(".env")
	conn, err := sql.Open("mysql", "root:1234562@/ponconsoft")
	if err != nil {
		fmt.Println("数据库连接失败")
	}
	fmt.Println(conn)
}
