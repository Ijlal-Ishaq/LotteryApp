import {abi} from './ABI.json';
import { address as ContractAddress } from './contractAddress';
import Web3 from 'web3';

let web3;
let Contract;
let web3context;

export async function init(web3Context){
    
    web3context = web3Context;
    web3 = await new Web3(web3Context?.library?.currentProvider);
    Contract = await new web3.eth.Contract(
        abi,
        ContractAddress,
    );

}

export async function enter(initContract){

    let i=0;

    if(Contract){
        Contract.methods.enter()
        .send({
            from: web3context.account,
            value: web3.utils.toWei('1'),
            gas: 190809,
        })
        .on("transactionHash", (hash) => {
            console.log("Transaction hash : "+hash);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
            console.log("Transaction Confirmed");
            if(i===0){
                initContract();
            }
            i++;
        })
        .on("error", function (err) {
            console.log("error", err);
            console.log('Some Error Occured Try Again.');
        });
    }

}
 
export async function pickWinner(initContract){
    
    let i=0;

    if(Contract){
        Contract.methods.pickWinner()
        .send({ from: web3context.account })
        .on("transactionHash", (hash) => {
            console.log("Transaction hash : "+ hash);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
            console.log("Transaction Confirmed");
            if(i===0){
                initContract();
            }
            i++;
        })
        .on("error", function (err) {
            console.log("error", err);
        });
    }    
}

export async function getPoolBalance() {

    let bal = await Contract.methods.getPoolBalance().call();
    return web3.utils.fromWei(bal, "ether");      
    
} 

export async function getPoolLength() {

    let len = await Contract.methods.getPoolLength().call();
    return len;      
    
} 

export async function getPoolEntries() {

    let entry = await Contract.methods.getEntries().call({from : web3context.account});
    return entry;      
    
}

export async function getWinners() {
    let winners = await Contract.methods.getWinners().call();
    return winners; 
}