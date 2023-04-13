package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"net/http"
)

func CalendarPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var newCalendar models.Calendar
	_ = json.NewDecoder(r.Body).Decode(&newCalendar)

	models.DB.Create(&newCalendar)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newCalendar)
}

func CalendarGetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var getCalendar models.Calendar
	var calendars []models.Calendar

	_ = json.NewDecoder(r.Body).Decode(&getCalendar)

	models.DB.Where("email = ?", getCalendar.Email).Find(&calendars)

	if len(calendars) == 0 {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find calendar"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(calendars)
}

func EventPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var newEvent models.Event
	_ = json.NewDecoder(r.Body).Decode(&newEvent)

	models.DB.Create(&newEvent)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newEvent)
}

func EditEventPatchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var updateEvent models.Event
	var events []models.Event

	_ = json.NewDecoder(r.Body).Decode(&updateEvent)

	searchErr := models.DB.Where("email = ? AND event_id = ?", updateEvent.Email, updateEvent.EventID).First(&events).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	// look through events with email first
	if err := models.DB.Model(&updateEvent).Where("event_id = ?", updateEvent.EventID).Updates(models.Event{GroupID: updateEvent.GroupID, EventTitle: updateEvent.EventTitle, Description: updateEvent.Description, EventDate: updateEvent.EventDate,
		StartTime: updateEvent.StartTime, EndTime: updateEvent.EndTime, Freq: updateEvent.Freq, DTStart: updateEvent.DTStart, Until: updateEvent.Until, BackgroundColor: updateEvent.BackgroundColor}).Error; err != nil {
		// check error message
		w.WriteHeader(http.StatusInternalServerError)
		errorMessage := map[string]string{"error": "could not update event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updateEvent)
}

func RemoveEventDeleteHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var deleteEvent models.Event
	var events []models.Event

	_ = json.NewDecoder(r.Body).Decode(&deleteEvent)

	searchErr := models.DB.Where("event_id = ?", deleteEvent.EventID).First(&events).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	if err := models.DB.Where("event_id = ?", deleteEvent.EventID).Delete(&deleteEvent).Error; err != nil {

		// check error message
		w.WriteHeader(http.StatusInternalServerError)
		errorMessage := map[string]string{"error": "could not delete event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deleteEvent)
}

// Receive the users personal events
func ReceiveEventGetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	email := r.URL.Query().Get("email")

	// events currently in database
	var events []models.Event
	models.DB.Where("email = ?", email).Find(&events)

	if len(events) == 0 {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(events)
}

// Receives shared with events
func ReceiveSharedEventGetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	// uses email and groupID of toggled calendar to find events that are under that shared calendar
	var getSharedEvent models.Event
	var events []models.Event

	_ = json.NewDecoder(r.Body).Decode(&getSharedEvent)

	models.DB.Where("email = ? AND groupID = ?", getSharedEvent.Email, getSharedEvent.GroupID).Find(&events)

	if len(events) == 0 {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(events)
}
