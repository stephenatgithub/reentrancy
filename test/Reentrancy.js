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

    const EtherStore = await ethers.getContractFactory("EtherStore", alice);
    const etherStore = await EtherStore.deploy();
    //console.log("etherStore ", etherStore);

    const Attack = await ethers.getContractFactory("Attack", eve);
    const attack = await Attack.deploy(etherStore.target);
    //console.log("attack ", attack);

    return { alice, bob, eve, etherStore, attack };
  }  

  it("should have 0 ether for etherStore", async function () {
    const { etherStore } = await loadFixture(deployFixture);
    assert.equal(await etherStore.getBalance(), 0);
  }); 

  it("should have 3 ether for etherStore before attack", async function () {
    const { alice, bob, etherStore } = await loadFixture(deployFixture);

    // alice deposit 1 ether
    await etherStore.connect(alice).deposit({ value: ethers.parseEther("1") });
    // bob deposit 2 ether
    await etherStore.connect(bob).deposit({ value: ethers.parseEther("2") });

    assert.equal(await etherStore.getBalance(), ethers.parseEther("3"));
  });   

  it("should have etherStore (0 ether) and attack (4 ether) after attack", async function () {
    const { alice, bob, eve, etherStore, attack } = await loadFixture(deployFixture);

    // alice deposit 1 ether
    await etherStore.connect(alice).deposit({ value: ethers.parseEther("1") });
    // bob deposit 2 ether
    await etherStore.connect(bob).deposit({ value: ethers.parseEther("2") });
    // eve attacks
    await attack.connect(eve).attack({ value: ethers.parseEther("1") });

    assert.equal(await etherStore.getBalance(), 0);
    assert.equal(await attack.getBalance(), ethers.parseEther("4"));

  });


});
