// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ReEntrancyGuard {
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public noReentrant {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        // stopped here
        // reverted with reason string 'Failed to send Ether'
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack2 {
    ReEntrancyGuard public reEntrancyGuard;

    constructor(address _reEntrancyGuard) {
        reEntrancyGuard = ReEntrancyGuard(_reEntrancyGuard);
    }

    //receive() external payable {}

    // Fallback is called when EtherStore sends Ether to this contract.
    fallback() external payable {
        if (address(reEntrancyGuard).balance >= 1 ether) {
            reEntrancyGuard.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        reEntrancyGuard.deposit{value: 1 ether}();
        reEntrancyGuard.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
