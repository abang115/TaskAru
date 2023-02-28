package main

import (
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"TaskAru/controllers"
	"TaskAru/models"

	"github.com/gorilla/mux"
)

var testRouter = mux.NewRouter()

func TestMain(m *testing.M) {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	host := os.Getenv("HOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")

	var dsn = fmt.Sprintf("%s:%s@tcp(%s:3306)/taskarudb_test?charset=utf8mb4", user, password, host)
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Cannot connect to DB")
	}
	log.Println("Connected to DB")

	err = database.AutoMigrate(&models.User{})
	if err != nil {
		return
	}

	testRouter.HandleFunc("/register", controllers.RegisterPostHandler).Methods("POST")
	testRouter.HandleFunc("/signin", controllers.SignInPostHandler).Methods("POST")

	test := m.Run()
	os.Exit(test)
}
