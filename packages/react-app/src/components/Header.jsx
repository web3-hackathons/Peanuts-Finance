import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/" /*target="_blank" rel="noopener noreferrer"*/>
      <PageHeader
        title="🏗 Peanuts Vault"
        subTitle="A simple, secure, and easy to use vault for your Peanuts"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
