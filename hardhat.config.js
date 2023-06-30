require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: process.env.FORK_MAINNET,
      }
    }
  },
};
