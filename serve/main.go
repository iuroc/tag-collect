package main

import (
	"fmt"
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/route"
)

func main() {
	Main()
}

func Main() {
	db.InitTable()
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/index.html")
	})
	http.HandleFunc("/api/sendCode", route.SendCode)
	http.HandleFunc("/api/register", route.Register)
	http.HandleFunc("/api/login", route.Login)
	http.HandleFunc("/logout", route.Logout)
	fmt.Println("http://localhost:8080")
	http.ListenAndServe("localhost:8080", nil)
}
