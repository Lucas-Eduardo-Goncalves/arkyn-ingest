package services

import (
	"context"
	"time"

	"github.com/segmentio/kafka-go"
)

type Producer struct {
	writer *kafka.Writer
}

func NewProducer(brokers []string, topic string) *Producer {
	writer := &kafka.Writer{
		Addr:         kafka.TCP(brokers...),
		Topic:        topic,
		Balancer:     &kafka.LeastBytes{},
		RequiredAcks: kafka.RequireAll,
		WriteTimeout: 10 * time.Second,
	}

	return &Producer{writer: writer}
}

func (p *Producer) SendMessage(ctx context.Context, message string) error {
	return p.writer.WriteMessages(ctx, kafka.Message{Value: []byte(message)})
}

func (p *Producer) Close() error {
	return p.writer.Close()
}
