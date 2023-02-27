package models

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	//"github.com/CEN3031/TaskAru/models"
)

type User struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	details   Calendar
}

type userLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateUser(user User) (User, error) {
	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, errors.New("could not hash password")
	}

	user.Password = string(hashedPassword)
	result := DB.Where("email = ?", user.Email).FirstOrCreate(&user)

	// User already exists
	if result.RowsAffected == 0 {
		return User{}, errors.New("User Already Exists")
	}

	return user, nil
}
