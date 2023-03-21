package models

type User struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	details   Calendar
}

type UserSignIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ForgotPassword struct {
	Email string `json:"email"`
	Token string `json:"token" gorm:"unique"`
}

type ResetPassword struct {
	Password string `json:"password"`
	Token    string `json:"token" gorm:"unique"`
}
