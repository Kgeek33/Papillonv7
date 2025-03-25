export const formatHoursMinutes = (timestamp: number) => {
  const LAdate = new Date(timestamp);
  const heures = LAdate.getUTCHours().toString().padStart(2, "0");
  const minutes = LAdate.getUTCMinutes().toString().padStart(2, "0");

  return `${heures}:${minutes}`;
};
