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
      col_data.render = (text) => moment(text).format('YYYY-MM-DD');
    }

    // Format float columns to 3 decimal places, except for date and integer columns
    if (!isDateColumn(item) && isFloatColumn(data, item)) {
      col_data.render = (text) => parseFloat(text).toFixed(3);
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

// Function to check if the item represents a float column
const isFloatColumn = (data, item) => {
  // Check if all values in the column can be parsed as floats (excluding integers)
  return data.every(row => {
    const value = row[item];
    return !isNaN(parseFloat(value)) && !Number.isInteger(parseFloat(value));
  });
};

export default schema;
