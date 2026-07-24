package entities

import (
	"time"

	"github.com/Lucas-Eduardo-Goncalves/arkyn-ingest/internal/main/templates"
)

type HttpTrafficRecord struct {
	DomainUrl       string               `json:"domainUrl"`
	PathnameUrl     string               `json:"pathnameUrl"`
	TrafficSourceId string               `json:"trafficSourceId"`
	Status          int                  `json:"status"`
	Protocol        templates.Protocol   `json:"protocol"`
	Method          templates.HttpMethod `json:"method"`
	TrafficUserId   string               `json:"trafficUserId"`
	RequestHeaders  string               `json:"requestHeaders"`
	RequestBody     string               `json:"requestBody"`
	QueryParams     string               `json:"queryParams"`
	ResponseHeaders string               `json:"responseHeaders"`
	ResponseBody    string               `json:"responseBody"`
	ElapsedTime     float64              `json:"elapsedTime"`
	Token           string               `json:"token"`
	CreatedAt       string               `json:"createdAt"`
}

type NewHttpTrafficRecordInput struct {
	DomainUrl       string               `validate:"required"`
	PathnameUrl     string               `validate:"required"`
	TrafficSourceId string               `validate:"required,uuid"`
	Status          int                  `validate:"required"`
	Protocol        templates.Protocol   `validate:"required,oneof=http https"`
	Method          templates.HttpMethod `validate:"required,oneof=GET POST PUT DELETE PATCH"`
	TrafficUserId   string               `validate:"omitempty"`
	RequestHeaders  string               `validate:"required"`
	RequestBody     string               `validate:"required"`
	QueryParams     string               `validate:"required"`
	ResponseHeaders string               `validate:"required"`
	ResponseBody    string               `validate:"required"`
	ElapsedTime     float64              `validate:"gte=0"`
	Token           string               `validate:"required"`
}

func NewHttpTrafficRecord(input NewHttpTrafficRecordInput) HttpTrafficRecord {
	return HttpTrafficRecord{
		DomainUrl:       input.DomainUrl,
		PathnameUrl:     input.PathnameUrl,
		TrafficSourceId: input.TrafficSourceId,
		Status:          input.Status,
		Protocol:        input.Protocol,
		Method:          input.Method,
		TrafficUserId:   input.TrafficUserId,
		RequestHeaders:  input.RequestHeaders,
		RequestBody:     input.RequestBody,
		QueryParams:     input.QueryParams,
		ResponseHeaders: input.ResponseHeaders,
		ResponseBody:    input.ResponseBody,
		ElapsedTime:     input.ElapsedTime,
		Token:           input.Token,
		CreatedAt:       time.Now().String(),
	}
}
