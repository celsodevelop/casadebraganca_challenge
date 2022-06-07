import { validate, version } from 'uuid';

export const checkUUIDv4 = (uuid: string) => {
  if (typeof uuid !== 'string') {
    return false;
  }
  return validate(uuid) && version(uuid) === 4;
};
