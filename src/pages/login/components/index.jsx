import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { setToken } from "../actions/tokenSlice";
import { useForm } from "antd/es/form/Form";
const url = `${window.location.protocol}//${window.location.hostname}:9000`;

const LoginPage = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [userLogin, setUserLogin] = useState("");
  const [checkAuth, setCheckAuth] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogIn = async () => {
    setLoading(true);
    try {
      const payload = {
        employee_id: userLogin,
      };

      const response = await axios.post(`${url}/api/auth/user/login`, payload);

      if (response.status === 200 && response.data?.token) {
        sessionStorage.setItem("token_session", response.data.token);
        dispatch(setToken(response.data.token));

        try {
          const reply_token = await axios.get(`${url}/api/auth/user/login/getUser`, {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          });

          if (reply_token.status === 200) {
            const status = reply_token.data;
            if (status?.user_status === "true") {
              form.resetFields();
              setUserLogin("");
              setCheckAuth(status?.user_status);
              message.success("Login successful!");
            } else {
              message.error("User not authorized.");
            }
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          message.error("Error verifying user status. Please try again.");
        }
      } else {
        message.error("Invalid login response. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        message.error(`Login failed: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // The request was made but no response was received
        message.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error("Error setting up the request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkAuth === "true") {
      window.location.href = '/home';
      sessionStorage.setItem('pageId', '1');
    }
  }, [checkAuth]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto w-full"
          src={"/Panasonic_ENERGY_Logo.jpg"}
          alt="Panasonic ENERGY Logo"
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
                type="text"
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
              disabled={!userLogin || loading}
              htmlType="submit"
              loading={loading}
              style={{
                backgroundColor: userLogin && !loading ? "#045a4e" : "#ccc",
              }}
              className="cursor-pointer flex w-full justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#045a4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#045a4e] uppercase"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;