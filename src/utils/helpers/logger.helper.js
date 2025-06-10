'use server';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const combineFileTransport = new DailyRotateFile({
  dirname: 'log/requests',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
  ),
  handleRejections: true,
  defaultMeta: { service: 'frontend-requests' },
  transports: [combineFileTransport],
});

// Function to log with message deduplication
export async function log(levelLog, message, msgObj) {
  let logMessage;
  if (typeof message === 'object') {
    logMessage = JSON.stringify(message);
  } else if (Array.isArray(message)) {
    logMessage = JSON.stringify(message);
  } else {
    logMessage = message;
  }
  const logInfo = { message: logMessage, ...msgObj };
  logger.log({ level: levelLog, ...logInfo });
}
