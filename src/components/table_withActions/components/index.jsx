import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setColumns, setData } from "../actions/tableActionSlice";
import axios from "axios";
const Table_withActions = (props) => {
  const disPatch = useDispatch();
  const table = useSelector((state)=> state?.table_data);
  const fetchData = async () => {
    try {
      const response = await axios.get(props.url);
      if (response.status === 200) {
        disPatch(setData(response.data));

        // Create columns dynamically based on the fetched data
        const columnsData = [];
        for (const item in response.data[0]) {
          let col_data = {
            title: item,
            dataIndex: item,
            key: item,
          };
          columnsData.push(col_data);
        }
        // Update columns state
        disPatch(setColumns(columnsData));
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Table dataSource={table.dataSource} columns={table.columns.concat(props.actionColumn)} />
    </>
  );
};

export default Table_withActions;
