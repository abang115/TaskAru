package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"net/http"
)

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

	// gets the ID of the event that needs to be edited

	var updateEvent models.Event
	var events []models.Event

	_ = json.NewDecoder(r.Body).Decode(&updateEvent)

	searchErr := models.DB.Where("event_id = ?", updateEvent.EventID).First(&events).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	if err := models.DB.Model(&updateEvent).Where("event_id = ?", updateEvent.EventID).Updates(models.Event{EventTitle: updateEvent.EventTitle, Description: updateEvent.Description, EventDate: updateEvent.EventDate,
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

func ReceiveEventGetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	// var getEvents used to send back information
	// events currently in database
	var getEvent models.Event
	var events []models.Event
	models.DB.Find(&events)
	_ = json.NewDecoder(r.Body).Decode(&getEvent)

	for _, entry := range events {
		if entry.Email == getEvent.Email {
			events = append(events, entry)
		}
	}

	if len(events) == 0 {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(getEvent)
}
