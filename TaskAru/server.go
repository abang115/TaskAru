package main

import (
	"log"
	"net/http"

	"TaskAru/controllers"
	"TaskAru/models"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/rs/cors"
)

var store = sessions.NewCookieStore([]byte("T$KR012623"))

func main() {
	r := mux.NewRouter()
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowedMethods:   []string{"GET", "OPTIONS", "POST", "DELETE"},
		AllowCredentials: true,
	})

	models.Init("taskarudb")
	r.HandleFunc("/register", controllers.RegisterPostHandler).Methods("POST")
	r.HandleFunc("/signin", controllers.SignInPostHandler).Methods("POST")
	log.Fatal(http.ListenAndServe(":8080", handler.Handler(r)))
}
