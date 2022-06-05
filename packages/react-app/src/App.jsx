//import Torus from "@toruslabs/torus-embed"

import { Alert, Button, Col, Menu, Row, List } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { Account, Address, Balance, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
// import Hints from "./Hints";
import { ExampleUI, Hints, Subgraph, Home, PoolOlPools } from "./views";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";

import { useContractConfig } from "./hooks";

const { ethers } = require("ethers");
import { useContext } from "react";

import { useWeb3Account } from "./contexts";
const DEBUG = true;
const NETWORKCHECK = true;

function App() {
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
  
  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  const contractConfig = useContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  //keep track of contract balance to know how much has been staked total:
  const stakerContractBalance = useBalance(
    localProvider,
    readContracts && readContracts.Staker ? readContracts.Staker.address : null,
  );
  if (DEBUG) console.log("💵 stakerContractBalance", stakerContractBalance);

  // ** keep track of total 'threshold' needed of ETH
  const threshold = useContractReader(readContracts, "Staker", "threshold");
  console.log("💵 threshold:", threshold);

  // ** keep track of a variable from the contract in the local React state:
  const balanceStaked = useContractReader(readContracts, "Staker", "balances", [address]);
  console.log("💸 balanceStaked:", balanceStaked);

  // ** 📟 Listen for broadcast events
  const stakeEvents = useEventListener(readContracts, "Staker", "Stake", localProvider, 1);
  console.log("📟 stake events:", stakeEvents);

  // ** keep track of a variable from the contract in the local React state:
  const timeLeft = useContractReader(readContracts, "Staker", "timeLeft");
  console.log("⏳ timeLeft:", timeLeft);

  // ** Listen for when the contract has been 'completed'
  const complete = useContractReader(readContracts, "ExampleExternalContract", "completed");
  console.log("✅ complete:", complete);

  const exampleExternalContractBalance = useBalance(
    localProvider,
    readContracts && readContracts.ExampleExternalContract ? readContracts.ExampleExternalContract.address : null,
  );
  if (DEBUG) console.log("💵 exampleExternalContractBalance", exampleExternalContractBalance);

  let completeDisplay = "";
  if (complete) {
    completeDisplay = (
      <div style={{ padding: 64, backgroundColor: "#eeffef", fontWeight: "bolder" }}>
        🚀 🎖 👩‍🚀 - Staking App triggered `ExampleExternalContract` -- 🎉 🍾 🎊
        <Balance balance={exampleExternalContractBalance} fontSize={64} /> ETH staked!
      </div>
    );
  }
  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("10"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* {networkDisplay} */}
      <BrowserRouter>
        <Header
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

        <Switch>
          <Route exact path="/">
            {completeDisplay}
            <Home yourLocalBalance={yourLocalBalance} readContracts={readContracts} />
          </Route>
          <Route path="/contracts">
            <Contract
              name="Staker"
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
            <Contract
              name="ExampleExternalContract"
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
          </Route>
          <Route path="/pools">
            <PoolOlPools></PoolOlPools>
          </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />
    </div>
  );
}

export default App;
