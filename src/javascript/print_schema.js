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
    if (isDateColumn(item)) { // Assuming isDateColumn is a function to check if the item is a date
      col_data.render = (text) => moment(text).format('YYYY-MM-DD'); // Customize the date format here
    }

    columnsData.push(col_data);
  }

  return columnsData;
};

// Function to check if the item is a date (example)
const isDateColumn = (item) => {
  return item.toLowerCase().includes('date'); // Example check based on column naming convention
};
export default schema;