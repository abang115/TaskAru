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

	"encoding/json"

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
	testRouter.HandleFunc("/api/calendar", controllers.CalendarPostHandler).Methods("POST")
	testRouter.HandleFunc("/api/calendar", controllers.EditCalendarPatchHandler).Methods("PATCH")
	testRouter.HandleFunc("/api/calendar", controllers.RemoveCalendarDeleteHandler).Methods("DELETE")
	testRouter.HandleFunc("/api/calendar", controllers.CalendarGetHandler).Methods("GET")

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

func TestForgotPasswordPostHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/forgotpassword", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var forgot models.ForgotPassword

	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&forgot)
	if result.Error != nil {
		t.Errorf("test failed! email not found in database %v", result.Error)
	}

	var count int64
	models.DB.Where("token = ?", forgot.Token).Count(&count)

	if count > 0 {
		t.Errorf("duplicate token produced")
	}

	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

func TestResetPasswordPatchHandler(t *testing.T) {
	rBody := []byte(`{"password": "janedoe2", "token": "XVlBzgbaiCMR"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPatch, "/api/resetpassword", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var user models.User
	result := models.DB.Where("email = ?", "janedoe@ufl.edu").First(&user)
	if result.Error != nil {
		t.Errorf("test failed! unable to get user %v", result.Error)
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte("janedoe2"))
	if err != nil {
		t.Errorf("test failed! password should be changed %v", err)
	}

	assert.Equal(t, http.MethodPatch, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to add calendar
func TestCalendarPostHandler(t *testing.T) {
	deleteFromTable("calendars")

	rBody := []byte(`{"email": "janedoe@ufl.edu", "groupID": "0", "calendarName": "School", "shareAbility": "johndoe@ufl.edu jimdoe@ufl.edu"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/calendar", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var calendar models.Calendar
	result := models.DB.Where("email = ? AND group_id = ?", "janedoe@ufl.edu", "0").First(&calendar)

	if result.Error != nil {
		t.Errorf("test failed! unable to get calendar %v", result.Error)
	}

	assert.Equal(t, "janedoe@ufl.edu", calendar.Email, "incorrect email error")
	assert.Equal(t, "0", calendar.GroupID, "incorrect group ID error")
	assert.Equal(t, "School", calendar.CalendarName, "incorrect calendar name error")
	assert.Equal(t, "johndoe@ufl.edu jimdoe@ufl.edu", calendar.ShareAbility, "incorrect shared with error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

func TestCalendarPostHandler2(t *testing.T) {

	rBody := []byte(`{"email": "johndoe@ufl.edu", "groupID": "0", "calendarName": "School", "shareAbility": "janedoe@ufl.edu jimdoe@ufl.edu"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/calendar", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var calendar models.Calendar
	result := models.DB.Where("email = ? AND group_id = ?", "johndoe@ufl.edu", "0").First(&calendar)

	if result.Error != nil {
		t.Errorf("test failed! unable to get calendar %v", result.Error)
	}

	assert.Equal(t, "johndoe@ufl.edu", calendar.Email, "incorrect email error")
	assert.Equal(t, "0", calendar.GroupID, "incorrect group ID error")
	assert.Equal(t, "School", calendar.CalendarName, "incorrect calendar name error")
	assert.Equal(t, "janedoe@ufl.edu jimdoe@ufl.edu", calendar.ShareAbility, "incorrect shared with error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to get existing calendar
func TestCalendarGetHandler(t *testing.T) {
	// getting logged in users calendar
	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/calendar?email=janedoe@ufl.edu", nil)
	testRouter.ServeHTTP(rr, req)

	var actual []models.Calendar
	if err := json.Unmarshal(rr.Body.Bytes(), &actual); err != nil {
		t.Errorf("unable to unmarshal body")
	}

	var expected []models.Calendar
	expected = append(expected, models.Calendar{
		Email:        "janedoe@ufl.edu",
		GroupID:      "0",
		CalendarName: "School",
		ShareAbility: "johndoe@ufl.edu jimdoe@ufl.edu",
	})

	assert.Equal(t, expected, actual, "expected does not equal actual")
	assert.Equal(t, http.MethodGet, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to get calendar that was shared with but not owned by user
func TestCalendarGetHandler2(t *testing.T) {
	// getting calendar
	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/calendar?email=johndoe@ufl.edu", nil)
	testRouter.ServeHTTP(rr, req)

	var actual []models.Calendar
	if err := json.Unmarshal(rr.Body.Bytes(), &actual); err != nil {
		t.Errorf("unable to unmarshal body")
	}

	var expected []models.Calendar
	expected = append(expected, models.Calendar{
		Email:        "johndoe@ufl.edu",
		GroupID:      "0",
		CalendarName: "School",
		ShareAbility: "janedoe@ufl.edu jimdoe@ufl.edu",
	})

	assert.Equal(t, expected, actual, "expected does not equal actual")
	assert.Equal(t, http.MethodGet, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

func TestRemoveCalendarDeleteHandler(t *testing.T) {
	// creating a new calendar
	rBody := []byte(`{"email": "janedoe@ufl.edu", "groupID": "1", "calendarName": "Work", "shareAbility": "johndoe@ufl.edu jimdoe@ufl.edu"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/calendar", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var calendar models.Calendar
	result := models.DB.Where("email = ? AND group_id = ?", "janedoe@ufl.edu", "1").First(&calendar)

	if result.Error != nil {
		t.Errorf("test failed! unable to get calendar %v", result.Error)
	}

	assert.Equal(t, "janedoe@ufl.edu", calendar.Email, "incorrect email error")
	assert.Equal(t, "1", calendar.GroupID, "incorrect group ID error")
	assert.Equal(t, "Work", calendar.CalendarName, "incorrect calendar name error")
	assert.Equal(t, "johndoe@ufl.edu jimdoe@ufl.edu", calendar.ShareAbility, "incorrect shared with error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")

	// deleting the calendar
	rBody = []byte(`{"email": "janedoe@ufl.edu", "groupID": "1", "calendarName": "Work", "shareAbility": "johndoe@ufl.edu jimdoe@ufl.edu"}`)

	rr = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodDelete, "/api/calendar", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	result = models.DB.Where("email = ? AND group_id= ?", "janedoe@ufl.edu", "1").First(&calendar)
	// if event is present, test failed
	if result.Error == nil {
		t.Errorf("test failed! calendar should have been deleted %v", result.Error)
	}

	assert.Equal(t, http.MethodDelete, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to add event
func TestEventPostHandler(t *testing.T) {
	deleteFromTable("events")

	rBody := []byte(`{"email": "janedoe@ufl.edu", "groupID": "0", "eventID": "1", "eventTitle": "Birthday", "eventDescription": "It's a my Birthday", "eventDate": "2023-03-09", 
	"startTime": "10:00", "endTime": "11:00", "freq": "daily", "dtStart": "2023-03-09", "until": "2024-03-09", "backgroundColor": "#08B417"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("email = ? AND group_id = ? AND event_id = ?", "janedoe@ufl.edu", "0", "1").First(&event)
	if result.Error != nil {
		t.Errorf("test failed! unable to get event %v", result.Error)
	}

	assert.Equal(t, "janedoe@ufl.edu", event.Email, "incorrect email error")
	assert.Equal(t, "0", event.GroupID, "incorrect group ID error")
	assert.Equal(t, "1", event.EventID, "incorrect event ID error")
	assert.Equal(t, "Birthday", event.EventTitle, "incorrect event title error")
	assert.Equal(t, "It's a my Birthday", event.Description, "incorrect event description error")
	assert.Equal(t, "2023-03-09", event.EventDate, "incorrect event date error")
	assert.Equal(t, "10:00", event.StartTime, "incorrect event start time error")
	assert.Equal(t, "11:00", event.EndTime, "incorrect event end time error")
	assert.Equal(t, "daily", event.Freq, "incorrect event frequency error")
	assert.Equal(t, "2023-03-09", event.DTStart, "incorrect event dt start error")
	assert.Equal(t, "2024-03-09", event.Until, "incorrect event until error")
	assert.Equal(t, "#08B417", event.BackgroundColor, "incorrect event background color error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to add event to a different email
func TestEventPostHandler2(t *testing.T) {
	rBody := []byte(`{"email": "janedoe2@ufl.edu", "groupID": "0", "eventID": "2", "eventTitle": "Birthday", "eventDescription": "It's a my Birthday", "eventDate": "2023-03-09", 
	"startTime": "10:00", "endTime": "11:00", "freq": "daily", "dtStart": "2023-03-09", "until": "2024-03-09", "backgroundColor": "#08B417"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("email = ? AND group_id = ? AND event_id = ?", "janedoe2@ufl.edu", "0", "2").First(&event)
	if result.Error != nil {
		t.Errorf("test failed! unable to get event %v", result.Error)
	}

	assert.Equal(t, "janedoe2@ufl.edu", event.Email, "incorrect email error")
	assert.Equal(t, "0", event.GroupID, "incorrect group ID error")
	assert.Equal(t, "2", event.EventID, "incorrect event ID error")
	assert.Equal(t, "Birthday", event.EventTitle, "incorrect event title error")
	assert.Equal(t, "It's a my Birthday", event.Description, "incorrect event description error")
	assert.Equal(t, "2023-03-09", event.EventDate, "incorrect event date error")
	assert.Equal(t, "10:00", event.StartTime, "incorrect event start time error")
	assert.Equal(t, "11:00", event.EndTime, "incorrect event end time error")
	assert.Equal(t, "daily", event.Freq, "incorrect event frequency error")
	assert.Equal(t, "2023-03-09", event.DTStart, "incorrect event dt start error")
	assert.Equal(t, "2024-03-09", event.Until, "incorrect event until error")
	assert.Equal(t, "#08B417", event.BackgroundColor, "incorrect event background color error")
	assert.Equal(t, http.MethodPost, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to edit existing event
func TestEditEventPatchHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "groupID": "0", "eventID": "1", "eventTitle": "Holiday", "eventDescription": "It's a Holiday", "eventDate": "2023-04-09", 
	"startTime": "11:00", "endTime": "12:00", "freq": "weekly", "dtStart": "2023-04-09", "until": "2024-04-09", "backgroundColor": "#08B419"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPatch, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("email = ? AND group_id = ? AND event_id = ?", "janedoe@ufl.edu", "0", "1").First(&event)
	if result.Error != nil {
		t.Errorf("test failed! unable to get event %v", result.Error)
	}

	assert.Equal(t, "janedoe@ufl.edu", event.Email, "incorrect email error")
	assert.Equal(t, "0", event.GroupID, "incorrect group ID error")
	assert.Equal(t, "1", event.EventID, "incorrect event ID error")
	assert.Equal(t, "Holiday", event.EventTitle, "incorrect event title error")
	assert.Equal(t, "It's a Holiday", event.Description, "incorrect event description error")
	assert.Equal(t, "2023-04-09", event.EventDate, "incorrect event date error")
	assert.Equal(t, "11:00", event.StartTime, "incorrect event start time error")
	assert.Equal(t, "12:00", event.EndTime, "incorrect event end time error")
	assert.Equal(t, "weekly", event.Freq, "incorrect event frequency error")
	assert.Equal(t, "2023-04-09", event.DTStart, "incorrect event dt start error")
	assert.Equal(t, "2024-04-09", event.Until, "incorrect event until error")
	assert.Equal(t, "#08B419", event.BackgroundColor, "incorrect event background color error")
	assert.Equal(t, http.MethodPatch, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// function returns all events of calendar, need to check
// test to get existing event
func TestReceiveEventGetHandler(t *testing.T) {

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/event?email=janedoe@ufl.edu&groupID=0", nil)
	testRouter.ServeHTTP(rr, req)

	var actual []models.Event
	if err := json.Unmarshal(rr.Body.Bytes(), &actual); err != nil {
		t.Errorf("unable to unmarshal body")
	}

	var expected []models.Event
	expected = append(expected, models.Event{
		Email:           "janedoe@ufl.edu",
		GroupID:         "0",
		EventID:         "1",
		EventTitle:      "Holiday",
		Description:     "It's a Holiday",
		EventDate:       "2023-04-09",
		StartTime:       "11:00",
		EndTime:         "12:00",
		Freq:            "weekly",
		DTStart:         "2023-04-09",
		Until:           "2024-04-09",
		BackgroundColor: "#08B419",
	})

	assert.Equal(t, expected, actual, "expected does not equal actual")
	assert.Equal(t, http.MethodGet, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}

// test to remove existing event
func TestRemoveEventDeleteHandler(t *testing.T) {
	rBody := []byte(`{"email": "janedoe@ufl.edu", "groupID": "0", "eventID": "1", "eventTitle": "Holiday", "eventDescription": "It's a Holiday", "eventDate": "2023-04-09", 
	"startTime": "11:00", "endTime": "12:00", "freq": "weekly", "dtStart": "2023-04-09", "until": "2024-04-09", "backgroundColor": "#08B419"}`)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodDelete, "/api/event", bytes.NewBuffer(rBody))
	testRouter.ServeHTTP(rr, req)

	var event models.Event
	result := models.DB.Where("email = ? AND group_id = ? AND event_id = ?", "janedoe@ufl.edu", "0", "1").First(&event)
	// if event is present, test failed
	if result.Error == nil {
		t.Errorf("test failed! event should have been deleted %v", result.Error)
	}

	assert.Equal(t, http.MethodDelete, req.Method, "HTTP request method error")
	assert.Equal(t, http.StatusOK, rr.Code, "HTTP request status code error")
}
