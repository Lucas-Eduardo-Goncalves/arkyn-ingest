package useCases

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/domain/entities"
	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/infra/services"
)

func CreateHttpTrafficRecord(httpTrafficRecord entities.HttpTrafficRecord) error {
	producer := services.NewProducer([]string{"localhost:9092"}, "http-traffic-records")
	defer producer.Close()

	message, err := json.Marshal(httpTrafficRecord)
	if err != nil {
		panic(fmt.Sprintf("Failed to marshal HttpTrafficRecord: %s", err))
	}

	return producer.SendMessage(context.Background(), string(message))
}
