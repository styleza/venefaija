package main

import (
    "encoding/json"
    "log"
    "net/http"
    "github.com/gorilla/mux"
)

type GPSRecord struct {
    Longitude  float64 `json:"lon,omitempty"`
    Latitude float64 `json:"lat,omitempty"`
	Speed float64 `json:"speed,omitempty"`
	Heading float64 `json:"heading,omitempty"`
}

func GetGPS(w http.ResponseWriter, r *http.Request) {
	var record []GPSRecord
	record = append(record, GPSRecord{Longitude: 1.0, Latitude: 2.0, Speed: 3.0, Heading: 99.0})
	
	json.NewEncoder(w).Encode(record)
}
func GetWindSpeed(w http.ResponseWriter, r *http.Request) {}

// our main function
func main() {
    router := mux.NewRouter()
	router.HandleFunc("/gps", GetGPS).Methods("GET")
	router.HandleFunc("/wind/speed", GetWindSpeed).Methods("GET")
	//router.HandleFunc("/wind/direction", GetGPS).Methods("GET")
	//router.HandleFunc("/temperature", GetGPS).Methods("GET")
	
    log.Fatal(http.ListenAndServe(":8000", router))}
