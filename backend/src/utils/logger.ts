import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

// Cấu hình Elasticsearch Transport
const esTransportOptions = {
  level: 'info', // Ghi log từ mức info trở lên
  clientOpts: { node: 'http://elasticsearch-keep-your-goals:9200' }, // Elasticsearch URL từ Docker
  indexPrefix: 'nestjs-logs', // Prefix cho index log trên Elasticsearch
};

const esTransport = new ElasticsearchTransport(esTransportOptions);

// Tạo logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // Ghi log ra console
    esTransport, // Ghi log lên Elasticsearch
  ],
});
