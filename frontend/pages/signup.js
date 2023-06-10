import { useState, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import { withoutAuth } from "hooks/auth";
import { Button, Form, Input, Typography, Row, Spin, Col } from "antd";
import { fetchSignup } from "api/auth";
import { appContext } from "providers/AppProvider";
const FormItem = Form.Item;
const { Text } = Typography;

function SignupPage() {
  const { setUserInfo, setAuthenticated } = useContext(appContext);
  const [errorMsg, setErrorMsg] = useState("");

  async function onFinish(values) {
    const data = {
      email: values.email,
      password: values.password,
      lastname: values.lastname,
      firstname: values.firstname,
    };

    if (data.password !== values.rpassword) {
      setErrorMsg(`The passwords don't match`);
      return;
    }

    const res = await fetchSignup(data);

    if (res.status === 201) {
      Router.push("/login");
    } else {
      setErrorMsg(await res.text());
    }
  }

  return (
    <>
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="px-3 bg-white"
        // style={{ minHeight: "100vh" }}
      >
        <Col>
          <div className="text-center mb-5">
            <Link href="/signup">
              <span className="brand mr-0">
                {/* <Triangle size={32} strokeWidth={1} /> */}
                <img width="150" src="/logo-chat.png" alt="logo" />
              </span>
            </Link>
            <h5 className="mb-0 mt-3">Sign up</h5>

            <p className="text-muted">Create an account</p>
          </div>

          {/* Display errors  */}
          <div className="mb-3">
            <Text type="danger">{errorMsg}</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item style={{ marginBottom: 0 }}>
              <FormItem
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                }}
                label="First Name"
                name="firstname"
              >
                <Input placeholder="First Name" />
              </FormItem>
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  textAlign: "center",
                }}
              ></span>
              <FormItem
                style={{
                  display: "inline-block",
                  width: "calc(50% - 12px)",
                }}
                label="Last Name"
                name="lastname"
              >
                <Input placeholder="Last Name" />
              </FormItem>
            </Form.Item>
            <FormItem label="Email" name="email">
              <Input type="email" placeholder="Email" />
            </FormItem>

            <FormItem label="Password" name="password">
              <Input type="password" placeholder="Password" />
            </FormItem>

            <FormItem label="Confirm password" name="rpassword">
              <Input type="password" placeholder="Confirm password" />
            </FormItem>

            <FormItem>
              <Button
                // loading={signupLoading}
                type="primary"
                htmlType="submit"
                block
              >
                Sign up
              </Button>
            </FormItem>

            <div className="text-center">
              <small className="text-muted">
                <span>Already have an account?</span>{" "}
                <Link href="/signin">
                  <span>&nbsp;Login Now</span>
                </Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default withoutAuth(SignupPage);
