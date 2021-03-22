// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract dBank {

  mapping(uint => address payable) public banks;
  
  mapping(address => uint) public depositStart;
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public totalAmt;
  mapping(address => uint) public withdrawnAmt;

  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

  constructor() {
    banks[0]=0xb7E571beDA1Ac32CC292D31551389faBFCb8161A;
    banks[1]=0xC2d623e1B3C1C39296ef043980cc027ACeCC4Af0;
  }

  function displayTotalAmt(address payable _address) public view returns (uint) {
    return totalAmt[_address];
  }
  function displayWithdrawnAmt(address payable _address) public view returns (uint) {
    return withdrawnAmt[_address];
  }
  function displayBalance(address payable _address) public view returns (uint) {
    return etherBalanceOf[_address];
  }

  function deposit(uint id) payable public {
    address payable _address = banks[id];
    require(msg.value>=1e16, 'Error, deposit must be >= 0.01 ETH');

    etherBalanceOf[_address] = etherBalanceOf[_address] + msg.value;
    totalAmt[_address]=totalAmt[_address]+msg.value;
    
    //check user's hodl time
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withdraw(address payable _address) public {
    require(etherBalanceOf[_address]>0, 'Error, no funds to withdraw');

    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    //send funds to user
    _address.transfer(etherBalanceOf[_address]);

    //reset depositer data
    depositStart[msg.sender] = 0;
    withdrawnAmt[_address]= withdrawnAmt[_address] + etherBalanceOf[_address];
    etherBalanceOf[_address] = 0;

    emit Withdraw(msg.sender, etherBalanceOf[_address], depositTime, totalAmt[_address]);
  }

}