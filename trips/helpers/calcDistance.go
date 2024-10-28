package helpers

import (
	"github.com/alyHusseinn/mobility-app/trips/models"
)

// 1. use any api -> google maps api to calculate the distance between two points
// 2. calulate the price of the trip

// https://developers.google.com/maps/documentation/distance-matrix/overview

func CalculateDistance(origin models.Coordinates, destination models.Coordinates) float64 {
	// calculate the distance between two points
	return 17.223
}
