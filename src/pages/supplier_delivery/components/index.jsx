import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table_withActions from '../../../components/table_withActions/components';
function Supplier_delivery() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const url = "http://localhost:8123/salesfact";
  const actionColumn = [
    {
      title: "ACTION",
      dataIndex: "",
      key: "x",
      render: (e) => (
        <div>
          <a className="mr-[10px]">Edit</a>
          <a onClick={()=> alert(e.UNITS)}>Delete</a>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table_withActions url={url} actionColumn={actionColumn}/>
    </div>
  );
}

export default Supplier_delivery;
