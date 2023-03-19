package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"

	"github.com/go-mail/mail"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func RegisterPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var newUser models.User
	var users []models.User
	models.DB.Find(&users)
	_ = json.NewDecoder(r.Body).Decode(&newUser)

	for _, entry := range users {
		if entry.Email == newUser.Email {
			w.WriteHeader(http.StatusConflict)
			existErr := errors.New("Email already exists")
			w.Write([]byte(existErr.Error()))
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

func SignInPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var signin models.UserSignIn
	var user models.User

	_ = json.NewDecoder(r.Body).Decode(&signin)

	searchErr := models.DB.Where("email = ?", signin.Email).First(&user).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find email"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	passwordErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(signin.Password))

	if passwordErr != nil {
		w.WriteHeader(http.StatusUnauthorized)
		errorMessage := map[string]string{"error": "wrong password"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	w.WriteHeader(http.StatusOK)
	message := map[string]string{"message": "successful login"}
	json.NewEncoder(w).Encode(message)
}

func ForgotPasswordPutHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")
	w.WriteHeader(http.StatusOK)

	// gets the ID of the event that needs to be edited
	// id := r.URL.Query().Get("id")

	// // does it need to be newEvent?
	// var updateUser models.User
	// var users []models.Event

	// searchErr := models.DB.Where("eventID = ?", updateUser.UserID).First(&users, id).Error

	// if searchErr != nil {
	// 	w.WriteHeader(http.StatusNotFound)
	// 	errorMessage := map[string]string{"error": "could not find event"}
	// 	json.NewEncoder(w).Encode(errorMessage)
	// 	return
	// }

	// if err := models.DB.Where("eventID = ?", updateUser.UserID).Update(models.User{Password: updateUser.Password}).Error; err != nil {
	// 	// check error message
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	errorMessage := map[string]string{"error": "could not update evnet"}
	// 	json.NewEncoder(w).Encode(errorMessage)
	// 	return
	// }

	// w.WriteHeader(http.StatusOK)
	// json.NewEncoder(w).Encode(updateUser)
}

func ForgotPasswordPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var forgot models.ForgotPassword
	var user models.User

	_ = json.NewDecoder(r.Body).Decode(&forgot)

	searchErr := models.DB.Where("email = ?", forgot.Email).First(&user).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find email"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}
	w.WriteHeader(http.StatusOK)
	message := map[string]string{"message": "email found"}
	json.NewEncoder(w).Encode(message)
	SendEmail(forgot.Email)
}

func SendEmail(to string) {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	from := os.Getenv("EMAIL_FROM")
	host := os.Getenv("SMTP_HOST")
	user := os.Getenv("SMTP_USER")
	password := os.Getenv("SMTP_PASS")

	m := mail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Reset Password")
	m.SetBody("text/html", "<a href=\"localhost:4200/resetpassword\">Click here</a> to reset your password!")

	d := mail.NewDialer(host, 587, user, password)

	if err := d.DialAndSend(m); err != nil {
		log.Fatal("Could not send email: ", err)
	}
}
