package helpers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"github.com/alyHusseinn/mobility-app/trips/models"
	"fmt"
)

// call the match service to match the trip with nearby available driver
// it recivess the trip id and the trip info
/*
{
	1. id
	2. origin
	3. destination
}
*/

func MatchTrip(trip *models.Trip) error {
	// POST trip to match service http://localhost:4000/api/match
	jsonData, err := json.Marshal(trip)
	if err != nil {
		return err
	}

	resp, err := http.Post("http://localhost:4000/api/match", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("match service returned status code: %d", resp.StatusCode)
	}

	return nil
}
