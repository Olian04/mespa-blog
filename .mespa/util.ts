import { join as joinPath } from 'path';

export const Path = {
  relativeToRoot: (...path: string[]) => joinPath(__dirname, '..', ...path),
  relativeToSelf: (...path: string[]) => joinPath(__dirname, ...path),
};
