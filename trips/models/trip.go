package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"gorm.io/gorm"
	"time"
)

type Coordinates struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

// The valuer innterface to convert struct coordinates to json data inorder to store it in the database
func (c Coordinates) Value() (driver.Value, error) {
	return json.Marshal(c)
}

// Scanner interface to convert json data from database to struct coordinates
func (c *Coordinates) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &c)
}

type TripStatus string

const (
	Pending   TripStatus = "pending"
	Accepted  TripStatus = "accepted"
	Ongoing   TripStatus = "ongoing"
	Completed TripStatus = "completed"
)

type Trip struct {
	gorm.Model
	Origin      Coordinates `json:"origin" gorm:"type:jsonb"`                         // stored as jsonb in postgres
	Destination Coordinates `json:"destination" gorm:"type:jsonb"`                    // stored as jsonb in postgres
	DriverId    uint        `json:"driver_id"`                                        // it's a foreign key to User but the user table in another database
	RiderId     uint        `json:"rider_id"`                                         // it's a foreign key to User but the user table in another database
	Status      TripStatus  `gorm:"type:varchar(20);default:'pending'" json:"status"` // pending, accepted, ongoing, completed
	Price       float64     `json:"price"`
	Distance    float64     `json:"distance"`
	StartTime   time.Time   `json:"start_time"`
	EndTime     time.Time   `json:"end_time"`
}

// func (t *Trip) TableName() string {
// 	return "trip"
// }

// func (t *Trip) BeforeCreate(tx *gorm.DB) (err error) {
// 	// t.Status = "pending"
// 	// calc the price and distance by knowing the origin and distination
// 	t.Status = Pending
// 	return
// }

// func (t *Trip) BeforeUpdate(tx *gorm.DB) (err error) {
// 	// if the trip's status set to ongoing set the start time
// 	return
// }
