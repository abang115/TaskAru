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

func deleteFromTable(table string) {
	models.DB.Exec("delete from " + table)
}

func TestMain(m *testing.M) {
	models.Init("taskarudb_test")
	testRouter.HandleFunc("/api/register", controllers.RegisterPostHandler).Methods("POST")
	testRouter.HandleFunc("/api/signin", controllers.SignInPostHandler).Methods("POST")
	testRouter.HandleFunc("/api/forgotpassword", controllers.ForgotPasswordPostHandler).Methods("POST")
	testRouter.HandleFunc("/api/resetpassword", controllers.ResetPasswordPatchHandler).Methods("PATCH")
	testRouter.HandleFunc("/api/event", controllers.EventPostHandler).Methods("POST")
	testRouter.HandleFunc("/api/event", controllers.EditEventPatchHandler).Methods("PATCH")
	testRouter.HandleFunc("/api/event", controllers.RemoveEventDeleteHandler).Methods("DELETE")
	testRouter.HandleFunc("/api/event", controllers.ReceiveEventGetHandler).Methods("GET")

	test := m.Run()
	os.Exit(test)
}

// test to register successfully with email and password
func TestRegisterPostHandler(t *testing.T) {
	deleteFromTable("users")
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
	deleteFromTable("users")

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

// UNFINISHED
func TestEventPostHandler(t *testing.T) {
	deleteFromTable("events")

	rBody := []byte(`{"email": "janedoe@ufl.edu", "eventID": "1", "eventTitle": "Birthday", "eventDescription": "It's a my Birthday", "eventDate": "2023-03-09", 
	"startTime": "10:00", "endTime": "11:00", "freq": "daily", "dtStart": "2023-03-09", "until": "2024-03-09", "backgroundColor": "#08B417"}`)

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

func TestEditEventPatchHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "eventID": "1", "eventTitle": "Holiday", "eventDescription": "It's a Holiday", "eventDate": "2023-04-09", 
	"startTime": "11:00", "endTime": "12:00", "freq": "weekly", "dtStart": "2023-04-09", "until": "2024-04-09", "backgroundColor": "#08B419"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPatch, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("eventID = ?", "1").First(&event)
	if result.Error != nil {
		t.Errorf("test failed! unable to get event %v", result.Error)
	}

	assert.Equal(t, "janedoe@ufl.edu", event.Email, "incorrect email error")
	assert.Equal(t, "1", event.EventID, "incorrect event ID error")
	assert.Equal(t, "Holiday", event.EventTitle, "incorrect event title error")
	assert.Equal(t, "It's a Holiday", event.Description, "incorrect event description error")
	assert.Equal(t, "2023-04-09", event.EventDate, "incorrect event date error")
	assert.Equal(t, "11:00", event.StartTime, "incorrect event start time error")
	assert.Equal(t, "12:00", event.EndTime, "incorrect event end time error")
	assert.Equal(t, "weekly", event.Freq, "incorrect event frequency error")
	assert.Equal(t, "2023-04-09", event.DTStart, "incorrect event dt start error")
	assert.Equal(t, "2024-04-09", event.Until, "incorrect event until error")
	assert.Equal(t, "#0BB419", event.BackgroundColor, "incorrect event background color error")

	assert.Equal(t, http.MethodPatch, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

func TestRemoveEventDeleteHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "eventID": "1", "eventTitle": "Holiday", "eventDescription": "It's a Holiday", "eventDate": "2023-04-09", 
	"startTime": "11:00", "endTime": "12:00", "freq": "weekly", "dtStart": "2023-04-09", "until": "2024-04-09", "backgroundColor": "#08B419"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodDelete, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("eventID = ?", "1").First(&event)
	// if event is present, test failed
	if result.Error == nil {
		t.Errorf("test failed! event should have been deleted %v", result.Error)
	}

	assert.Equal(t, http.MethodDelete, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// UNFINISHED
func TestReceiveEventGetHandler(t *testing.T) {

}
