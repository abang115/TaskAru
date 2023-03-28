package models

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(dbname string) {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	host := os.Getenv("HOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")

	var dsn = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=utf8mb4", user, password, host, dbname)
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
		panic("Cannot connect to DB")
	}
	log.Println("Connected to DB")

	err = database.AutoMigrate(&User{}, &ForgotPassword{}, &Event{}) // &Event{} Add back in
	if err != nil {
		return
	}

	DB = database
}
