package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/alyHusseinn/mobility-app/trips/config"
	"github.com/alyHusseinn/mobility-app/trips/helpers"
	"github.com/alyHusseinn/mobility-app/trips/models"
	"github.com/gin-gonic/gin"
)

// Request structs for trip creation and updating
type CreateTripRequest struct {
	Origin      models.Coordinates `json:"origin" binding:"required"`
	Destination models.Coordinates `json:"destination" binding:"required"`
}

type UpdateTripRequest struct {
	DriverId uint              `json:"driver_id" binding:"required"`
	Status   models.TripStatus `json:"status" binding:"required"`
}

// TripRouter initializes all trip routes
func TripRouter(router *gin.RouterGroup) {
	router.POST("/", createTrip)
	router.PUT("/:id", updateTrip)
	router.GET("/", getAllTrips)
	router.GET("/:id", getTripByID)
}

// createTrip handles trip creation
func createTrip(ctx *gin.Context) {
	db := config.DB
	var tripReq CreateTripRequest

	// Validate the request body
	if err := ctx.ShouldBindJSON(&tripReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Extract rider ID from headers
	riderId, err := strconv.ParseUint(ctx.Request.Header.Get("x-user-id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "x-user-id header is required"})
		return
	}

	// Calculate trip details
	distance := helpers.CalculateDistance(tripReq.Origin, tripReq.Destination)
	price := helpers.CalculatePrice(distance)

	trip := models.Trip{
		RiderId:     uint(riderId),
		Origin:      tripReq.Origin,
		Destination: tripReq.Destination,
		Distance:    distance,
		Price:       price,
	}

	// Store trip in the database
	if err := db.Create(&trip).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create trip", "detail": err.Error()})
		return
	}

	// Attempt to match the trip with a driver
	if err := helpers.MatchTrip(&trip); err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to match trip", "detail": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "trip created successfully", "data": trip})
}

// updateTrip handles updating an existing trip
func updateTrip(ctx *gin.Context) {
	db := config.DB
	var trip models.Trip
	var updateReq UpdateTripRequest

	// Validate trip ID from URL params
	tripId := ctx.Param("id")
	if err := db.First(&trip, tripId).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "trip not found"})
		return
	}

	// Validate the update request body
	if err := ctx.ShouldBindJSON(&updateReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update trip fields
	if updateReq.Status == models.Ongoing {
		trip.StartTime = time.Now()
	}
	if updateReq.Status == models.Completed {
		helpers.ProcessPayment(trip)
		trip.EndTime = time.Now()
	}

	trip.DriverId = updateReq.DriverId
	trip.Status = updateReq.Status

	// Save updated trip
	if err := db.Save(&trip).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update trip", "detail": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "trip updated successfully", "data": trip})
}

// getAllTrips fetches all trips from the database
func getAllTrips(ctx *gin.Context) {
	db := config.DB
	var trips []models.Trip
	db.Find(&trips)

	ctx.JSON(http.StatusOK, gin.H{"message": "trips fetched successfully", "data": trips})
}

// getTripByID fetches a specific trip by ID
func getTripByID(ctx *gin.Context) {
	db := config.DB
	var trip models.Trip
	tripId := ctx.Param("id")

	if err := db.First(&trip, tripId).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "trip not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "trip fetched successfully", "data": trip})
}