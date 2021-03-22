import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()

      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts()

      //load balance
      if(typeof accounts[0] !=='undefined' ){
        const balance = await web3.eth.getBalance(accounts[0]) 
      
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);

        this.setState({account0: accounts[0],account1: accounts[1], balance: balance, web3: web3})
        
        setInterval(function(){

          dbank.methods.displayTotalAmt(accounts[0]).call().then( function (result) {
          document.getElementById("id1").innerHTML= web3.utils.fromWei(result);
        });

          dbank.methods.displayWithdrawnAmt(accounts[0]).call().then( function (result) {
          document.getElementById("id2").innerHTML= web3.utils.fromWei(result);
        });

          dbank.methods.displayBalance(accounts[0]).call().then( function (result) {
          document.getElementById("id3").innerHTML= web3.utils.fromWei(result);
        });

      }, 1000);
       
        
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
        const dBankAddress = dBank.networks[netId].address
        this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress})
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }

  async deposit(amount) {
    if(this.state.dbank!=='undefined'){
      try{
        var acc= document.getElementById("accID").value;
        console.log(acc, typeof acc)
        await this.state.dbank.methods.deposit(acc).send({value: amount.toString(), from: this.state.account0})
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }

  async withdraw(e) {
    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        const web3 = new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()
        await this.state.dbank.methods.withdraw(accounts[0]).send({from: this.state.account0})
      } catch(e) {
        console.log('Error, withdraw: ', e)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account0: '',
      account1: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>d₿ank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to d₿ank</h1>

          <h3> {this.state.account0}</h3>

          <br></br>
          <h3> Total Amount: <span id="id1"> </span></h3>
          <h3> Withdrawn Amount: <span id="id2"> </span></h3>
          <h3> Remaining Amount: <span id="id3"> </span></h3>


          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div>
                  <br></br>
                    Which account do you want to deposit to?
                    <br></br>
                    <input type="number" id="accID"></input>
                    <br></br>
                    <br></br>
                    How much do you want to deposit?
                    <br></br>
                    (min. amount is 0.01 ETH)
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      amount = amount * 10**18 //convert to wei
                      this.deposit(amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='depositAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.depositAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>

                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <br></br>
                    Do you want to withdraw?
                    <br></br>
                    <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;