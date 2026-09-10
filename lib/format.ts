/** "9 582 km" — the mock-up separates thousands with a space, not a comma. */
export function formatMileage(mileage: number) {
  return `${new Intl.NumberFormat("en-US").format(mileage).replace(/,/g, " ")} km`;
}
