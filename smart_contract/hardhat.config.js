require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    testnet: {      
      url: `https://canto-testnet.plexnode.wtf`,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {     
      url: `https://canto.slingshot.finance/`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

