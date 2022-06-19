import { useEffect, useState, useCallback, createContext, useContext, useMemo } from "react";
import * as React from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORK, NETWORKS } from "../constants";
import Portis from "@portis/web3";

const { ethers } = require("ethers");
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import humanizeDuration from "humanize-duration";

import WalletLink from "walletlink";

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});
/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
const localProviderUrl = targetNetwork.rpcUrl;
const DEBUG = true;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

const AccountContext = createContext();
export default function AccountProvider({ children }) {
  const [web3Modal, setWeb3Modal] = useState(
    new Web3Modal({
      network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
      cacheProvider: true, // optional
      theme: "light", // optional. Change to "dark" for a dark theme.
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            bridge: "https://polygon.bridge.walletconnect.org",
            infuraId: INFURA_ID,
            rpc: {
              1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
              42: `https://kovan.infura.io/v3/${INFURA_ID}`,
              100: "https://dai.poa.network", // xDai
            },
          },
        },
        portis: {
          display: {
            logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
            name: "Portis",
            description: "Connect to Portis App",
          },
          package: Portis,
          options: {
            id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
          },
        },
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: "pk_live_5A7C91B2FC585A17", // required
          },
        },
        "custom-walletlink": {
          display: {
            logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
            name: "Coinbase",
            description: "Connect to Coinbase Wallet (not Coinbase App)",
          },
          package: walletLinkProvider,
          connector: async (provider, _options) => {
            await provider.enable();
            return provider;
          },
        },
        authereum: {
          package: Authereum, // required
        },
      },
    }),
  );

  const [address, setAddress] = useState();

  const [injectedProvider, setInjectedProvider] = useState();

  const [scaffoldEthProvider, setSEP] = useState(
    navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null,
  );

  const [poktMainnetProvider, setPMP] = useState(
    navigator.onLine
      ? new ethers.providers.StaticJsonRpcProvider(
          "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
        )
      : null,
  );

  const mainnetProvider =
  poktMainnetProvider && poktMainnetProvider._isProvider
    ? poktMainnetProvider
    : scaffoldEthProvider && scaffoldEthProvider._network
    ? scaffoldEthProvider
    : mainnetInfura;

  const [mainnetInfura, setMI] = useState(
    navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID) : null,
  );

  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;
 
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  
  
  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);
  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();

    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };
  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useWeb3Account() {
  const context = React.useContext(AccountContext);
  if (!context) {
    throw new Error("To use `useWeb3Account`, component must be within a AccountContext");
  }
  return context;
}
