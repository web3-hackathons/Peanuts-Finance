// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {

  ExampleExternalContract public exampleExternalContract;

  // Balances of users fund
  mapping(address => uint256) public balances;

  event Stake(address indexed _from, uint256 _amount);
  event Receive(address indexed _from, uint256 _amount);

  // Staking Threshold
  uint256 public constant threshold = 1 ether;

  // Staking Deadline
  uint256 public deadline = block.timestamp + 10 seconds;
  // block.timestamp + 72 hours

  // Variable that opens the vault for withdrawal
  bool openForWithdraw = false;

  // Contract's Modifiers
  modifier afterDeadline() {
    require(block.timestamp > deadline, "Deadline not reached");
    _;
  }

  /**
  * @notice Modifier that require the external contract to not be completed
  */
  modifier stakeNotCompleted() {
    require(!exampleExternalContract.completed(), "Already completed");
    _;
  }


  constructor(address exampleExternalContractAddress) public {
      exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
  //  ( make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )
  function stake() public payable stakeNotCompleted{
    balances[msg.sender] += msg.value;
    emit Stake(msg.sender, msg.value);
  }


  // After some `deadline` allow anyone to call an `execute()` function to change state
  //  It should either call `exampleExternalContract.complete{value: address(this).balance}()` to send all the value
  function execute() public stakeNotCompleted afterDeadline {
    uint256 contractBalance = address(this).balance;

    // check if the balance is more than the threshold
    if (contractBalance >= threshold ){
      // Execute the external contract, transfer all the balance to the contract
      // (bool sent, bytes memory data) = exampleExternalContract.complete{value: contractBalance}();

      (bool sent,) = address(exampleExternalContract).call{value: contractBalance}(abi.encodeWithSignature("complete()"));
      require(sent, "exampleExternalContract.complete failed");
//     exampleExternalContract.complete{value: address(this).balance}();

    } else {
      openForWithdraw = true; // allow users to withdraw their funds

    }

  }


  // if the `threshold` was not met, allow everyone to call a `withdraw()` function


  // Add a `withdraw()` function to let users withdraw their balance
  function withdraw(address _payable_to) public {
    require(openForWithdraw, "Threshold has not been met for withdrawal.");
    uint256 userBalance = balances[msg.sender];
     // check if the sender has a balance to withdraw
    require(userBalance > 0, "userBalance is 0");

    balances[msg.sender] = 0;
    // Transfer balance back to the user
    (bool sent,) = _payable_to.call{value: userBalance}("");
    require(sent, "Failed to send user balance back to the user");
  }


  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
  function timeLeft() public view returns (uint256) {
    if (block.timestamp>= deadline) {
      return 0;
    } else {
      return deadline - block.timestamp;
    }

  }

  // Add the `receive()` special function that receives eth and calls stake()
  receive() external payable {
    stake();  

  }


}
