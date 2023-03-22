package controllers

import (
	"TaskAru/models"
	"encoding/json"
	"errors"
	"log"
	"math/rand"
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

func ForgotPasswordPostHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var forgot models.ForgotPassword
	var user models.User

	_ = json.NewDecoder(r.Body).Decode(&forgot)

	forgot.Token = RandomString(12)

	searchErr := models.DB.Where("email = ?", forgot.Email).First(&user).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find email"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	models.DB.Create(&forgot)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(forgot)
	SendEmail(forgot.Email, forgot.Token)
}

func SendEmail(to string, token string) {
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
	m.SetBody("text/html", "<a href=\"localhost:4200/resetpassword/"+token+"\">Click here</a> to reset your password!")

	d := mail.NewDialer(host, 587, user, password)

	if err := d.DialAndSend(m); err != nil {
		log.Fatal("Could not send email: ", err)
	}
}

func RandomString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func ResetPasswordPatchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "*")

	var reset models.ResetPassword
	var forgot models.ForgotPassword
	var updatedUser models.User

	_ = json.NewDecoder(r.Body).Decode(&reset)

	searchErr := models.DB.Where("token = ?", reset.Token).Last(&forgot).Error

	if searchErr != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not find token"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	password, err := bcrypt.GenerateFromPassword([]byte(reset.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		errorMessage := map[string]string{"error": "could not hash password"}
		json.NewEncoder(w).Encode(errorMessage)
		return
	}

	models.DB.Model(&updatedUser).Where("email = ?", forgot.Email).Update("password", password)
	w.WriteHeader(http.StatusOK)
	message := map[string]string{"message": "successful reset password"}
	json.NewEncoder(w).Encode(message)
}
