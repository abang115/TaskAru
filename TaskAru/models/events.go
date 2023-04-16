package models

type Event struct {
	Email           string `json:"email"`
	GroupID         string `json:"groupID"`
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
}

type Calendar struct {
	Email        string `json:"email"`
	GroupID      string `json:"groupID"`
	CalendarName string `json:"calendarName"`
	ShareAbility string `json:"shareAbility"`
}
