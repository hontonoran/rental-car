export function formatMileage(mileage: number) {
  return `${new Intl.NumberFormat("en-US").format(mileage).replace(/,/g, " ")} km`;
}

const dateLabelFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDateLabel(date: Date) {
  return dateLabelFormatter.format(date);
}

export function formatDateRange(from: Date, to: Date) {
  return `${formatDateLabel(from)} – ${formatDateLabel(to)}`;
}

export function startOfToday() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}
