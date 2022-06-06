const UUIDV4regex =
  // eslint-disable-next-line max-len
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export const checkUUIDv4 = (uuid: string) => {
  return UUIDV4regex.test(uuid);
};
