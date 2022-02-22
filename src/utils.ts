import { createWriteStream, ReadStream } from 'fs';

export const createFileFromReadStream = (
  readStream: ReadStream,
  filePath: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    readStream
      .pipe(createWriteStream(filePath))
      .on('finish', () => {
        return resolve(true);
      })
      .on('error', (err) => reject(err));
  });
};

export const capitalizeFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const capitalizePhrase = (value) => {
  return value.split(' ').map(capitalizeFirstLetter).join(' ');
};
