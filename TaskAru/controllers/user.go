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

func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	// checks to see if first name, last name, password, and email fields are present
	if user.FirstName == "" || user.LastName == "" || user.Password == "" || user.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Request Body Missing Fields"))
		return
	}

	// creates user
	userCreated, userErr := models.CreateUser(user)

	if userErr != nil {
		// if password can't be hashed
		if userErr.Error() == "could not hash password" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(userErr.Error()))
			return
		}

		// if the user already exists
		if userErr.Error() == "User Already Exists" {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte(userErr.Error()))
			return
		}
	}

	json.NewEncoder(w).Encode(userCreated)
}
