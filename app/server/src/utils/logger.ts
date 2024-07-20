import pino, { type Logger } from "pino";
import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import pinoHttp from "pino-http";

const logDirectory = "./logs";
const logFilePath = path.join(logDirectory, "app.log");
const httpLogFilePath = path.join(logDirectory, "http.log");

if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory, { recursive: true });
}

export const logger: Logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    // @ts-ignore
    time: (timestamp: Date) => ({
      time: new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    }),
  },
  transport: {
    targets: [
      { target: "pino/file", options: { destination: logFilePath } },
      { target: "pino-pretty", options: { colorize: true } },
    ],
  },
});

export const httpLogger = pinoHttp({
  logger: pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      // @ts-ignore
      time: (timestamp: Date) => ({
        time: new Date(timestamp).toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      }),
    },
    transport: {
      targets: [
        { target: "pino/file", options: { destination: httpLogFilePath } },
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            messageFormat: "{msg} [{req.method} {req.url}]",
          },
        },
      ],
    },
  }),
  serializers: {
    req: (req: IncomingMessage) => ({
      method: req.method,
      url: req.url,
    }),
    res: (res: ServerResponse) => ({
      statusCode: res.statusCode,
    }),
  },
  // autoLogging: {
  //   ignore: (req) => req.url === "/health", // Ignore health check routes
  // },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    }
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage: (req, res) => {
    if (res.statusCode === 404) {
      return "Resource not found";
    }
    return `${req.method} completed`;
  },
  customErrorMessage: (req, res, err) =>
    `${req.method} errored with status code: ${res.statusCode}`,
});
