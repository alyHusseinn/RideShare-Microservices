package routes

import (
	"github.com/alyHusseinn/mobility-app/trips/config"
	"github.com/alyHusseinn/mobility-app/trips/helpers"
	"github.com/alyHusseinn/mobility-app/trips/models"
	"github.com/gin-gonic/gin"
	"time"
)

type CreateTripReqest struct {
	RiderId     uint               `json:"rider_id" binding:"required"`
	Origin      models.Coordinates `json:"origin" binding:"required"`
	Destination models.Coordinates `json:"destination" binding:"required"`
}

type UpdateTripReq struct {
	DriverId uint              `json:"driver_id" binding:"required"`
	Status   models.TripStatus `json:"status" binding:"required"`
}

func TripRouter(router *gin.RouterGroup) {
	router.POST("/", func(ctx *gin.Context) {
		// the req should be in JSON format
		// 1. rider_id, 2. origin -> lat, long. 3.destination -> lat, long
		db := config.DB
		var trip models.Trip
		// validate the the req
		var tripReq CreateTripReqest
		if err := ctx.ShouldBindJSON(&tripReq); err != nil {
			ctx.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}
		// 1. calcutle the Price of the tirp
		// 2. calulate the distance
		// 3. Call match service with trip info to match it with nearby available driver
		distance := helpers.CalculateDistance(tripReq.Origin, tripReq.Destination)
		price := helpers.CalculatePrice(distance)

		trip = models.Trip{
			RiderId:     tripReq.RiderId,
			Origin:      tripReq.Origin,
			Destination: tripReq.Destination,
			Distance:    distance,
			Price:       price,
		}
		if err := db.Create(&trip).Error; err != nil {
			ctx.JSON(500, gin.H{
				"error":  "failed to create trip",
				"detail": err.Error(),
			})
			return
		}
		// call match service to match the trip with nearby available driver
		if err := helpers.MatchTrip(&trip); err != nil {
			ctx.JSON(500, gin.H{
				"error":  "failed to match trip",
				"detail": err.Error(),
			})
			return
		}
		
		ctx.JSON(200, gin.H{
			"message": "trip created successfully",
			"data":    trip,
		})
	})

	router.PUT("/:id", func(ctx *gin.Context) {
		// 1. check if the trip exists
		// 2. update the trip status
		db := config.DB
		var trip models.Trip

		tripId := ctx.Param("id")

		if err := db.First(&trip, tripId).Error; err != nil {
			ctx.JSON(404, gin.H{
				"error": "trip not found",
			})
			return
		}

		var updateTripReq UpdateTripReq
		if err := ctx.ShouldBindJSON(&updateTripReq); err != nil {
			ctx.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		if updateTripReq.Status == models.Ongoing {
			trip.StartTime = time.Now()
		}

		if updateTripReq.Status == models.Completed {
			// call payment service to pay the rider
			helpers.ProcessPayment(trip)
			trip.EndTime = time.Now()
		}

		trip.DriverId = updateTripReq.DriverId
		trip.Status = updateTripReq.Status
		db.Save(&trip)

		ctx.JSON(200, gin.H{
			"message": "trip updated successfully",
			"data":    trip,
		})
	})

	router.GET("/", func(ctx *gin.Context) {
		db := config.DB
		var trips []models.Trip
		db.Find(&trips)
		ctx.JSON(200, gin.H{
			"message": "trips fetched successfully",
			"data":    trips,
		})
	})

	router.GET("/:id", func(ctx *gin.Context) {
		db := config.DB
		var trip models.Trip
		tripId := ctx.Param("id")
		if err := db.First(&trip, tripId).Error; err != nil {
			ctx.JSON(404, gin.H{
				"error": "trip not found",
			})
			return
		}
		ctx.JSON(200, gin.H{
			"message": "trip fetched successfully",
			"data":    trip,
		})
	})
}

/*
1. create a new trip -> POST /
2. update existing trip status -> PUT /:id
3. get all trips -> GET /
4. get trip by id -> GET /:id
5. delete trip -> DELETE /:id
*/
