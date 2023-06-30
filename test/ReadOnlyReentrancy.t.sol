const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Target = await ethers.getContractFactory("Target");
    const target = await Target.deploy();
    console.log("Target deployed ", target.target);

    const Hack = await ethers.getContractFactory("Hack");
    const hack = await Hack.deploy(target.target);
    console.log("Hack deployed ", hack.target);

    return { target, hack };
  }  

  it("should attack", async function () {
    const { target, hack } = await loadFixture(deployFixture);

    hack.setup({value: ethers.parseEther("11") });
    hack.pwn({value: ethers.parseEther("300") });
  }); 

});
