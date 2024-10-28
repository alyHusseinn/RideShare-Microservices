package main

import (
	"fmt"
	"github.com/alyHusseinn/mobility-app/trips/config"
	"github.com/alyHusseinn/mobility-app/trips/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	config.Migrate()

	r := gin.Default()

	api := r.Group("/api")
	{
		routes.TripRouter(api)
	}

	fmt.Println("trips service is running on port 8080")

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
