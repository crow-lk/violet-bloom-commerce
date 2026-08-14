const SRI_LANKA_TIME_ZONE = "Asia/Colombo";

const sriLankaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SRI_LANKA_TIME_ZONE,
  weekday: "long",
  hour: "2-digit",
  hourCycle: "h23",
});

export function isFridayClosureTime(date = new Date()) {
  const parts = sriLankaTimeFormatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);

  return weekday === "Friday" && hour >= 12 && hour < 14;
}
