package initializers

import (
	"fmt"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SensorData struct {
	ID        uint      `gorm:"primaryKey"`
	DeviceID  string    `gorm:"not null"`
	Timestamp time.Time `gorm:"not null"`
	Value     float64   `gorm:"not null"`
}

var DB *gorm.DB

func ConnectToDatabase() error {
	//var err error
	dsn := "host=localhost user=postgres password=admin dbname=protelGaming port=5432"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Failed to connect to database")
		return err
	}

	err = db.AutoMigrate(&SensorData{})
	if err != nil {
		fmt.Println("Failed to migrate database")
		return err
	}
	DB = db
	return nil
}
