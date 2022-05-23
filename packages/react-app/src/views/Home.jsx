import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Col, Menu, Row } from "antd";
const { Title } = Typography;

import { useThemeSwitcher } from "react-css-theme-switcher";
import "./Home.scss";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  const { switcher, currentTheme, status, themes } = useThemeSwitcher();
  return (
    <>
      <div
        style={{
          backgroundImage: `url(/slightlyOrangeBackdrop.png)`,
          backgroundSize: "cover",
          backgroundPosition: "0 60%",
          height: "100%",
          width: "100%",
          position: "fixed",
          top: 0,
          zIndex: "-1",
        }}
      >
        <img src="/wakuWakuNoBackground.png" style={{
            height: "75%",
            position: "absolute",
            bottom: "0",
            left: "0",
            animationName: "float1"
        }}
          className="logos"
        />
        
        <img src="/peanutButterNoBackgroundLessAlpha.png" style={{
            height: "75%",
            position: "absolute",
            bottom: "0",
            right: "0",
            animationName: "float2"
        }}
          className="logos"
        />
      </div>

      <div
        style={{
          height: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          textAlign: "left",
        }}
      >
        <Title
          style={{
            borderBottom: "1px solid",
            fontFamily: "'Indie Flower', cursive",
            display: "inline-block",
            fontSize: `4rem`,
            margin: `0`,
          }}
        >
          Peanuts Finance
        </Title>
        <Title
          level={3}
          style={{
            margin: `8px 0`,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Dollar Cost Autocompounding for Da Normies
        </Title>
        <Link to="/app">
          <Button
            size="large"
            style={{
              backdropFilter: `blur(${10}px)`,
              backgroundColor: `rgba(255, 255, 255, 0.5)`,
              fontFamily: "'Montserrat', sans-serif",
              border:"none"
            }}
          >
            <span
              style={{
                marginRight: 8,
              }}
              role="img"
            >
              🥜
            </span>
            PEANUTS!
          </Button>
        </Link>
      </div>
    </>
  );
}

export default Home;
