export const getTilPostIdFromUrl = (url) =>
  url
    ? url.replace("https://", "").replaceAll("/", "-")
    : `NO_URL_IN_POST_${Math.random()}`;
