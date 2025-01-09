import { appendFileSync, writeFileSync } from 'fs'

const logFilePath = 'log.txt'

writeFileSync(logFilePath, '');

export const logToFile = (...messages) => {
  const logMessage = messages.join(' ') + '\n';
  appendFileSync(logFilePath, logMessage);
}