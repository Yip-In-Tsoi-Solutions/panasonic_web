import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setColumns,
  setData,
} from "../../../pages/powerbi_report/actions/tableSlice";

const Table_withActions = (props) => {
  const disPatch = useDispatch();
  const table = useSelector((state)=> state.table_data);
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

  const actionColumn = [
    {
      title: "ACTION",
      dataIndex: "",
      key: "x",
      render: () => (
        <div>
          <a className="mr-[10px]">Edit</a>
          <a>Delete</a>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={table.dataSource} columns={[...table.columns, ...actionColumn]} />
    </>
  );
};

export default Table_withActions;
