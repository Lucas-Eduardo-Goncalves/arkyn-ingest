package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/app/useCases"
	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/domain/entities"
	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/infra/services"
	"github.com/go-playground/validator/v10"
)

func CreateHttpTrafficRecord(w http.ResponseWriter, r *http.Request) {
	var input entities.NewHttpTrafficRecordInput

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		services.WriteJsonError(w, http.StatusBadRequest, err)
		return
	}

	validate := validator.New()

	if err := validate.Struct(input); err != nil {
		services.WriteJsonError(w, http.StatusBadRequest, err)
		return
	}

	httpTrafficRecord := entities.NewHttpTrafficRecord(input)

	if err := useCases.CreateHttpTrafficRecord(httpTrafficRecord); err != nil {
		services.WriteJsonError(w, http.StatusInternalServerError, err)
		return
	}

	services.WriteJson(w, http.StatusCreated, map[string]string{"message": "Created successfully"})
}
