package models

type Event struct {
	EventID     string `json:"eventID"`
	EventTitle  string `json:"eventTitle"`
	Description string `json:"eventDescription"`
	EventDate   string `json:"eventDate"`
	StartTime   string `json:"startTime"`
	EndTime     string `json:"endTime"`
	// rrule	     		string `json:rrule"`
	// backgroundColor     string `json:"backgroundColor"`
}
