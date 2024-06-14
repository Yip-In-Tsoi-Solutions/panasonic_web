import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../actions/tokenSlice";
import { useForm } from "antd/es/form/Form";
const url =
  window.location.protocol + "//" + window.location.hostname + ":9000";
const LoginPage = () => {
  const dispatch = useDispatch();
  //const token = useSelector((state)=> state?.token?.token);
  const [form] = useForm();
  const [userLogin, setUserLogin] = useState("");
  const [checkAuth, setCheckAuth] = useState("");
  const submitLogIn = async () => {
    //userLogin
    try {
      const payload = {
        employee_id: userLogin,
      };
      const response = await axios.post(`${url}/api/auth/user/login`, payload);
      if (response.status === 200) {
        sessionStorage.setItem("token_session", response.data?.token);
      }
      const reply_token = await axios.get(
        `${url}/api/auth/user/login/getUser`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token_session")}`,
          },
        }
      );
      if (reply_token.status === 200) {
        const status = reply_token.data;
        if (status?.user_status === "true") {
          form.resetFields();
          setUserLogin("");
          setCheckAuth(status?.user_status);
        } else {
          setCheckAuth(...checkAuth);
        }
      }
    } catch (error) {
      if (error) {
        console.log(`message is ${error}`);
      }
    }
  };
  if (checkAuth === "true") {
    window.location.href = '/home'
  } else {
    console.log("not found user");
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto w-full"
            src={"/Panasonic_ENERGY_Logo.jpg"}
          />
          <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 uppercase">
            LOGIN TO SYSTEM
          </h2>
        </div>
        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form form={form} onFinish={submitLogIn} className="space-y-6">
            <Form.Item name={"username"}>
              <div className="mt-2">
                <Input
                  id="email"
                  type="username"
                  autoComplete="username"
                  placeholder="PETCH EMPLOYEE ID"
                  onChange={(e) => setUserLogin(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-[10px]"
                />
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                disabled={userLogin !== "" ? false : true}
                htmlType="submit"
                style={{
                  backgroundColor: `${userLogin !== "" ? "#045a4e" : "#ccc"}`,
                }}
                className={`cursor-pointer flex w-full justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#045a4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#045a4e] uppercase`}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
