export const formatPace = (pace) => {
  if (!isFinite(pace) || pace <= 0) {
    return "--:--";
  }

  const mins = Math.floor(pace);
  const secs = Math.round((pace - mins) * 60);

  return `${mins}:${secs
    .toString()
    .padStart(2, "0")} min/km`;
};