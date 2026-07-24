package main

import (
	"log"
	"net/http"

	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/infra/controllers"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /health-check", controllers.HealthCheck)
	mux.HandleFunc("POST /ingest-log", controllers.CreateHttpTrafficRecord)

	log.Println("Server running on :8081")
	log.Fatal(http.ListenAndServe(":8081", mux))
}
