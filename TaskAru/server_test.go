package main

import (
	"TaskAru/controllers"
	"TaskAru/models"
	"os"
	"testing"

	"github.com/gorilla/mux"

	"bytes"
	//"io/ioutil"
	"net/http"
	"net/http/httptest"

	//"encoding/json"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

var testRouter = mux.NewRouter()

func deleteFromUsersTable() {
	models.DB.Exec("delete from users")
}

func TestMain(m *testing.M) {
	models.Init("taskarudb_test")
	testRouter.HandleFunc("/register", controllers.RegisterPostHandler).Methods("POST")
	testRouter.HandleFunc("/signin", controllers.SignInPostHandler).Methods("POST")

	test := m.Run()
	os.Exit(test)
}

// test to register successfully with email and password
func TestRegisterPostHandler(t *testing.T) {
	rBody := []byte(`{"first_name": "jane", "last_name": "doe", "email": "janedoe@ufl.edu", "password": "janedoe"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)
	if result.Error != nil {
		t.Errorf("test failed! unable to get user %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))
	if err != nil {
		t.Errorf("test failed! unable to compared hashed password %v", err)
	}

	assert.Equal(t, "jane", user.FirstName, "incorrect first name error")
	assert.Equal(t, "doe", user.LastName, "incorrect last name error")
	assert.Equal(t, "janedoe@ufl.edu", user.Email, "incorrect email error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to register with duplicate email
func Test2RegisterPostHandler(t *testing.T) {
	deleteFromUsersTable()

	rBody := []byte(`{"first_name": "jane", "last_name": "doe", "email": "janedoe@ufl.edu", "password": "janedoe"}`)
	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)
	if result.Error != nil {
		t.Errorf("test failed! unable to get user %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))
	if err != nil {
		t.Errorf("test failed! unable to compared hashed password %v", err)
	}

	assert.Equal(t, "jane", user.FirstName, "incorrect first name error")
	assert.Equal(t, "doe", user.LastName, "incorrect last name error")
	assert.Equal(t, "janedoe@ufl.edu", user.Email, "incorrect email error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")

	rBody = []byte(`{"first_name": "jane2", "last_name": "doe2", "email": "janedoe@ufl.edu", "password": "janedoe2"}`)
	rr = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	result = models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)
	if result.Error != nil {
		t.Errorf("test failed! unable to get user %v", result.Error)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))
	if err != nil {
		t.Errorf("test failed! unable to compared hashed password %v", err)
	}

	assert.Equal(t, "jane", user.FirstName, "incorrect first name error")
	assert.Equal(t, "doe", user.LastName, "incorrect last name error")
	assert.Equal(t, "janedoe@ufl.edu", user.Email, "incorrect email error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to signin with correct email and password
func TestSignInPostHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "password": "janedoe"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)
	if result.Error != nil {
		t.Errorf("test failed! %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe"))
	if err != nil {
		t.Errorf("test failed! %v", err)
	}

	assert.Equal(t, "jane", user.FirstName, "incorrect first name error")
	assert.Equal(t, "doe", user.LastName, "incorrect last name error")
	assert.Equal(t, "janedoe@ufl.edu", user.Email, "incorrect email error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// correct email, wrong password
func TestSignInPostHandler2(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "password": "janedoe2"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)
	if result.Error != nil {
		t.Errorf("test failed! %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe2"))
	if err == nil {
		t.Errorf("test failed! correct password was entered, error caught")
	}

	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusUnauthorized, rr.Code, "HTTP request status code error")
}

// wrong email, correct password
func TestSignInPostHandler3(t *testing.T) {
	rBody := []byte(`{"email": "janedoe2@ufl.edu", "password": "janedoe"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/signin", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe2@ufl.edu").First(&user)

	if result.Error == nil {
		t.Errorf("test failed! right email, error caught %v", result.Error)
	}

	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusNotFound, rr.Code, "HTTP request status code error")
}
