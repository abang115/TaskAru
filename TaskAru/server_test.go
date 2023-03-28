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
	testRouter.HandleFunc("/api/register", controllers.RegisterPostHandler).Methods("POST")
	testRouter.HandleFunc("/api/signin", controllers.SignInPostHandler).Methods("POST")

	test := m.Run()
	os.Exit(test)
}

// test to register successfully with email and password
func TestRegisterPostHandler(t *testing.T) {
	deleteFromUsersTable()
	rBody := []byte(`{"first_name": "jane", "last_name": "doe", "email": "janedoe@ufl.edu", "password": "janedoe"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewBuffer(rBody))
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
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to register with duplicate email
func Test2RegisterPostHandler(t *testing.T) {
	deleteFromUsersTable()

	rBody := []byte(`{"first_name": "jane", "last_name": "doe", "email": "janedoe@ufl.edu", "password": "janedoe"}`)
	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewBuffer(rBody))
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
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")

	rBody = []byte(`{"first_name": "jane2", "last_name": "doe2", "email": "janedoe@ufl.edu", "password": "janedoe2"}`)
	rr = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewBuffer(rBody))
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
	assert.Equal(t, http.StatusConflict, rr.Code, "HTTP request status code error")
}

// test to signin with correct email and password
func TestSignInPostHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "password": "janedoe"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/signin", bytes.NewBuffer(rBody))
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
	req := httptest.NewRequest(http.MethodPost, "/api/signin", bytes.NewBuffer(rBody))
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
	req := httptest.NewRequest(http.MethodPost, "/api/signin", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe2@ufl.edu").First(&user)

	if result.Error == nil {
		t.Errorf("test failed! right email, error caught %v", result.Error)
	}

	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusNotFound, rr.Code, "HTTP request status code error")
}

// UNFINISHED
func TestForgotPasswordPostHandler(t *testing.T) {

}

// UNFINISHED
func TestResetPasswordPatchHandler(t *testing.T) {

}

func TestEventPostHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "eventID": "1", "eventTitle": "Birthday", "eventDescription": "It's a my Birthday", "eventDate": "2023-03-09", "startTime": "10:00", "endTime": "11:00", "freq": "daily", "dtStart": "2023-03-09", "until": "2024-03-09", "backgroundColor": "#08B417"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPut, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("eventID = ?", "1").First(&event)
	if result.Error != nil {
		t.Errorf("test failed! unable to get event %v", result.Error)
	}

	assert.Equal(t, "janedoe@ufl.edu", event.Email, "incorrect email error")
	assert.Equal(t, "1", event.EventID, "incorrect event ID error")
	assert.Equal(t, "Birthday", event.EventTitle, "incorrect event title error")
	assert.Equal(t, "It's a my Birthday", event.Description, "incorrect event description error")
	assert.Equal(t, "2023-03-09", event.EventDate, "incorrect event date error")
	assert.Equal(t, "10:00", event.StartTime, "incorrect event start time error")
	assert.Equal(t, "11:00", event.EndTime, "incorrect event end time error")
	assert.Equal(t, "daily", event.Freq, "incorrect event frequency error")
	assert.Equal(t, "2023-03-09", event.DTStart, "incorrect event dt start error")
	assert.Equal(t, "2024-03-09", event.Until, "incorrect event until error")
	assert.Equal(t, "#0BB417", event.BackgroundColor, "incorrect event background color error")

	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// UNFINISHED
func TestEditEventPatchHandler(t *testing.T) {
	//rBody := []byte(`{""}`)
}

// UNFINISHED
func TestRemoveEventDeleteHandler(t *testing.T) {

}

// UNFINISHED
func TestReceiveEventGetHandler(t *testing.T) {

}
