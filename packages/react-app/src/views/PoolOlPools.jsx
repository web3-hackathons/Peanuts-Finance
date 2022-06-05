import { Typography, PageHeader, Col, Row, Input, Button } from "antd";
const { Title } = Typography;
const { Search } = Input;
import { vaults, vaultImages, vaultName, vaultDeposited, vaultAddress, vaultTokenAddr } from "./Vaults";
import "./PoolOlPools.scss";
import { useWeb3Account } from "../contexts";

function PoolOlPools({ yourLocalBalance, readContracts }) {
  const {
    targetNetwork,
    address,
    userProviderAndSigner,
    userSigner,
    price,
    gasPrice,
    localChainId,
    selectedChainId,
    localProviderUrl,
    localProviderUrlFromEnv,
    localProvider,
    injectedProvider,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    scaffoldEthProvider,
    poktMainnetProvider,
    mainnetProvider,
    mainnetInfura,
    blockExplorer,
  } = useWeb3Account();

  console.log("targetNetwork");
  console.log(targetNetwork);

  const UpperLeftInfo = () => {
    let titleSize = 4;
    let spanSize = 6;
    return (
      <Row>
        <Col span={spanSize}>
          <Title level={titleSize}>Deposited</Title>
          <div>0</div>
        </Col>
        <Col span={spanSize}>
          <Title level={titleSize}>Monthly Yield</Title>
          <div>0</div>
        </Col>
        <Col span={spanSize}>
          <Title level={titleSize}>Daily Yield</Title>
          <div>0</div>
        </Col>
      </Row>
    );
  };

  const UpperRightSection = () => {
    let titleSize = 4;
    let spanSize = 6;
    return (
      <Row justify="end">
        <Col span={spanSize}>
          <Title level={titleSize}>TVL</Title>
          <div>0</div>
        </Col>
        <Col span={spanSize}>
          <Title level={titleSize}>Vaults</Title>
          <div>0</div>
        </Col>
        <Col span={spanSize}>
          <Title level={titleSize}>Daily Buyback</Title>
          <div>0</div>
        </Col>
      </Row>
    );
  };

  const onSearch = () => {};

  const mainSpanSize = 10;
  const subSpanSize = 2;
  const ListOlPools = () => {
    const VaultImages = ({ urls }) => {
      console.log("URLS: ");
      console.log(urls);
      console.log(urls.length);
      const imgSize = "48px"; //"64px"
      const individualLogoSize = "48px";
      let props = [];
      if (urls.length == 3) {
        let w = "58.3333%";
        let h = "58.3333%";
        props = [
          {
            url: urls[0],
            style: {
              top: "4.1667%",
              left: "0",
              zIndex: "3",
              position: "absolute",
              width: w,
              height: h,
            },
          },
          {
            url: urls[1],
            style: {
              top: "4.1667%",
              right: "0",
              zIndex: "1",
              position: "absolute",
              width: w,
              height: h,
            },
          },
          {
            url: urls[2],
            style: {
              left: "0",
              right: "0",
              bottom: "4.1667%",
              zIndex: "2",
              marginLeft: "auto",
              marginRight: "auto",
              position: "absolute",
              width: w,
              height: h,
            },
          },
        ];
      }
      console.log(props);
      return (
        <div style={{ width: imgSize, height: imgSize, position: "relative" }}>
          {props.map(obj => {
            return <img width={individualLogoSize} height={individualLogoSize} src={obj.url} style={obj.style} />;
          })}
        </div>
      );
    };
    console.log("vaults ==================");
    console.log(vaults);
    return (
      <div>
        {vaults.map((obj, idx) => {
          console.log(obj);
          return (
            <Row
              className="poolRow"
              key={idx.toString()}
              style={{
                borderBottom: "solid 1px #36B663",
                padding: "16px 0",
              }}
              align="middle"
            >
              <Col span={mainSpanSize}>
                <Row align="middle">
                  <Col>
                    <VaultImages urls={obj[vaultImages]} />
                  </Col>
                  <Col>{obj[vaultName]}</Col>
                </Row>
              </Col>
              <Col span={subSpanSize}>0</Col>
              <Col span={subSpanSize}>0</Col>
              <Col span={subSpanSize}>0</Col>
              <Col span={subSpanSize}>0</Col>
              <Col span={subSpanSize}>
                <Button shape="round" onClick={() => {
                    
                }}>MORE</Button>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          padding: "0px 16px",
        }}
      >
        <Row class="poolHeader">
          <Col
            span={12}
            class="poolHeader__subsection"
            style={{
              textAlign: "left",
            }}
          >
            {/* <PageHeader title="Your Peanuts" subTitle="(Portfolio)" /> */}

            <Title level={3}>Your Peanuts (Portfolio)</Title>
            <UpperLeftInfo />
          </Col>
          <Col
            span={12}
            class="poolHeader__subsection"
            style={{
              textAlign: "right",
            }}
          >
            {/* <PageHeader title="Platform" /> */}
            <Title level={3}>Platform</Title>
            <UpperRightSection />
          </Col>
        </Row>
        {/* <Row>
                    {targetNetwork}
                </Row> */}
      </div>
      <div>{targetNetwork.rpcUrl}</div>
      <div
        class="poolOlPools"
        style={{
          background: "rgba(255,255,255,0.4)",
          height: "100%",
          padding: "32px",
          minHeight: "50vh",
        }}
      >
        <div
          style={{
            borderRadius: "8px",
          }}
        >
          <Row
            style={{
              borderBottom: "solid 2px #36B663",
              paddingBottom: "16px",
            }}
            align="middle"
          >
            <Col span={mainSpanSize}>
              <Search
                placeholder="Search..."
                onSearch={onSearch}
                style={{
                  width: 200,
                }}
              />
            </Col>
            <Col span={subSpanSize}>Deposited</Col>
            <Col span={subSpanSize}>APY</Col>
            <Col span={subSpanSize}>DAILY</Col>
            <Col span={subSpanSize}>TVL</Col>
          </Row>
          <ListOlPools />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "-5%",
          right: "-5%",
          height: "70%",
          zIndex: "-1",
        }}
      >
        <img
          src="/smugOnlyNoBackHigherGamma.png"
          style={{
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default PoolOlPools;
