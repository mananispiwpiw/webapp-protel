package main

import (
	"fmt"
	"log"
	"protel/initializers"

	//"protel/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type SensorData struct {
	PotensioValue float64 `json:"potensioValue"`
}

var lastSensorValue float64

func main() {
	//create new fiber app
	app := fiber.New()
	app.Use(logger.New())

	//POST method
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
		return c.JSON(fiber.Map{
			"potensioValue": lastSensorValue,
		})
	})

	//Database Things
	err := initializers.ConnectToDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	log.Fatal(app.Listen(":3000"))

}
