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

    // Check if the column is not a string or date
    if (typeof data[0][item] !== 'string' && !(data[0][item] instanceof Date)) {
      // Check if the column is a number (integer or float)
      if (typeof data[0][item] === 'number') {
        col_data.render = (text) => {
          // Check if it's a float
          if (Number.isInteger(text)) {
            return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            return parseFloat(text).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        };
      }
    }

    // Check if the column dataIndex ends with '_DATE' for datetime columns
    if (item.toUpperCase().endsWith('_DATE')) {
      col_data.render = (text) => text ? moment(text).format('YYYY-MM-DD') : '';
    }

    columnsData.push(col_data);
  }

  return columnsData;
};

export default schema;
