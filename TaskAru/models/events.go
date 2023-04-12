package models

type Event struct {
	Email           string `json:"email"`
	EventID         string `json:"eventID"`
	EventTitle      string `json:"eventTitle"`
	Description     string `json:"eventDescription"`
	EventDate       string `json:"eventDate"`
	StartTime       string `json:"startTime"`
	EndTime         string `json:"endTime"`
	Freq            string `json:"freq"`
	DTStart         string `json:"dtstart"`
	Until           string `json:"until"`
	BackgroundColor string `json:"backgroundColor"`
	ShareAbility    string `json:"sharedWith"`
}
