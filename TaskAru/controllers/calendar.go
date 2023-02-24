package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"net/http"
)

func CalendarPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")
	w.WriteHeader(http.StatusOK)

	var newCalendar models.Calendar

	models.DB.Create(&newCalendar)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newCalendar)
}
