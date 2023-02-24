package models

type Event struct {
	EventTitle  string `json:"eventTitle"`
	EventDate   string `json:"eventDate"`
	StartTime   string `json:"startTime"`
	EndTime     string `json:"endTime"`
	Description string `json:"eventDescription"`
}
