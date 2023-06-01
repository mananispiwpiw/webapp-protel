package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type SensorData struct {
	LdrValue float64 `json:"ldrValue"`
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
		lastSensorValue = sensorData.LdrValue
		fmt.Printf("Received sensor value: %f\n", sensorData.LdrValue)
		return c.JSON(fiber.Map{"status": "success", "message": "Received sensor data"})
	})

	//GET method
	app.Get("/api/get/sensor", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"ldrValue": lastSensorValue,
		})
	})
	log.Fatal(app.Listen(":3000"))
}
