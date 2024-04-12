import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, DatePicker } from "antd";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
function Buyer_Reason() {
  const [form] = useForm();
  // date formato f date start & date end
  const dateFormat = "DD/MM/YYYY";
  const dispatch = useDispatch();

  async function fetchCompanies(open) {
    // const response = await axios.get(companiesAPI_URL);
    // response.status === 200
    //   ? setCompanies(response?.data)
    //   : setCompanies(...selected_companies);
  }

  useMemo(() => {
    fetchCompanies();
  }, []);
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 float-left">Buyer reason</h1>
        <div className="grid grid-cols-3 gap-3 clear-both">
          <Form form={form}>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              Promise DATE FROM
            </label>
            <DatePicker
              type="date"
              format={dateFormat}
              className="w-full"
              // value={
              //   promise_start_date !== ""
              //     ? moment(promise_start_date, dateFormat)
              //     : ""
              // }
              // onChange={handlePromiseStartDate}
            />
          </Form>
          <Form form={form}>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              Promise DATE TO
            </label>
            <DatePicker
              type="date"
              format={dateFormat}
              className="w-full"
              // value={
              //   promise_end_date !== ""
              //     ? moment(promise_end_date, dateFormat)
              //     : ""
              // }
              // onChange={handlePromisetoDate}
            />
          </Form>
          <Form>
            <Button
              type="button"
              className="float-left mt-7 ml-5 bg-[white] text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-[black]"
            >
              clear filter
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Buyer_Reason;
