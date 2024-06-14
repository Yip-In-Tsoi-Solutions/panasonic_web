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

    columnsData.push(col_data);
  }
  return columnsData;
};
export default schema;