package useCases

import (
	"fmt"

	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/domain/entities"
)

func CreateHttpTrafficRecord(httpTrafficRecord entities.HttpTrafficRecord) error {
	fmt.Println(httpTrafficRecord)
	return nil
}
