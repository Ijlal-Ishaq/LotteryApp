import { useWeb3React } from "@web3-react/core";
import { injected } from "./Connector";
import { useState , useEffect } from "react";
import { UnsupportedChainIdError } from '@web3-react/core';
import * as Services from './services';

import './App.css';

function App() {
  
  const web3Context = useWeb3React();
  

  let [poolBalance,setPoolBalance] = useState(0);
  let [poolLength,setPoolLength] = useState(0);
  let [poolEntries,setPoolEntries] = useState(0);
  let [winners,setWinners] = useState([]);
  

  useEffect(()=>{
    if(web3Context.active===true){
      initContract();
    }
  },[web3Context.active,web3Context.account]);

  const initContract = async() => {

    await Services.init(web3Context);

    await setBalance();
    await setLength();
    await setEntries();
    await setPreWinners();

  }

  const setBalance = async() => {
    let bal = await Services.getPoolBalance();
    setPoolBalance(bal);
  }
  
  const setLength = async() => {
    let len = await Services.getPoolLength();
    setPoolLength(len);
  }

  const setEntries = async() => {
    let ent = await Services.getPoolEntries();
    setPoolEntries(ent);
  }

  const setPreWinners = async() => {
    let winners = await Services.getWinners();
    setWinners(winners);
  }
  
  const connectWallet = async () => {
    

    try {

      web3Context.activate(injected);

    } catch (e) {

      if(e instanceof UnsupportedChainIdError){
        alert('You Are Connected to the wrong network.\nConnect to the Rinkeby Network.')
      }

    }
  }

  const disconnectWallet = async () => {
    try {
      web3Context.deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  const enter = async () => {
    Services.enter(initContract);
  }

  const pickWinner = async () => {
    Services.pickWinner(initContract);
  }

  return (
    <div className="App">

          <div style={{fontSize:'50px',fontWeight:'900',marginTop:'80px',marginBottom:'25px'}}>LOTTERY APP</div>
          
          <a style={{fontSize:'20px',fontWeight:'500',textDecoration:'underline',color:'#000'}} target='_blank' href="https://docs.google.com/document/d/1b3g_acIw2N3O0C_bX8HaQGD69Wod9IpG9tZmpggmcIQ/edit?usp=sharing">How does it work?</a>
           
           <div style={{width:'fit-content',margin: 'auto',marginTop: '50px'}}>
            {
              web3Context.active === true ?
              <div>
                <div style={{fontSize:'30px',fontWeight:'300',margin:'20px 0px'}}><span style={{fontSize:'20px',fontWeight:'700',textDecoration:'none'}}>{'"'+web3Context.account+'"'}</span></div>
                <div style={{fontSize:'30px',fontWeight:'300',margin:'20px 0px'}}><span style={{fontSize:'20px',fontWeight:'700'}}>{'TOTAL AMOUNT IN THE POOL : '}</span>{poolBalance + ' ETH'}</div>
                <div style={{fontSize:'30px',fontWeight:'300',margin:'20px 0px'}}><span style={{fontSize:'20px',fontWeight:'700'}}>{'TOTAL PLAYERS IN THE POOL : '}</span>{poolLength + ' PLAYERS'}</div>
                <div style={{fontSize:'30px',fontWeight:'300',margin:'20px 0px'}}><span style={{fontSize:'20px',fontWeight:'700'}}>{'YOUR ENTRIES IN THE POOL : '}</span>{poolEntries + ' Entries'}</div>
                <div style={{fontSize:'30px',fontWeight:'300',margin:'20px 0px'}}><span style={{fontSize:'20px',fontWeight:'700'}}>{'YOUR CHANCES OF WINNING : '}</span>{ poolEntries != 0 ? ((poolEntries/poolLength)*100).toFixed(2) : 0 }%</div>

                <br></br>

                <div style={{fontSize:'20px',fontWeight:'500',marginBottom:'15px'}}>Enter the Pool, entry fee is 1 Eth + gas fee.</div>
                <button onClick={()=>enter()} className="btn">Enter</button> <br></br> <br></br>
              
                <br></br><br></br>

                <div style={{fontSize:'35px',fontWeight:'900',margin:'20px 0px',textDecoration:'underline'}}>Previous Winners</div>
                  
                  {

                    winners.map((e,i)=>{

                      return <div style={{fontSize:'30px',fontWeight:'300',margin:'20px 0px'}}  key={i} ><span style={{fontSize:'20px',fontWeight:'700',textDecoration:'none'}}>{i+1+'. "'+e+'"'}</span></div>

                    })
                  }

                <br></br> <br></br> <br></br>
               
                
                <div style={{fontSize:'20px',fontWeight:'500',marginBottom:'15px'}}>Don't mess with this button <br></br> only the manager can use this button.</div>
                <button onClick={pickWinner} className="btn">Pick Winner</button> <br></br> <br></br>

                <div style={{fontSize:'20px',fontWeight:'500',marginBottom:'15px'}}>Tata bye bye, phr miltey hain.</div>
                <button onClick={disconnectWallet} className="btn">Disconnect Wallet</button> <br></br> <br></br>



              </div>
              :
              <div>
                <div style={{fontSize:'20px',fontWeight:'500',marginBottom:'15px'}}>Make sure you are connected to <b> RINKEBY </b> network.</div>
                <button onClick={connectWallet} className="btn">Connect Wallet</button>
              </div>
            }

            <br></br><br></br><br></br>
            <br></br><br></br><br></br>
            <br></br><br></br><br></br>
          </div>
          
    </div>
  );
}

export default App;
