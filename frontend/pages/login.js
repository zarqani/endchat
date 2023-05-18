import { useState, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import { setCookie } from "nookies";
import { Button, Form, Input, Typography, Row, Spin, Col } from "antd";
import { fetchSignin } from "api/auth";
import { appContext } from "providers/AppProvider";
import { withoutAuth } from "hooks/auth";
const FormItem = Form.Item;
const { Text } = Typography;

function LoginPage() {
  const { setUserInfo, setAuthenticated } = useContext(appContext);
  const [errorMsg, setErrorMsg] = useState("");

  async function onFinish(values) {
    const res = await fetchSignin({
      email: values.email,
      password: values.password,
    });

    if (res.status === 200) {
      setCookie(null, "token", res.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setUserInfo(res.data.user);
      setAuthenticated(res.data.token);
      Router.push("/");
    } else {
      setErrorMsg("Incorrect username or password. Try better!");
      setUserInfo(null);
      setAuthenticated(false);
    }
  }

  return (
    <>
      {/* spinning={initLoading} */}
      {/* <Spin> */}
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="px-3 bg-white mh-page"
        style={{ minHeight: "100vh" }}
      >
        <Col>
          <div className="text-center mb-5">
            <Link href="/signin">
              <span className="brand mr-0">
                {/* <Triangle size={32} strokeWidth={1} /> */}
                <img width="150" src="/logo-chat.png" />
              </span>
            </Link>
            <h5 className="mb-0 mt-3">Sign in</h5>

            <p className="text-muted">get started with our service</p>
          </div>
          <div className="mb-3">
            <Text type="danger">{errorMsg}</Text>
          </div>
          <Form layout="vertical" onFinish={onFinish}>
            <FormItem label="Email" name="email" rules={[{ required: true }]}>
              <Input type="text" placeholder="Email" />
            </FormItem>

            <FormItem
              label={
                <span>
                  <span>Password</span>
                  <span style={{ float: "right" }}>
                    <Link tabIndex={1000} href="/password-reset">
                      <span>Forgot password?</span>
                    </Link>
                  </span>
                </span>
              }
              name="password"
              rules={[{ required: true }]}
            >
              <Input type="password" placeholder="Password" />
            </FormItem>

            <FormItem>
              <Button
                // loading={signinLoading}
                type="primary"
                htmlType="submit"
                block
                className="mt-3"
              >
                Login
              </Button>
            </FormItem>

            <div className="text-center">
              <small className="text-muted">
                <span>Don't have an account yet?</span>{" "}
                <Link href="/signup">
                  <span>&nbsp; Create one now!</span>
                </Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
      {/* </Spin> */}
    </>
  );
}

export default withoutAuth(LoginPage);
