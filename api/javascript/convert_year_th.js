const convert_year_th = (dateString) => {

  // Convert the string to a Date object
  const date = new Date(dateString);

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
