package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"net/http"
)

func EventPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")
	w.WriteHeader(http.StatusOK)

	var newEvent models.Event

	models.DB.Create(&newEvent)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newEvent)
}

func EditEventPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")
	w.WriteHeader(http.StatusOK)

	// gets the ID of the event that needs to be edited
	id := r.URL.Query().Get("id")

	// does it need to be newEvent?
	var updateEvent models.Event
	var events []models.Event

	searchErr := models.DB.Where("eventID = ?", updateEvent.EventID).First(&events, id).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find event"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	if err := models.DB.Where("eventID = ?", updateEvent.EventID).Updates(models.Event{EventTitle: updateEvent.EventTitle, Description: updateEvent.Description, EventDate: updateEvent.EventDate, StartTime: updateEvent.StartTime, EndTime: updateEvent.EndTime}).Error; err != nil {
		// check error message
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updateEvent)
}
