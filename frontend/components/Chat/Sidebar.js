import { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from "next/link";
import { destroyCookie } from "nookies";
import {
  Input,
  Layout,
  Menu,
  Row,
  Button,
  Dropdown,
  Tooltip,
  Avatar,
  Card,
} from "antd";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { getAllChatgroup } from "api/chat";
import { appContext } from "providers/AppProvider";
import { socketDisconnect } from "socket/socket";

const { Sider, Header } = Layout;
const { Meta } = Card;

export default function Sidebar({ setSelectId }) {
  const { userInfo } = useContext(appContext);
  const [listChatGroup, setListChatGroup] = useState(null);
  const fetchData = async () => {
    getAllChatgroup().then((res) => {
      if (res.data.length) {
        setListChatGroup([...res.data]);
        setSelectId(res.data[0].id);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menu = (
    <Menu style={{ width: "150px" }}>
      {userInfo && (
        <Menu.Item key="0">
          <Link href={`/user/${userInfo.id}/update`}>Update info</Link>
        </Menu.Item>
      )}
      {userInfo && (
        <Menu.Item key="1">
          <Link href={`/user/${userInfo.id}/update-password`}>
            Change password
          </Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          destroyCookie(null, "token", {
            path: "/",
          });
          socketDisconnect();
          Router.push("/login");
        }}
      >
        <span>Sign out</span>
      </Menu.Item>
    </Menu>
  );

  const userInfoBox = (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.3rem 1.5rem",
        zIndex: "1",
        boxShadow: "0 2px 2px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(0, 0, 0, 0.02)",
        height: "auto",
        lineHeight: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Row type="flex" align="middle">
        <Avatar
          shape="circle"
          size={40}
          icon={<UserOutlined />}
          record={userInfo ? userInfo : null}
        />
        {/* <AvatarCus record={userInfo ? userInfo : null} /> */}
        <span className="ml-3" style={{ lineHeight: "1" }}>
          <span style={{ display: "block" }}>
            {userInfo ? `${userInfo?.firstname} ${userInfo?.lastname}` : ""}
          </span>
          {/* <small className="text-muted">
                            <span>Online</span>
                        </small> */}
        </span>
      </Row>
      <span className="mr-auto" />
      <div>
        <Tooltip title="Settings">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              className="ant-dropdown-link"
              style={{ border: "0" }}
              shape="circle"
            >
              <SettingOutlined />
            </Button>
          </Dropdown>
        </Tooltip>
      </div>
    </Header>
  );

  return (
    <Sider
      width={300}
      //   width={
      //     isMobileDevice && leftSidebarVisible
      //       ? "100vw"
      //       : isMobileDevice && !leftSidebarVisible
      //       ? "0"
      //       : "300"
      //   }
    >
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          backgroundColor: "#fff",
          height: "100%",
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        {userInfoBox}
        {listChatGroup?.length &&
          listChatGroup.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectId(item.id)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                cursor: "pointer",
                textAlign: "inherit",
              }}
            >
              <Card>
                <Meta
                  avatar={<Avatar src="/empty.jpg" />}
                  title={item.name}
                  // description="This is the description"
                />
              </Card>
            </button>
          ))}
      </div>
    </Sider>
  );
}
