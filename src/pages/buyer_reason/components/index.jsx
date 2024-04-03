import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table_withActions from "../../../components/table_withActions/components";
import SearchWithIcon from "../../../components/search_with_icon/components";
import { Button, Drawer, Form, Select, Layout, Input } from "antd";
import axios from "axios";

function Buyer_Reason() {
  const { Header } = Layout;
  const { TextArea } = Input;
  const count = useSelector((state) => state.counter);
  const [selected_companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const salesfactAPI_URL = "http://localhost:8123/salesfact";
  const companiesAPI_URL = "http://localhost:8123/companies";

  async function fetchCompanies(open) {
    const response = await axios.get(companiesAPI_URL);
    response.status === 200
      ? setCompanies(response?.data)
      : setCompanies(...selected_companies);
  }

  useMemo(() => {
    fetchCompanies();
  }, []);

  // action column
  const actionColumn = [
    {
      title: "Buyer Reason".toUpperCase(),
      dataIndex: "",
      key: "reason",
      render: (e) => (
        <div>
          <p>hello</p>
        </div>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "",
      key: "action",
      render: (e) => (
        <div className="flex flex-row" onClick={showDrawer.bind(this, e)}>
          <a className="mr-[20px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </a>
        </div>
      ),
    },
  ];

  // Drawer
  const showDrawer = (e) => {
    setOpen(true);
    console.log(e)
  };

  const onClose = () => {
    setOpen(false);
  };
  // Update Reason form
  const updateReason = () => {};
  return (
    <div>
      <Header
        style={{
          padding: 0,
          background: "white",
        }}
      >
        <div className="flex p-10 pt-[20px]">
          <SearchWithIcon />
          <Button
            type="button"
            className="w-[160px] h-10 mt-5 bg-[#006254] text-[white] font-bold uppercase"
            onClick={showDrawer}
          >
            Add Reason +
          </Button>
        </div>
      </Header>
      <div className="clear-both my-10">
        <Drawer
          title={
            <>
              <div className="uppercase">Buyer REASON</div>
            </>
          }
          onClose={onClose}
          open={open}
        >
          <Form onFinish={updateReason}>
            <Form.Item>
              <h1 className="font-bold">Supplier</h1>
              <Select
                placeholder="Supplier"
                options={selected_companies}
                className="rounded-lg"
              />
            </Form.Item>
            <Form.Item>
              <textarea
                rows="4"
                class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your reason"
              ></textarea>
            </Form.Item>
            <Form.Item>
              <Button
                type="button"
                className="w-[160px] h-10 bg-[#006254] text-[white] font-bold uppercase"
              >
                Add Reason +
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <h1 className="text-2xl font-bold p-3">Supplier List</h1>
        <Table_withActions url={salesfactAPI_URL} actionColumn={actionColumn} />
      </div>
    </div>
  );
}

export default Buyer_Reason;
