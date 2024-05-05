import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import MoralisLogin from "./moralisLogin.tsx";
import Onboard from "@web3-onboard/core";
import logo1 from "../assets/logowhite2.png";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const coinbaseWalletSdk = coinbaseWalletModule();
const walletConnect = walletConnectModule();
const injected = injectedModule();

const modules = [coinbaseWalletSdk, walletConnect, injected];

const CANTO_RPC_URL = "https://canto-testnet.plexnode.wtf";

const onboard = Onboard({
  wallets: modules, // created in previous step
  chains: [
    {
      id: "0x7701",
      token: "Canto",
      namespace: "evm",
      label: "Canto Testnet",
      rpcUrl: CANTO_RPC_URL
    },

  ],
  appMetadata: {
    name: "PensionFi",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    description: "Web3 Pension Investment",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" }
    ]
  }
});

const Welcome = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  const [account, setAccount] = useState();

  const connectWallet2 = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts, } = wallets[0];
      setAccount(accounts[0].address);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-full justify-center items-center mx-10">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-7xl text-white py-1">
            PensionFi <br /> Retire Smart <br /> Retire Well<br /><br />
          </h1>
          <p className="text-4xl text-justify mt-2 text-white font-light md:w-9/12 w-11/12">
            Explore the world of web3 pension investment. Choose where to invest and see you retirement fund grow. Constantly contribute towards your retirement get lots of benefits
          </p>
          <br />
          <MoralisLogin />
        </div>

        <div className="md:flex-[0.5] flex-initial justify-center items-center">
          <a target="_blank" href="https://staging-global.transak.com/?apiKey=b2499ea6-aafd-4737-9c55-42c0501e8331" rel="noreferrer">
            <button className="flex flex-row h-20 text-2xl pl-10 pr-10 justify-center items-center my-5 bg-[#ffffff] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]" type="button">Buy Crypto with local currency</button>

          </a>
          <img src={logo1} alt="welcome" className="w-100 cursor-pointer mt-5 pt-5" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
