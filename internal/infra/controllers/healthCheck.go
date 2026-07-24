package controllers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/infra/services"
)

const (
	serviceName    = "arkyn-ingest"
	serviceVersion = "dev"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	hostname, err := os.Hostname()

	if err != nil {
		hostname = "unknown"
	}

	message := fmt.Sprintf(
		"Service %s is healthy on container %s using version %s",
		serviceName, hostname, serviceVersion,
	)

	services.WriteJson(w, 200, map[string]string{"message": message})
}
