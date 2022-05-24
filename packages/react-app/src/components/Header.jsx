import { Menu, PageHeader } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import React from "react";
import Account from "./Account";
// displays a page header

export default function Header({
  address,
  localProvider,
  userSigner,
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <a
        href="/"
        style={{
          display: "flex",
        }}
      >
        <img
          src="/proudPeanutNoBackground.png"
          style={{
            height: "80px",
            marginRight: "12px",
          }}
        />
        <PageHeader title="Peanuts.Finance" style={{ cursor: "pointer", marginLeft: "0" }} />
      </a>
      <div
        style={{
          display: "flex",
          padding: "0 16px",
          alignItems: "center",
        }}
      >
        <Menu
          style={{
            display: "flex",
            alignItems: "center",
            background: "none",
          }}
        >
          <Menu.Item>
            <GithubOutlined
              style={{
                fontSize: "2em",
                verticalAlign: "center"
              }}
            />
          </Menu.Item>
          <Menu.Item>Learn more</Menu.Item>
        </Menu>
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
      </div>
    </div>
  );
}
