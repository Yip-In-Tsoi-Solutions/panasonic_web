const convert_to_thai_year_dd_mm_yyyy = (dateString) => {
  // Convert the date string to a Date object
  let dateObject = new Date(dateString);

  // Get day, month, and year from the date object
  let day = dateObject.getDate();
  let month = dateObject.getMonth() + 1; // Month is zero-based, so add 1
  let year = dateObject.getFullYear();

  // Convert the year to Thai year
  let thaiYear = year + 543;
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  // Form the date in "dd-mm-yyyy" format
  let formattedDate = day + "/" + month + "/" + thaiYear;

  return formattedDate; // Output: "03-04-2567"
};
export default convert_to_thai_year_dd_mm_yyyy;
