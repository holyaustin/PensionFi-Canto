import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";
import MoralisLogin from "./moralisLogin.tsx";
import logo1 from "../assets/logowhite2.png";
import { shortenAddress } from "../utils/shortenAddress";

const coinbaseWalletSdk = coinbaseWalletModule();
const walletConnect = walletConnectModule();
const injected = injectedModule();

const modules = [coinbaseWalletSdk, walletConnect, injected];

const CANTO_MAINNET_RPC = "https://canto.slingshot.finance/";
const CANTO_TESTNET_RPC = "https://canto-testnet.plexnode.wtf";

const onboard = Onboard({
  wallets: modules, // created in previous step
  chains: [
    {
      id: "0x1e14",
      token: "Canto",
      namespace: "evm",
      label: "Canto Mainnet",
      rpcUrl: CANTO_MAINNET_RPC
    },
    {
      id: "0x1e15",
      token: "Canto",
      namespace: "evm",
      label: "Canto Testnet",
      rpcUrl: CANTO_TESTNET_RPC
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
  const navigate = useNavigate();
  const [account, setAccount] = useState();

  const connectWallet2 = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts, } = wallets[0];
      setAccount(accounts[0].address);
      navigate("/stake");
      console.log("Stake page to open");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-full justify-center items-center mx-10">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-7xl text-white py-1">
            P e n s i o n F i <br />
            R e t i r e   &nbsp; &nbsp; S m a r t <br />
            R e t i r e &nbsp; &nbsp;   W e l l<br /><br />
          </h1>
          <p className="text-4xl tex justify mt-2 text-white font-light md:w-2/3 w-11/12">
            Explore the world of web3 pension investment. Choose PensionFi to invest for retirement and watch your funds grow exponentially. Proudly partnering with Canto Blockchain.
          </p>
          <br />
          <button
            type="button"
            onClick={connectWallet2}
            className="w-2/3 flex flex-row justify-center items-center my-5 mb-12 bg-red-700 p-5 rounded-full cursor-pointer hover:bg-blue-700 hover:text-white"
          >

            <p className="text-white text-2xl font-semibold py-1 px-6 mx-14 hover:text-red-700">
              Launch dApp
            </p>
          </button>

          {/** <MoralisLogin /> */}
        </div>

        <div className="md:flex-[0.5] flex-initial justify-center items-center pr-20 mr-28">
          <a target="_blank" href="https://staging-global.transak.com/?apiKey=b2499ea6-aafd-4737-9c55-42c0501e8331" rel="noreferrer">
            <button className=" w-full flex flex-row h-20 text-2xl pl-10 pr-10 justify-center items-center my-5 bg-[#ffffff] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]" type="button">Buy Crypto with local currency</button>

          </a>
          <img src={logo1} alt="welcome" className="w-100 cursor-pointer mt-5 pt-5" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
