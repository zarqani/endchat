import { useEffect, useState } from "react";
import { Layout, Row, Result } from "antd";
import Sidebar from "components/Chat/Sidebar.js";
import Content from "components/Chat/Content.js";
import { withAuth } from "hooks/auth";

function ChatPage() {
  const [selectId, setSelectId] = useState(0);
  return (
    <Layout style={{ height: "100vh", backgroundColor: "#fff" }}>
      <Layout className="fill-workspace rounded shadow-sm overflow-hidden">
        <Sidebar setSelectId={setSelectId} />
        <Content selectId={selectId} />
        {/* <Row
          type="flex"
          align="middle"
          justify="center"
          className="px-3 bg-white mh-page"
          style={{
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Result
            icon={<img width="300" src="/logo-chat.png" />}
            title="Welcome to My Chat"
            subTitle="Enjoy That"
          />
        </Row> */}
      </Layout>
    </Layout>
  );
}

export default withAuth(ChatPage);
