/*******************************************************
 * Copyright (C) 2021-2031 SAS Solicity | solicity.company@gmail.com
 *******************************************************/

import Web3 from 'web3';

export async function getBalance(Address)
{
    var network = "https://bsc-dataseed.binance.org/"  //https://bsc-dataseed.binance.org/"; // Tesnet : https://data-seed-prebsc-1-s1.binance.org:8545/ 
    const ABI = require('./abi/LCheeABI.json');
    const TokenAddress = "0x86d6404c5fe697866a14968bba81eb18d1af5f4e"; // smjr token contract adress
    const web3 = new Web3(network);
    const eth = web3.eth;

    var TokenInstance = new eth.Contract(ABI, TokenAddress);
    let res = await TokenInstance.methods.balanceOf(Address).call();
    return res;
}
