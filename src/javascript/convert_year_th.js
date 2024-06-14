const convert_year_th = (dateString) => {
  // Parse the input date string
  const [day, month, year] = dateString.split("/").map(Number);

  // Create a Date object
  const date = new Date(year, month - 1, day);

  // Convert Gregorian year to Buddhist calendar year
  const buddhistYear = year + 543;

  // Format the date in '2567-03-01 00:00:00.000' format
  const formattedDate = `${buddhistYear}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")} 00:00:00.000`;

  return formattedDate
};
export default convert_year_th;
