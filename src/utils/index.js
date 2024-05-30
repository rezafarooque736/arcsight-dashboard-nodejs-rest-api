// convert to local date time
export const convertToLocalDateTime = (time) => {
  return new Date(time).toLocaleString();
};

// calculate average percentage
export function calculateAvgPct(value, avg) {
  if (avg === 0) return "0";
  const pct = (((value - avg) / avg) * 100).toFixed(1);
  return pct > 0 ? `+${pct}` : pct;
}
