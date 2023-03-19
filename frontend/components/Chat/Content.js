import { useState, useEffect, useContext } from "react";
import { Card, Button, Form, Input } from "antd";

import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { getGroupMessages, addMessage } from "api/chat";
import { appContext } from "providers/AppProvider";

export default function Sidebar(props) {
  const { selectId } = props;
  const { userInfo } = useContext(appContext);
  const [form] = Form.useForm();
  const [message, setMessage] = useState(null);

  const isUser = (item) => Number(item.sender) === Number(userInfo?.id);

  const fetchData = async () => {
    if (selectId)
      getGroupMessages(selectId).then((res) => {
        if (res.data) setMessage([...res.data]);
      });
  };

  async function onFinish(values) {
    addMessage({
      conversationType: "ChatGroup",
      message: values.message,
      receiver: selectId,
      type: "text",
    }).then((res) => {
      if (res.data) setMessage([...message, res.data]);
      form.resetFields();
    });
  }

  useEffect(() => {
    fetchData();
  }, [selectId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        justifyContent: "center",
        display: "flex",
        flexFlow: "row wrap",
        // display: "flex",
        // flex: "1",
        // flexDirection: "column",
        // backgroundColor: "#fff",
        // height: "100%",
        // width: "100%",
      }}
    >
      <div className="message">
        <div className="message-header">
          <h4 className="message-title">
            {" "}
            Invitation: Joe's Dinner @ Fri Aug 22{" "}
          </h4>
        </div>
        <div className="message-body">
          <Card>
            <ul className="conversation-list">
              {message?.length > 0
                ? message.map((item) => (
                    <li
                      key={item.id}
                      className={
                        !isUser(item)
                          ? "conversation-inbound"
                          : "conversation-outbound"
                      }
                    >
                      {!isUser(item) && (
                        <div className="conversation-avatar">
                          <a href="#" className="tile">
                            <UserOutlined />
                          </a>
                        </div>
                      )}
                      <div className="conversation-message">
                        <div className="conversation-message-text">
                          {item.message}
                        </div>
                      </div>
                    </li>
                  ))
                : " not message"}
              {/* <li className="conversation-inbound conversation-faux">
                <div className="conversation-message conversation-message-skip-avatar">
                  <div className="conversation-message-text">
                    Laboriosam asperiores cupiditate aperiam!
                  </div>
                  <div className="conversation-meta"> Diane Peters · 20m </div>
                </div>
              </li> */}
            </ul>
          </Card>
        </div>

        <div className="message-publisher">
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <div className="media-body">
              <Form.Item name="message" rules={[{ required: true }]}>
                <Input
                  name="message"
                  type="text"
                  placeholder="Type a message"
                />
              </Form.Item>
              <Button type="link" htmlType="submit" block className="mt-3">
                <SendOutlined />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
