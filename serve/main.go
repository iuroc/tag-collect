package main

import (
	"fmt"
	"net/http"
	"tag-collect/serve/db"
	"tag-collect/serve/route"
)

type Person struct {
	Name string
	Age  int
}

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
	http.HandleFunc("/api/add", route.Add)
	http.HandleFunc("/api/searchTag", route.SearchTag)
	http.HandleFunc("/logout", route.Logout)
	fmt.Println("http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
