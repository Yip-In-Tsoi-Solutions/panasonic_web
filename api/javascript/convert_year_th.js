const convert_year_th = (dateString) => {
  // Given date string
  const dateStr = "2567-06-19T00:00:00.000Z";

  // Convert the string to a Date object
  const date = new Date(dateStr);

  // Subtract 5 days
  date.setDate(date.getDate() - 5);

  // Format the new date to the desired string format "YYYY-MM-DD"
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");

  const newDateStr = `${year}-${month}-${day}`;
  return newDateStr
};
module.exports = convert_year_th;
