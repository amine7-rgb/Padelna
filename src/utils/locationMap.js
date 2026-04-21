export const getMapEmbedSrc = (location) => {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return "";
  }

  const delta = 0.015;
  const left = longitude - delta;
  const bottom = latitude - delta;
  const right = longitude + delta;
  const top = latitude + delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
};
