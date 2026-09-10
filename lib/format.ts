export function formatMileage(mileage: number) {
  return `${new Intl.NumberFormat("en-US").format(mileage).replace(/,/g, " ")} km`;
}
