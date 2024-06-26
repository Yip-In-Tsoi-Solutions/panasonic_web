import moment from "moment";

const schema = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const columnsData = [];

  for (const item in data[0]) {
    let col_data = {
      title: String(item).toUpperCase(),
      dataIndex: item,
      key: item,
    };

    // Fix the first 4 columns
    if (columnsData.length < 4) {
      col_data.fixed = 'left';
    }

    // Check if the column dataIndex ends with '_DATE' for datetime columns
    if (item.toUpperCase().endsWith('_DATE')) {
      col_data.render = (text) => moment(text).format('YYYY-MM-DD');
    }

    // Check if the column is numeric (integer or float) but not a date or string
    if (isNumericColumn(item, data)) {
      col_data.render = (text) => addCommasToNumber(text);
    }

    columnsData.push(col_data);
  }

  return columnsData;
};

// Helper function to check if column is numeric (integer or float)
function isNumericColumn(column, data) {
  const firstRow = data[0];
  const value = firstRow[column];

  // Check if the value is numeric and not a string or date
  return !isNaN(value) && typeof value !== 'string' && !moment(value, 'YYYY-MM-DD', true).isValid();
}

// Helper function to add commas to numbers
function addCommasToNumber(text) {
  // Convert text to number, add commas, and return as string
  const number = parseFloat(text);
  if (isNaN(number)) return text; // Return original text if not a valid number

  return number.toLocaleString(); // Add commas to number
}

export default schema;
