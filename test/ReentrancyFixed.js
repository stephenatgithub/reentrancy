const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [alice, bob, eve] = await ethers.getSigners();

    const ReEntrancyGuard = await ethers.getContractFactory("ReEntrancyGuard", alice);
    const reEntrancyGuard = await ReEntrancyGuard.deploy();
    //console.log("reEntrancyGuard ", reEntrancyGuard);

    const Attack2 = await ethers.getContractFactory("Attack2", eve);
    const attack = await Attack2.deploy(reEntrancyGuard.target);
    //console.log("attack ", attack);

    return { alice, bob, eve, reEntrancyGuard, attack };
  }  

  it("should have 0 ether for reEntrancyGuard", async function () {
    const { reEntrancyGuard } = await loadFixture(deployFixture);
    assert.equal(await reEntrancyGuard.getBalance(), 0);
  }); 

  it("should have 3 ether for reEntrancyGuard before attack", async function () {
    const { alice, bob, reEntrancyGuard } = await loadFixture(deployFixture);

    // alice deposit 1 ether
    await reEntrancyGuard.connect(alice).deposit({ value: ethers.parseEther("1") });
    // bob deposit 2 ether
    await reEntrancyGuard.connect(bob).deposit({ value: ethers.parseEther("2") });

    assert.equal(await reEntrancyGuard.getBalance(), ethers.parseEther("3"));
  });   

  it("should have reEntrancyGuard (0 ether) and attack (4 ether) after attack", async function () {
    const { alice, bob, eve, reEntrancyGuard, attack } = await loadFixture(deployFixture);

    // alice deposit 1 ether
    await reEntrancyGuard.connect(alice).deposit({ value: ethers.parseEther("1") });
    // bob deposit 2 ether
    await reEntrancyGuard.connect(bob).deposit({ value: ethers.parseEther("2") });
    // eve attacks
    await attack.connect(eve).attack({ value: ethers.parseEther("1") });

    assert.equal(await reEntrancyGuard.getBalance(), ethers.parseEther("3"));
    assert.equal(await attack.getBalance(), ethers.parseEther("0"));

  });


});
