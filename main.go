package main

import (
	"fmt"
	"log"
	"protel/initializers"

	//"protel/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type SensorData struct {
	PotensioValue float64 `json:"potensioValue"`
}

type PredictedData struct {
	PredictedValue float64 `json:"predictedValue"`
}

var lastSensorValue float64
var lastPredictedValue float64

func main() {
	//create new fiber app
	app := fiber.New()
	app.Use(logger.New())

	//CORS
	// Add CORS middleware to allow cross-origin requests
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST",
		AllowHeaders:     "*",
		AllowCredentials: true,
	}))

	// Add a static file handler: Serve files from the "./public" directory
	app.Static("/", "./public")

	//POST predictedValue method
	app.Post("/api/post/predict", func(c *fiber.Ctx) error {
		predictedData := new(PredictedData)

		if err := c.BodyParser(predictedData); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
		}
		lastPredictedValue = predictedData.PredictedValue

		newPredictedValue := &initializers.PredictedData{
			PTimestamp: time.Now(),
			PValue:     lastPredictedValue,
		}

		//Insert the data to the database
		result := initializers.DB.Create(&newPredictedValue)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Couldn't insert data to database"})
		}
		fmt.Printf("Received predicted value: %f\n", lastPredictedValue)
		return c.JSON(fiber.Map{"status": "success", "message": "Received predicted data"})
	})

	//POST sensor method
	app.Post("/api/post/sensor", func(c *fiber.Ctx) error {
		sensorData := new(SensorData)

		if err := c.BodyParser(sensorData); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
		}
		lastSensorValue = sensorData.PotensioValue

		//Create a new instance of the IoT model
		newSensorData := &initializers.SensorData{
			DeviceID:  "potensio-001",
			Timestamp: time.Now(),
			Value:     lastSensorValue,
		}

		//Insert the data to the database
		result := initializers.DB.Create(&newSensorData)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Couldn't insert data to database"})
		}

		fmt.Printf("Received sensor value: %f\n", sensorData.PotensioValue)
		return c.JSON(fiber.Map{"status": "success", "message": "Received sensor data"})
	})

	//GET method
	app.Get("/api/get/sensor", func(c *fiber.Ctx) error {
		var sensorData []initializers.SensorData

		err := initializers.DB.Order("timestamp desc").Find(&sensorData).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Couldn't get data from database"})
		}
		return c.JSON(fiber.Map{"status": "success", "data": sensorData})
	})

	//Database Things
	err := initializers.ConnectToDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	log.Fatal(app.Listen(":3000"))

}
