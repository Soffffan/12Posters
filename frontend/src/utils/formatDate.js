export default function formatDate(date) {
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}