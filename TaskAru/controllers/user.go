package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func RegisterPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")
	w.WriteHeader(http.StatusOK)

	var newUser models.User
	var users []models.User
	models.DB.Find(&users)
	_ = json.NewDecoder(r.Body).Decode(&newUser)

	for _, entry := range users {
		if entry.Email == newUser.Email {
			w.WriteHeader(http.StatusConflict)
			errorMessage := map[string]string{"error": "Email already exists"}
			json.NewEncoder(w).Encode(errorMessage)
			return
		}
	}

	password, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not hash password"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}
	newUser.Password = string(password)
	models.DB.Create(&newUser)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newUser)
}
