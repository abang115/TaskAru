package models

// import(
// 	"image/color"
// )

// type RRule struct {
// 	Freq    string `json:"freq"`
// 	DTStart string `json:"dtstart"`
// 	Until   string `json:"until"`
// }

type Event struct {
	Email       string `json:"email"`
	EventID     string `json:"eventID"`
	EventTitle  string `json:"eventTitle"`
	Description string `json:"eventDescription"`
	EventDate   string `json:"eventDate"`
	StartTime   string `json:"startTime"`
	EndTime     string `json:"endTime"`

	// subject to change
	Freq            string `json:"freq"`
	DTStart         string `json:"dtstart"`
	Until           string `json:"until"`
	BackgroundColor string `json:"backgroundColor"`

	// rrule	    string `json:rrule"`
	// BackgroundColor color.RGBA
}
