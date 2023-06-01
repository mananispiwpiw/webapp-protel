package initializers

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDatabase() {
	var err error
	dsn := "host=localhost user=postgres password=admin dbname=protel port=5432"
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Failed to connect to database")
	}
}
