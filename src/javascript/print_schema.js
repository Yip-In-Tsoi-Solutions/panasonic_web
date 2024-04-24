const schema = (data) => {
  const columnsData = [];
  for (const item in data[0]) {
    let col_data = {
      title: String(item).toUpperCase(),
      dataIndex: item,
      key: item,
    };
    columnsData.push(col_data);
  }
  return columnsData;
};
export default schema;
