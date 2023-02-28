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

	"bytes"
	//"io/ioutil"
	"net/http"
	"net/http/httptest"

	//"encoding/json"

	"golang.org/x/crypto/bcrypt"
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

// correct email and password
func TestRegisterPostHandler(t *testing.T) {
	rBody := []byte(`{"first_name": "jane", "last_name": "doe", "email": "janedoe@ufl.edu", "password": "janedoe"}`)

	wr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(rBody))
	controllers.RegisterPostHandler(wr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)

	if result.Error != nil {
		t.Errorf("test failed! unable to get user %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))

	if err != nil {
		t.Errorf("test failed! unable to compared hashed password %v", err)
	}
}

// duplicate email
func Test2RegisterPostHandler(t *testing.T) {
	rBody := []byte(`{"first_name": "jane2", "last_name": "doe2", "email": "janedoe@ufl.edu", "password": "janedoe2"}`)

	wr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(rBody))
	controllers.RegisterPostHandler(wr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)

	if result.Error != nil {
		t.Errorf("test passed! duplicate email, error caught %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe2"))

	if err != nil {
		t.Errorf("test failed! unable to compared hashed password %v", err)
	}
}

// correct email and password
func TestSignInPostHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "password": "janedoe"}`)

	wr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	controllers.RegisterPostHandler(wr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)

	if result.Error != nil {
		t.Errorf("test failed! %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))

	if err != nil {
		t.Errorf("test failed! %v", err)
	}
}

// correct email, wrong password
func TestSignInPostHandler2(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "password": "janedoe2"}`)

	wr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	controllers.RegisterPostHandler(wr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)

	if result.Error != nil {
		t.Errorf("test failed! %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe2"))

	if err != nil {
		t.Errorf("test passed! wrong password, error caught %v", err)
	}
}

// wrong email, correct password
func TestSignInPostHandler3(t *testing.T) {
	rBody := []byte(`{"email": "janedoe2@ufl.edu", "password": "janedoe"}`)

	wr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	controllers.RegisterPostHandler(wr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe2@ufl.edu").First(&user)

	if result.Error != nil {
		t.Errorf("test passed! wrong email, error caught %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))

	if err != nil {
		t.Errorf("test failed! %v", err)
	}
}

// wrong email, wrong password
func TestSignInPostHandler4(t *testing.T) {
	rBody := []byte(`{"email": "janedoe2@ufl.edu", "password": "janedoe2"}`)

	wr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	controllers.RegisterPostHandler(wr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe2@ufl.edu").First(&user)

	if result.Error != nil {
		t.Errorf("test passed! wrong email, error caught %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe2"))

	if err != nil {
		t.Errorf("test passed! wrong password, error caught %v", err)
	}
}
