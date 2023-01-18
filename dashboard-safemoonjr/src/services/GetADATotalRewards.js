/*******************************************************
 * Copyright (C) 2021-2031 SAS Solicity | solicity.company@gmail.com
 *******************************************************/

import Web3 from 'web3';

const BigNumber = Web3.utils.BN;

export async function AdaGetPrice(){

    return 1;
}

export async function getTotalDividend()
{
    const Web3 = require('web3');
    var network = "https://bsc-dataseed.binance.org/"  //https://bsc-dataseed.binance.org/"; // Tesnet : https://data-seed-prebsc-1-s1.binance.org:8545/ 
    const ABI = require('./abi/enhanceABI.json');
    const TokenAddress = "0xFA136f0D0b4685F2dD3B93566bD8a2E0D1B4d6E7"; //smjr token contract adress
    const web3 = new Web3(network);
    const eth = web3.eth;

    var TokenInstance = new eth.Contract(ABI, TokenAddress);
    let res = await TokenInstance.methods.getTotalDividendsDistributed().call()/10**6;
    return res;
}