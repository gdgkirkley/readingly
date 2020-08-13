export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
