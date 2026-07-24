package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
)

func fieldErrorMessage(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "Campo obrigatório"
	case "uuid7":
		return "Deve ser um UUID válido"
	case "oneof":
		return fmt.Sprintf("Deve ser um dos valores: %s", fe.Param())
	case "gte":
		return fmt.Sprintf("Deve ser maior ou igual a %s", fe.Param())
	default:
		return fe.Error()
	}
}

func WriteJsonError(w http.ResponseWriter, status int, err error) {
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(status)

	if validationErrs, ok := errors.AsType[validator.ValidationErrors](err); ok {
		errs := make(map[string]string)

		for _, fe := range validationErrs {
			key := strings.ToLower(fe.Field()[:1]) + fe.Field()[1:]
			errs[key] = fieldErrorMessage(fe)
		}

		json.NewEncoder(w).Encode(errs)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
}
