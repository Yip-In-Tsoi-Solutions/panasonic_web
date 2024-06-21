import moment from 'moment'; // Import moment.js for date formatting

const schema = (data) => {
  const columnsData = [];

  for (const item in data[0]) {
    let col_data = {
      title: String(item).toUpperCase(),
      dataIndex: item,
      key: item,
    };

    // Fix the first two columns
    if (columnsData.length < 4) {
      col_data.fixed = 'left';
    }

    // Custom date format for 'date' columns
    if (isDateColumn(item)) {
      col_data.render = (text) => moment(new Date(text)).format('YYYY-MM-DD');
    }

    // Format numeric columns (floats and integers), except for date and string columns
    if (!isDateColumn(item) && !isStringColumn(data, item) && isNumericColumn(data, item)) {
      col_data.render = (text) => formatNumericValue(text);
      col_data.align = 'right'; // Align numeric values to the right
    }

    columnsData.push(col_data);
  }

  return columnsData;
};

// Function to check if the item represents a date column
const isDateColumn = (item) => {
  return item.toLowerCase().includes('date');
};

// Function to check if the item represents a string column
const isStringColumn = (data, item) => {
  // Check if all values in the column are strings
  return data.every(row => {
    const value = row[item];
    return typeof value === 'string';
  });
};

// Function to check if the item represents a numeric column (float or integer)
const isNumericColumn = (data, item) => {
  // Check if all values in the column are numeric (float or integer)
  return data.every(row => {
    const value = row[item];
    return !isNaN(parseFloat(value)) && isFinite(value);
  });
};

// Function to format numeric values with commas and decimal places
const formatNumericValue = (text) => {
  const num = parseFloat(text);
  if (isNaN(num)) return text; // Return original text if parsing fails

  // Check if it's a float (up to 3 decimal places) or an integer
  if (Number.isInteger(num)) {
    return num.toLocaleString('en-US');
  } else {
    return num.toLocaleString('en-US', { maximumFractionDigits: 3 });
  }
};

export default schema;
