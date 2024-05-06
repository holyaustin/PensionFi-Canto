import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import artifacts from "../artifacts/contracts/PensionFi.sol/PensionFi.json";
import { toEther, toWei } from "../helpers/helpers";
import Header from "./Header";
import "./stake.css";
import Modal from "./Modal";
import StakeTable from "./StakeTable";
import StakeContainer from "./StakeContainer";

const CONTRACT_ADDRESS = "0x8D36089AB6eFdB3FEb2D8Ed42F7eC80f3c6d2b11";

function Stake() {
  // General frontend variables
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState();
  // Instance of the contract in the frontend
  const [contract, setContract] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState();

  // Related to user Positions
  // Positions will be called Assets in the frontend
  const [assetIds, setAssetIds] = useState([]);
  // Positions of the users that will be displayed if they are present
  const [assets, setAssets] = useState([]);

  // Staking variables
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakingLength, setStakingLength] = useState(undefined);
  const [stakingPercent, setStakingPercent] = useState(undefined);
  // Amount of Ether a user wants to stake
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const onLoad = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider2 = new ethers.providers.Web3Provider(connection);

      // const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider2);
      console.log("Provider connected is", provider2);
      provider2.send("eth_requestAccounts", []);
      const signers = provider2.getSigner();
      const signerAddress2 = await signers.getAddress();
      console.log("Address connected is", signerAddress2);
      setSigner(signerAddress2);
      setSignerAddress(signerAddress2);
      const contract2 = await new ethers.Contract(
        CONTRACT_ADDRESS,
        artifacts.abi
      );
      setContract(contract2);
    };
    onLoad();
  }, []);

  const isConnected = () => signer !== undefined;

  const getSigner = async () => {
    // From Ethers.js to get a signer to call functions
    provider.send("eth_requestAccounts", []);
    const signer3 = provider.getSigner();
    console.log("Signer Address = ", signer3);
    setSignerAddress(signer3);
    return signer3;
  };

  const getAssetIds = async (address, signer2) => {
    console.log("Address connected on getAssetIds", signer);
    console.log("Contract details is ", contract);
    const assetIds2 = await contract.connect(signer2).getAllPositionIdsByAddress(address);
    console.log("Asset id = ", assetIds2);
    return assetIds2;
  };

  const getAssets = async (ids, signer2) => {
    console.log("Address connected on getAssets", signer);
    console.log("Contract details is ", contract);
    // Using a Promise.all so that we can wait until we can get the data for all the positions
    const queriedAssets = await Promise.all(
      ids.map((id) => contract.connect(signer2).getPositionById(id))
    );

    queriedAssets.map(async (asset) => {
      console.log("Address connected queriedAssets", signer);
      // Will be easy to work with an object of the data that comes back with getPositionById
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest) / 100,
        daysRemaining: calculateRemainingDays(Number(asset.unlockDate)),
        etherInterest: toEther(asset.weiInterest),
        etherStaked: toEther(asset.weiStaked),
        open: asset.open,
      };

      setAssets((prev) => [...prev, parsedAsset]);
    });
  };

  const calculateRemainingDays = (unlockDate) => {
    const timeNow = Date.now() / 1000; // as Date.now() returns in milliseconds
    const remainingSeconds = unlockDate - timeNow;
    return Math.max((remainingSeconds / 60 / 60 / 24).toFixed(0), 0); // To return result in days without decimals and Max of that number and hundred so that there is no negative number and past date is shown as 0
  };

  const connectAndLoad = async () => {
    console.log("Address connected on connectAndLoad", signer);
    const signer2 = await getSigner();
    console.log("Signer = ", signer2);
    setSigner(signer2);

    const signerAddress2 = await signer2.getAddress();
    setSignerAddress(signerAddress2);
    console.log(signerAddress2);

    const assetIds2 = await getAssetIds(signerAddress2, signer2);
    setAssetIds(assetIds2);
    console.log(assetIds2);

    getAssets(assetIds, signer2);
    console.log(assets);
  };

  const openStakingModal = (stakingLength2, stakingPercent2) => {
    console.log("Address connected on openStakingModal", signer);
    setShowStakeModal(true);
    setStakingLength(stakingLength2);
    setStakingPercent(stakingPercent2);
  };

  const stakeEther = async () => {
    console.log("Address connected on stakeEther", signerAddress);
    console.log("Contract details is ", contract);
    const wei = toWei(amount);
    const data = { value: wei };
    // contract.connect(signerAddress).stakeEther(stakingLength, data);
    console.log(String(wei));
    // connectAndLoad()
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider4 = new ethers.providers.Web3Provider(connection);
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, artifacts.abi, provider4.getSigner());
    const Tx = await connectedContract.stakeEther(stakingLength, data);
    console.log("Transaction data is", Tx);
    // return Tx;
  };

  const withdraw = (positionId) => {
    console.log("Address connected on withdraw", signer);
    contract.connect(signer).closePosition(positionId);
  };

  return (
    <div className="bg-black-100">

      <div className="mt-5 mr-5 flex justify-center">
        <Header isConnected={isConnected} connect={connectAndLoad} />
      </div>

      <StakeContainer openStakingModal={openStakingModal} />
      <StakeTable assets={assets} withdraw={withdraw} />

      {
        showStakeModal && (
          <Modal
            setShowStakeModal={setShowStakeModal}
            stakingLength={stakingLength}
            stakingPercent={stakingPercent}
            amount={amount}
            setAmount={setAmount}
            stakeEther={stakeEther}
          />
        )
       // connectAndLoad();
      }
      connectAndLoad();
    </div>
  );
}

export default Stake;
