const convert_inter_year = (buddhistDateString) => {
  // Example input: '2567-01-31 00:00:00.000'
  // Extract date and time parts
  const [datePart] = buddhistDateString.split(' ');

  // Split the date part into components
  const [buddhistYear, month, day] = datePart.split('-').map(Number);

  // Convert Buddhist year to Gregorian year
  const gregorianYear = buddhistYear - 543;

  // Format the Gregorian date as 'YYYY-MM-DD'
  const formattedDate = `${gregorianYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return formattedDate;
};

module.exports = convert_inter_year;