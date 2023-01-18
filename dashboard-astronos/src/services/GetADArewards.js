/*******************************************************
 * Copyright (C) 2021-2031 SAS Solicity | solicity.company@gmail.com
 *******************************************************/

import Web3 from 'web3';

export async function getAccountInfos(Address)
{
    var network = "https://bsc-dataseed.binance.org/"  //https://bsc-dataseed.binance.org/"; // Tesnet : https://data-seed-prebsc-1-s1.binance.org:8545/ 
    const ABI = require('./abi/AstronosABI.json');
    const TokenAddress = "0x512C0EBce9d064281dC1674C9F1A184701d84575"; //contract adress
    const web3 = new Web3(network);
    const eth = web3.eth;

    var TokenInstance = new eth.Contract(ABI, TokenAddress);
   // let res = await TokenInstance.methods.getAccount(Address).call();
    let res = await TokenInstance.methods.getAccountDividendsInfo(Address).call();
    // var accountDividends = res[4]
    return res[4];
}
