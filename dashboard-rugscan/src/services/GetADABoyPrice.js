/*******************************************************
 * Copyright (C) 2021-2031 SAS Solicity |┬ásolicity.company@gmail.com
 *******************************************************/

import Web3 from 'web3';
const BigNumber = Web3.utils.BN;

async function bnbgetprice(){
    let res = await fetch("https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=DWN22VBSXE2315IWNPGZE5MHEE17G3R27V",{
        method:"get",
        headers:{
            Accept:"*/*",
            "Content-Type":"application/json"
        }
    });
    return res.json();
}

export async function getPrice()
{
    const provider = "https://bsc-dataseed.binance.org/";
    const ABI = require('./abi/PairABI.json');
    const TokenAddress = "0x94E0a79B2Ff9Abd3B40c414483Fa45419fE6441f"; // lp token address
    const web3 = new Web3(provider);
    const eth = web3.eth;

    var TokenInstance = TokenInstance = new eth.Contract(ABI, TokenAddress);

    let res = await TokenInstance.methods.getReserves().call()
    var price = (res._reserve1) / (res._reserve0)/10**9;

   
    let BnbPrice = await bnbgetprice();
    price *= BnbPrice.result.ethusd;

    return price;
}