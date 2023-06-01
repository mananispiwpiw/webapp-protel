package models

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
}

type IoT struct {
	ID       uint   `gorm:"primaryKey"`
	DeviceID string `gorm:"unique"`
	UserID   uint   `gorm:"foreignKey:ID;references:User"`
}
