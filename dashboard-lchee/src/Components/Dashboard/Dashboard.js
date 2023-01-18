/*******************************************************
 * Copyright (C) 2021-2031 SAS Solicity | solicity.company@gmail.com
 *******************************************************/

import { useState, useContext, useEffect } from 'react';
import './Dashboard.scss';

import AdaLogo from "../../Assets/adalogo.png";

import {ConnectContext} from '../../context/connectContext';

import {AdaGetPrice, getTotalDividend} from '../../services/GetADATotalRewards';
import { getBalance } from '../../services/GetADABoyBalance';
import { getPrice } from '../../services/GetADABoyPrice';
import { getAccountInfos } from '../../services/GetADArewards';

export default function Dashboard(){

    const [OpenModal, setOpenModal] = useState(false);
    const [totalADARewards, setTotalADARewards] = useState(0);
    const [ADARewards, setADARewards] = useState(0);
    const [ADABoyBalance, setADABoyBalance] = useState(0);
    const [AdaPrice, setAdaPrice] = useState(0);
    const [LastPayoutTime, setLastPayoutTime] = useState(0);

    const [ADABoyBalanceValue, setADABoyBalanceValue] = useState(0);


    const {Connect, Con, setConnect, web3, account, getAccount, setGetAccount, loadingData, setLoadingData} = useContext(ConnectContext);

    const Modal = () =>{
        return(
            <div className="bgModal">
                <div className="modal">
                    <svg onClick={()=>setOpenModal(false)} className="cross" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3 10.0006L19.4872 3.81336C20.1709 3.12973 20.1709 2.0214 19.4872 1.33884L18.6624 0.514003C17.9786 -0.169839 16.8702 -0.169839 16.1877 0.514003L10.0006 6.70105L3.81336 0.512721C3.12973 -0.170907 2.0214 -0.170907 1.33884 0.512721L0.512721 1.33756C-0.170907 2.0214 -0.170907 3.12973 0.512721 3.81229L6.70105 10.0006L0.514003 16.1877C-0.169839 16.8715 -0.169839 17.9798 0.514003 18.6624L1.33884 19.4872C2.02247 20.1709 3.1308 20.1709 3.81336 19.4872L10.0006 13.3L16.1877 19.4872C16.8715 20.1709 17.9798 20.1709 18.6624 19.4872L19.4872 18.6624C20.1709 17.9786 20.1709 16.8702 19.4872 16.1877L13.3 10.0006Z" fill="#000"/>
                    </svg>
                    <h1>Your wallet</h1>
                    <p id="myWalletAddress">{Connect && account}</p>

                    <a href="#" id="myDashboard" onClick={()=>{setGetAccount(false); setOpenModal(false)}}>Go to your dashboard</a>
                    <a href="#" onClick={async()=>{localStorage.clear(); setConnect(false); window.location.reload()}} id="logout">Disconnect</a>
                </div>
            </div>
        )
    }

    useEffect(async()=>{
        if(localStorage.getItem("walletConnected")){
          await Con();
        }
    },[]);

    // Get ADA Total Reward
    useEffect(async()=>{
        try{
            let totaldiv = await getTotalDividend()/10**18;
            totaldiv = totaldiv
            totaldiv = totaldiv.toString();
            setTotalADARewards(parseFloat(totaldiv).toFixed(6));
        }catch(err){
            console.error("Get Total Dividend: " + err);
        }
        let AdaPrice = await AdaGetPrice();
        setAdaPrice(parseFloat(AdaPrice).toFixed(6));
    },[]);

    // Get ADABoy Balance
    useEffect(async()=>{
        try{
            if(Connect && !getAccount){
                let ADABoyBalance = await getBalance(account);
                ADABoyBalance = ADABoyBalance/(10**18);
                setADABoyBalance(parseFloat(ADABoyBalance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                let ADABoyPrice = await getPrice();
                ADABoyPrice = ADABoyPrice*ADABoyBalance;
                setADABoyBalanceValue(parseFloat(ADABoyPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }else{
                let ADABoyBalance = await getBalance(getAccount != false ? getAccount : "");
                ADABoyBalance = ADABoyBalance/(10**18);
                setADABoyBalance(parseFloat(ADABoyBalance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                let ADABoyPrice = await getPrice();
                ADABoyPrice = ADABoyPrice*ADABoyBalance;
                console.log("Price: " + ADABoyPrice);
                setADABoyBalanceValue(parseFloat(ADABoyPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
        }catch(err){
            setADABoyBalance(0);
            setADABoyBalanceValue(0);
        }
        setLoadingData(false);
    });

    // Get ADA Total Reward for account
    useEffect(async()=>{
        try{
            if(Connect && !getAccount){
                let infos = await getAccountInfos(account);
                let totaldiv = (infos)/10**18;
                setADARewards(parseFloat(totaldiv).toFixed(8));
                //setLastPayoutTime(infos.lastClaimTime);
            }else{
                let infos = await getAccountInfos(getAccount != false ? getAccount : "");
                let totaldiv = (infos)/10**18;
                setADARewards(parseFloat(totaldiv).toFixed(8));
                //setLastPayoutTime(infos.lastClaimTime);
            }
        }catch(err){
            console.log(err);
            setADARewards(0);
        }
    });
    

    return(
        <>
            { OpenModal && <Modal />}

            <div className="dashboard-container">
                <div className="col-10 col-md-8 col-sm-12">
                    <div className="row" id="btn-row">
                        <a className="buy-btn" target="_blank" href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x86d6404c5fe697866a14968bba81eb18d1af5f4e"> 
                        <svg className="cardIcon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.6801 3.40406C17.4469 3.12836 17.1203 2.95997 16.7604 2.92991L4.08461 1.8715C3.72468 1.84144 3.37474 1.95334 3.09901 2.18653C2.82441 2.41881 2.65626 2.74376 2.62525 3.10189L2.37023 5.49448H1.35193C0.606478 5.49448 0 6.10095 0 6.8464V14.7812C0 15.5267 0.606478 16.1331 1.35193 16.1331H14.0719C14.8174 16.1331 15.4238 15.5267 15.4238 14.7812V13.494L15.8752 13.5317C15.9133 13.5349 15.9511 13.5365 15.9887 13.5365C16.6836 13.5365 17.2761 13.0018 17.335 12.297L17.9952 4.38969C18.0252 4.0298 17.9133 3.67979 17.6801 3.40406V3.40406ZM1.35193 6.1976H14.0719C14.4296 6.1976 14.7207 6.48866 14.7207 6.8464V7.56943H0.703122V6.8464C0.703122 6.48866 0.99418 6.1976 1.35193 6.1976V6.1976ZM0.703122 8.27255H14.7207V9.73114H0.703122V8.27255ZM14.0719 15.43H1.35193C0.99418 15.43 0.703122 15.139 0.703122 14.7812V10.4343H14.7207V14.7812C14.7207 15.139 14.4296 15.43 14.0719 15.43ZM17.2945 4.33116L16.6343 12.2384C16.6045 12.595 16.2901 12.8609 15.9337 12.831L15.4238 12.7885V6.8464C15.4238 6.10095 14.8174 5.49448 14.0719 5.49448H3.07736L3.32482 3.17277C3.3251 3.17009 3.32535 3.16746 3.32556 3.16475C3.35533 2.80823 3.66949 2.54231 4.02611 2.57219L16.7019 3.6306C16.8747 3.64502 17.0314 3.72584 17.1433 3.85817C17.2552 3.9905 17.3089 4.15844 17.2945 4.33116V4.33116Z" fill="white"/>
                            <path d="M13.2497 11.4795H9.86621C9.67204 11.4795 9.51465 11.6369 9.51465 11.8311V14.0385C9.51465 14.2327 9.67204 14.39 9.86621 14.39H13.2497C13.4439 14.39 13.6013 14.2327 13.6013 14.0385V11.8311C13.6013 11.6369 13.4439 11.4795 13.2497 11.4795ZM12.8982 13.6869H10.2178V12.1826H12.8982V13.6869Z" fill="white"/>
                        </svg>

                        <span>Buy Litechee</span>

                        <svg className="arrowIcon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.8082 5.53363L7.47456 1.19991C7.35086 1.0762 7.18598 1.0083 7.01018 1.0083C6.83418 1.0083 6.6694 1.0763 6.54569 1.19991L6.15223 1.59347C6.02863 1.71698 5.96053 1.88195 5.96053 2.05785C5.96053 2.23366 6.02863 2.40419 6.15223 2.5277L8.6804 5.06144H0.648286C0.286144 5.06144 0 5.34495 0 5.70719V6.26357C0 6.62582 0.286144 6.93791 0.648286 6.93791H8.70909L6.15233 9.48579C6.02872 9.6095 5.96063 9.76998 5.96063 9.94589C5.96063 10.1216 6.02872 10.2844 6.15233 10.408L6.54579 10.8003C6.6695 10.924 6.83428 10.9914 7.01027 10.9914C7.18608 10.9914 7.35095 10.9231 7.47466 10.7994L11.8083 6.46582C11.9323 6.34172 12.0005 6.17606 12 5.99997C12.0004 5.82329 11.9323 5.65753 11.8082 5.53363Z" fill="white"/>
                        </svg>
    
                        </a>

                        {Connect ? 
                        <div onClick={()=>setOpenModal(true)} id="walletInDashboard" className="walletInput">
                            <div className="round">
                                <svg className="walletIcon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.2725 8.0671V5.81833C15.2725 5.0558 14.681 4.43566 13.9338 4.37553L11.8454 0.727861C11.6518 0.390503 11.3393 0.149382 10.9654 0.0492583C10.5932 -0.0501832 10.2041 0.00204321 9.87096 0.195915L2.71189 4.3638H1.45453C0.652353 4.3638 0 5.01612 0 5.81833V14.5455C0 15.3476 0.652319 16 1.45453 16H13.818C14.6202 16 15.2725 15.3477 15.2725 14.5455V12.2967C15.6949 12.1461 15.9998 11.7462 15.9998 11.2728V9.09101C15.9998 8.61756 15.6949 8.21772 15.2725 8.0671ZM13.0887 4.3638H9.91927L12.2964 2.97987L13.0887 4.3638ZM11.935 2.34875L8.47387 4.3638H7.03823L11.5761 1.7218L11.935 2.34875ZM10.2371 0.824439C10.4015 0.728202 10.5936 0.702634 10.7772 0.751656C10.9629 0.80136 11.1178 0.921392 11.214 1.08935L11.2147 1.09068L5.5929 4.3638H4.15732L10.2371 0.824439ZM14.5452 14.5455C14.5452 14.9464 14.2189 15.2727 13.818 15.2727H1.45453C1.05363 15.2727 0.727284 14.9464 0.727284 14.5455V5.81833C0.727284 5.41743 1.05363 5.09109 1.45453 5.09109H13.818C14.2189 5.09109 14.5452 5.41743 14.5452 5.81833V8.00012H12.3634C11.1603 8.00012 10.1817 8.97878 10.1817 10.1819C10.1817 11.385 11.1603 12.3637 12.3634 12.3637H14.5452V14.5455V14.5455ZM15.2725 11.2728C15.2725 11.4734 15.1095 11.6364 14.9089 11.6364H12.3634C11.5613 11.6364 10.9089 10.9841 10.9089 10.1819C10.9089 9.37972 11.5612 8.72737 12.3634 8.72737H14.9089C15.1095 8.72737 15.2725 8.89035 15.2725 9.09101V11.2728V11.2728Z" fill="white"/>
                                    <path d="M12.363 9.45459C11.9621 9.45459 11.6357 9.78094 11.6357 10.1818C11.6357 10.5827 11.9621 10.9091 12.363 10.9091C12.7639 10.9091 13.0902 10.5827 13.0902 10.1818C13.0903 9.78094 12.7639 9.45459 12.363 9.45459Z" fill="white"/>
                                </svg>
                            </div>
                            <p className="walletAddress">{Connect && account.substring(0,11)+"..."}</p>
                        </div>
                        :
                        <button id="ConnectBtn" onClick={async()=>{await Con()}}>Connect</button>
                        }

                    </div>

                    <div className="row info-row">
                        <div className="info-col col-4 col-md-12 col-sm-12">
                            <div className="info">
                                <div className="icon-container icon-container-orange">
                                    <svg className="info-icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.9231 10.6731H30V6.92311C30 4.53723 28.059 2.59619 25.6731 2.59619H4.32691C1.94104 2.59619 0 4.53723 0 6.92311V23.0769C0 25.4628 1.94104 27.4038 4.32691 27.4038H25.6731C28.059 27.4038 30 25.4628 30 23.0769V19.3269H21.9231C19.5372 19.3269 17.5962 17.3859 17.5962 15C17.5962 12.6141 19.5372 10.6731 21.9231 10.6731Z" fill="white"/>
                                        <path d="M21.9233 12.4038C20.4918 12.4038 19.3271 13.5684 19.3271 15C19.3271 16.4315 20.4918 17.5961 21.9233 17.5961H30.0002V12.4039H21.9233V12.4038ZM23.0771 15.8653H21.9233C21.4454 15.8653 21.0579 15.4779 21.0579 15C21.0579 14.5221 21.4454 14.1346 21.9233 14.1346H23.0771C23.5551 14.1346 23.9425 14.5221 23.9425 15C23.9425 15.4779 23.5551 15.8653 23.0771 15.8653Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="col">
                                    <h1>Litechee balance</h1>
                                    {loadingData ? <div class="lds-dual-ring"></div> : <p>{ADABoyBalance} <b>Litechee</b></p>}
                                </div>
                            </div>
                        </div>
                        <div className="info-col col-4 col-md-12 col-sm-12">
                            <div className="info">
                                <div className="icon-container icon-container-green">
                                    <svg className="info-icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 0C6.729 0 0 6.729 0 15C0 23.271 6.729 30 15 30C23.271 30 30 23.271 30 15C30 6.729 23.271 0 15 0ZM15 27.777C7.956 27.777 2.223 22.046 2.223 15C2.223 7.954 7.956 2.223 15 2.223C22.044 2.223 27.777 7.954 27.777 15C27.777 22.046 22.044 27.777 15 27.777Z" fill="white"/>
                                        <path d="M12.8027 11.4118C12.8027 12.1168 13.2797 12.7048 14.2307 13.1778V9.92383C13.2787 10.0948 12.8027 10.5908 12.8027 11.4118Z" fill="white"/>
                                        <path d="M15 3.5C8.66 3.5 3.5 8.659 3.5 15C3.5 21.341 8.66 26.5 15 26.5C21.34 26.5 26.5 21.341 26.5 15C26.5 8.659 21.34 3.5 15 3.5ZM18.839 20.893C18.113 21.587 17.077 22.01 15.729 22.161V24.39H14.23V22.224C12.84 22.216 11.547 21.902 10.349 21.279V18.435C10.746 18.757 11.338 19.056 12.125 19.329C12.912 19.603 13.613 19.76 14.229 19.802V16.065C12.627 15.47 11.534 14.826 10.949 14.13C10.364 13.435 10.071 12.588 10.071 11.589C10.071 10.514 10.451 9.599 11.211 8.843C11.971 8.087 12.977 7.647 14.23 7.524V5.613H15.729V7.481C17.172 7.549 18.25 7.782 18.962 8.179V10.95C18.003 10.368 16.926 10.012 15.729 9.883V13.774C17.227 14.315 18.301 14.932 18.953 15.627C19.602 16.322 19.929 17.162 19.929 18.148C19.928 19.282 19.564 20.198 18.839 20.893Z" fill="white"/>
                                        <path d="M15.7285 16.646V19.756C16.7075 19.607 17.1985 19.116 17.1985 18.288C17.1965 17.62 16.7065 17.072 15.7285 16.646Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="col">
                                    <h1>Litechee value</h1>
                                    {loadingData ? <div class="lds-dual-ring"></div> : <p id="AdaValue"><b>~$</b> {ADABoyBalanceValue}</p>}
                                </div>

                            </div>
                        </div>
                        <div className="info-col col-4 col-md-12 col-sm-12">
                            <div className="info">
                                <div className="icon-container icon-container-blue">
                                    <img id="ada-icon" className="info-icon" src={AdaLogo} />
                                    {/* <svg  className="info-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z" fill="#3468D1"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2123 17.3311C22.701 17.3311 23.1787 17.4761 23.5851 17.7477C23.9914 18.0193 24.308 18.4052 24.495 18.8568C24.682 19.3083 24.7309 19.8052 24.6355 20.2845C24.5401 20.7638 24.3047 21.2041 23.9591 21.5496C23.6135 21.8952 23.1732 22.1305 22.6939 22.2258C22.2145 22.3211 21.7177 22.2721 21.2662 22.0851C20.8147 21.8981 20.4288 21.5813 20.1572 21.175C19.8857 20.7686 19.7408 20.2909 19.7408 19.8022C19.7409 19.1467 20.0014 18.5182 20.4648 18.0548C20.9283 17.5914 21.5569 17.3311 22.2123 17.3311V17.3311ZM28.1783 17.3311C28.667 17.3312 29.1447 17.4762 29.551 17.7478C29.9573 18.0194 30.274 18.4054 30.4609 18.8569C30.6478 19.3085 30.6967 19.8053 30.6013 20.2846C30.5059 20.7639 30.2705 21.2041 29.9248 21.5497C29.5792 21.8952 29.1389 22.1305 28.6596 22.2258C28.1803 22.3211 27.6834 22.2721 27.2319 22.0851C26.7804 21.898 26.3946 21.5813 26.1231 21.175C25.8515 20.7686 25.7066 20.2909 25.7066 19.8022C25.7067 19.1467 25.9672 18.5181 26.4307 18.0547C26.8942 17.5913 27.5229 17.331 28.1783 17.3311V17.3311ZM28.1783 27.7268C28.667 27.7269 29.1447 27.8719 29.551 28.1435C29.9573 28.4151 30.274 28.8011 30.4609 29.2526C30.6478 29.7042 30.6967 30.201 30.6013 30.6803C30.5059 31.1596 30.2705 31.5999 29.9248 31.9454C29.5792 32.2909 29.1389 32.5262 28.6596 32.6215C28.1803 32.7168 27.6834 32.6678 27.2319 32.4808C26.7804 32.2937 26.3946 31.977 26.1231 31.5707C25.8515 31.1643 25.7066 30.6866 25.7066 30.1978C25.7067 29.8733 25.7706 29.5519 25.8948 29.2521C26.0191 28.9523 26.2012 28.6798 26.4307 28.4504C26.6602 28.2209 26.9327 28.0389 27.2325 27.9147C27.5324 27.7906 27.8538 27.7267 28.1783 27.7268V27.7268ZM22.2123 27.7268C22.701 27.7268 23.1787 27.8718 23.5851 28.1434C23.9914 28.415 24.308 28.8009 24.495 29.2525C24.682 29.704 24.7309 30.2009 24.6355 30.6802C24.5401 31.1595 24.3047 31.5998 23.9591 31.9453C23.6135 32.2909 23.1732 32.5262 22.6939 32.6215C22.2145 32.7168 21.7177 32.6679 21.2662 32.4808C20.8147 32.2938 20.4288 31.977 20.1572 31.5707C19.8857 31.1643 19.7408 30.6866 19.7408 30.1978C19.7408 29.8733 19.8048 29.552 19.929 29.2521C20.0532 28.9523 20.2353 28.6799 20.4648 28.4504C20.6943 28.221 20.9667 28.039 21.2666 27.9148C21.5664 27.7906 21.8878 27.7267 22.2123 27.7268V27.7268ZM19.1441 22.6141C19.6329 22.6141 20.1106 22.7591 20.5169 23.0307C20.9232 23.3023 21.2399 23.6882 21.4269 24.1398C21.6138 24.5913 21.6627 25.0882 21.5673 25.5675C21.4719 26.0468 21.2365 26.4871 20.8909 26.8326C20.5453 27.1782 20.105 27.4135 19.6257 27.5088C19.1464 27.6041 18.6495 27.5552 18.198 27.3681C17.7465 27.1811 17.3606 26.8643 17.0891 26.458C16.8176 26.0516 16.6727 25.5739 16.6727 25.0852C16.6728 24.4297 16.9332 23.8012 17.3967 23.3378C17.8602 22.8744 18.4887 22.6141 19.1441 22.6141V22.6141ZM31.2465 22.6141C31.7352 22.6142 32.2129 22.7592 32.6192 23.0308C33.0255 23.3024 33.3421 23.6884 33.5291 24.1399C33.716 24.5915 33.7649 25.0883 33.6694 25.5676C33.574 26.0469 33.3386 26.4872 32.993 26.8327C32.6474 27.1782 32.2071 27.4135 31.7278 27.5088C31.2484 27.6041 30.7516 27.5551 30.3001 27.3681C29.8486 27.181 29.4627 26.8643 29.1912 26.458C28.9197 26.0516 28.7748 25.5739 28.7748 25.0852C28.7748 24.7606 28.8388 24.4392 28.963 24.1394C29.0872 23.8396 29.2693 23.5671 29.4988 23.3377C29.7284 23.1082 30.0008 22.9262 30.3007 22.802C30.6005 22.6779 30.9219 22.614 31.2465 22.6141V22.6141ZM34.059 18.3537C34.3623 18.3538 34.6588 18.4438 34.911 18.6124C35.1632 18.781 35.3597 19.0205 35.4757 19.3008C35.5918 19.5811 35.6221 19.8895 35.5629 20.187C35.5036 20.4845 35.3575 20.7577 35.143 20.9722C34.9285 21.1867 34.6552 21.3327 34.3577 21.3918C34.0602 21.451 33.7518 21.4206 33.4715 21.3045C33.1913 21.1884 32.9518 20.9918 32.7833 20.7396C32.6148 20.4874 32.5248 20.1908 32.5248 19.8875C32.5248 19.686 32.5645 19.4866 32.6416 19.3004C32.7187 19.1143 32.8317 18.9452 32.9742 18.8028C33.1166 18.6604 33.2858 18.5474 33.4719 18.4703C33.658 18.3933 33.8575 18.3537 34.059 18.3537V18.3537ZM34.059 28.5787C34.3623 28.5788 34.6588 28.6688 34.911 28.8374C35.1632 29.006 35.3597 29.2455 35.4757 29.5258C35.5918 29.8061 35.6221 30.1145 35.5629 30.412C35.5036 30.7095 35.3575 30.9827 35.143 31.1972C34.9285 31.4117 34.6552 31.5577 34.3577 31.6168C34.0602 31.676 33.7518 31.6456 33.4715 31.5295C33.1913 31.4134 32.9518 31.2168 32.7833 30.9646C32.6148 30.7124 32.5248 30.4158 32.5248 30.1125C32.5248 29.9111 32.5645 29.7116 32.6416 29.5255C32.7187 29.3393 32.8317 29.1702 32.9742 29.0278C33.1166 28.8854 33.2858 28.7724 33.4719 28.6954C33.658 28.6183 33.8575 28.5787 34.059 28.5787V28.5787ZM16.3316 28.5787C16.635 28.5787 16.9315 28.6687 17.1837 28.8373C17.4359 29.0059 17.6325 29.2454 17.7485 29.5257C17.8646 29.806 17.8949 30.1143 17.8357 30.4119C17.7765 30.7094 17.6304 30.9826 17.4159 31.1971C17.2014 31.4116 16.9281 31.5577 16.6306 31.6168C16.3331 31.676 16.0247 31.6456 15.7444 31.5295C15.4642 31.4134 15.2247 31.2168 15.0561 30.9646C14.8876 30.7124 14.7977 30.4159 14.7977 30.1125C14.7977 29.7057 14.9593 29.3156 15.247 29.0279C15.5347 28.7403 15.9248 28.5787 16.3316 28.5787V28.5787ZM16.3316 18.3537C16.635 18.3538 16.9315 18.4437 17.1837 18.6123C17.4359 18.7809 17.6325 19.0204 17.7485 19.3007C17.8646 19.5809 17.8949 19.8893 17.8357 20.1868C17.7765 20.4844 17.6304 20.7576 17.4159 20.9721C17.2014 21.1866 16.9281 21.3327 16.6306 21.3918C16.3331 21.451 16.0247 21.4206 15.7444 21.3045C15.4642 21.1884 15.2247 20.9918 15.0561 20.7396C14.8876 20.4874 14.7977 20.1908 14.7977 19.8875C14.7977 19.4807 14.9593 19.0906 15.247 18.8029C15.5347 18.5153 15.9248 18.3537 16.3316 18.3537V18.3537ZM25.1953 13.241C25.4986 13.2411 25.7952 13.3311 26.0473 13.4997C26.2995 13.6683 26.496 13.9079 26.6121 14.1881C26.7281 14.4684 26.7584 14.7768 26.6992 15.0743C26.64 15.3718 26.4939 15.645 26.2793 15.8595C26.0648 16.074 25.7915 16.22 25.494 16.2791C25.1965 16.3383 24.8881 16.3079 24.6079 16.1918C24.3276 16.0757 24.0881 15.8791 23.9196 15.6269C23.7511 15.3747 23.6611 15.0781 23.6611 14.7748C23.6611 14.5733 23.7008 14.3739 23.7779 14.1878C23.855 14.0016 23.968 13.8325 24.1105 13.6901C24.253 13.5477 24.4221 13.4347 24.6082 13.3577C24.7944 13.2806 24.9939 13.241 25.1953 13.241V13.241ZM25.1953 33.6914C25.4986 33.6915 25.7952 33.7815 26.0473 33.9501C26.2995 34.1187 26.496 34.3582 26.6121 34.6385C26.7281 34.9188 26.7584 35.2272 26.6992 35.5247C26.64 35.8222 26.4939 36.0954 26.2793 36.3099C26.0648 36.5244 25.7915 36.6704 25.494 36.7295C25.1965 36.7887 24.8881 36.7583 24.6079 36.6422C24.3276 36.5261 24.0881 36.3295 23.9196 36.0773C23.7511 35.8251 23.6611 35.5285 23.6611 35.2252C23.6611 35.0237 23.7008 34.8243 23.7779 34.6382C23.855 34.452 23.968 34.2829 24.1105 34.1405C24.253 33.9981 24.4221 33.8851 24.6082 33.8081C24.7944 33.731 24.9939 33.6914 25.1953 33.6914V33.6914ZM31.7578 35.2252C32.0106 35.2253 32.2577 35.3003 32.4678 35.4408C32.6779 35.5813 32.8417 35.7809 32.9384 36.0145C33.035 36.248 33.0603 36.505 33.0109 36.7529C32.9616 37.0008 32.8398 37.2285 32.6611 37.4072C32.4823 37.5859 32.2545 37.7076 32.0066 37.7569C31.7587 37.8062 31.5017 37.7809 31.2682 37.6841C31.0347 37.5874 30.8351 37.4236 30.6947 37.2134C30.5542 37.0032 30.4793 36.7561 30.4793 36.5033C30.4793 36.3354 30.5124 36.1692 30.5766 36.0141C30.6409 35.859 30.7351 35.7181 30.8538 35.5994C30.9725 35.4807 31.1135 35.3866 31.2686 35.3224C31.4237 35.2582 31.5899 35.2251 31.7578 35.2252V35.2252ZM18.6328 35.2252C18.8856 35.2253 19.1327 35.3003 19.3428 35.4408C19.5529 35.5813 19.7167 35.7809 19.8134 36.0145C19.91 36.248 19.9353 36.505 19.8859 36.7529C19.8366 37.0008 19.7148 37.2285 19.5361 37.4072C19.3573 37.5859 19.1295 37.7076 18.8816 37.7569C18.6337 37.8062 18.3767 37.7809 18.1432 37.6841C17.9097 37.5874 17.7101 37.4236 17.5697 37.2134C17.4292 37.0032 17.3543 36.7561 17.3543 36.5033C17.3543 36.3354 17.3874 36.1692 17.4516 36.0141C17.5159 35.859 17.6101 35.7181 17.7288 35.5994C17.8475 35.4807 17.9885 35.3866 18.1436 35.3224C18.2987 35.2582 18.4649 35.2251 18.6328 35.2252V35.2252ZM18.6328 12.2186C18.8856 12.2186 19.1327 12.2937 19.3428 12.4341C19.5529 12.5746 19.7167 12.7743 19.8134 13.0078C19.91 13.2414 19.9353 13.4984 19.8859 13.7463C19.8366 13.9942 19.7148 14.2219 19.5361 14.4006C19.3573 14.5793 19.1295 14.701 18.8816 14.7503C18.6337 14.7996 18.3767 14.7742 18.1432 14.6775C17.9097 14.5807 17.7101 14.4169 17.5697 14.2067C17.4292 13.9966 17.3543 13.7495 17.3543 13.4967C17.3543 13.3288 17.3874 13.1626 17.4516 13.0075C17.5159 12.8524 17.6101 12.7115 17.7288 12.5928C17.8475 12.4741 17.9885 12.3799 18.1436 12.3157C18.2987 12.2515 18.4649 12.2185 18.6328 12.2186V12.2186ZM31.7578 12.2186C32.0106 12.2186 32.2577 12.2937 32.4678 12.4341C32.6779 12.5746 32.8417 12.7743 32.9384 13.0078C33.035 13.2414 33.0603 13.4984 33.0109 13.7463C32.9616 13.9942 32.8398 14.2219 32.6611 14.4006C32.4823 14.5793 32.2545 14.701 32.0066 14.7503C31.7587 14.7996 31.5017 14.7742 31.2682 14.6775C31.0347 14.5807 30.8351 14.4169 30.6947 14.2067C30.5542 13.9966 30.4793 13.7495 30.4793 13.4967C30.4793 13.3288 30.5124 13.1626 30.5766 13.0075C30.6409 12.8524 30.7351 12.7115 30.8538 12.5928C30.9725 12.4741 31.1135 12.3799 31.2686 12.3157C31.4237 12.2515 31.5899 12.2185 31.7578 12.2186V12.2186ZM38.4055 23.6367C38.6582 23.6368 38.9053 23.7118 39.1155 23.8522C39.3257 23.9927 39.4895 24.1923 39.5862 24.4259C39.6829 24.6594 39.7082 24.9164 39.6588 25.1643C39.6095 25.4122 39.4877 25.64 39.309 25.8187C39.1302 25.9974 38.9025 26.1191 38.6546 26.1684C38.4066 26.2177 38.1496 26.1924 37.9161 26.0957C37.6826 25.9989 37.483 25.8351 37.3425 25.6249C37.2021 25.4147 37.1271 25.1676 37.1271 24.9148C37.1272 24.5759 37.2619 24.2508 37.5016 24.0111C37.7414 23.7714 38.0665 23.6367 38.4055 23.6367V23.6367ZM11.985 23.6367C12.2377 23.6368 12.4848 23.7118 12.695 23.8522C12.9052 23.9927 13.0689 24.1923 13.1657 24.4259C13.2624 24.6594 13.2876 24.9164 13.2383 25.1643C13.189 25.4122 13.0672 25.64 12.8885 25.8187C12.7097 25.9974 12.482 26.1191 12.234 26.1684C11.9861 26.2177 11.7291 26.1924 11.4956 26.0957C11.2621 25.9989 11.0625 25.8351 10.922 25.6249C10.7816 25.4147 10.7066 25.1676 10.7066 24.9148C10.7066 24.747 10.7397 24.5808 10.8039 24.4257C10.8682 24.2706 10.9624 24.1297 11.0811 24.011C11.1998 23.8923 11.3407 23.7982 11.4958 23.7339C11.6509 23.6697 11.8171 23.6367 11.985 23.6367V23.6367ZM11.0475 15.7973C11.2497 15.7973 11.4475 15.8572 11.6156 15.9696C11.7838 16.082 11.9149 16.2417 11.9923 16.4286C12.0697 16.6155 12.0899 16.8211 12.0505 17.0195C12.011 17.2179 11.9136 17.4001 11.7705 17.5431C11.6275 17.6861 11.4452 17.7835 11.2469 17.823C11.0485 17.8624 10.8428 17.8421 10.656 17.7647C10.4691 17.6872 10.3094 17.5561 10.1971 17.3879C10.0847 17.2197 10.0248 17.022 10.0248 16.8197C10.0249 16.5485 10.1326 16.2885 10.3244 16.0967C10.5162 15.905 10.7763 15.7973 11.0475 15.7973V15.7973ZM11.0475 32.1576C11.2497 32.1576 11.4475 32.2176 11.6156 32.33C11.7838 32.4424 11.9149 32.6021 11.9923 32.789C12.0697 32.9758 12.0899 33.1815 12.0505 33.3799C12.011 33.5782 11.9136 33.7605 11.7705 33.9035C11.6275 34.0465 11.4452 34.1439 11.2469 34.1833C11.0485 34.2227 10.8428 34.2025 10.656 34.125C10.4691 34.0476 10.3094 33.9165 10.1971 33.7483C10.0847 33.5801 10.0248 33.3824 10.0248 33.1801C10.0249 32.9089 10.1326 32.6488 10.3244 32.4571C10.5162 32.2653 10.7763 32.1576 11.0475 32.1576V32.1576ZM39.343 32.1576C39.5452 32.1576 39.743 32.2176 39.9111 32.33C40.0793 32.4424 40.2104 32.6021 40.2878 32.789C40.3652 32.9758 40.3854 33.1815 40.346 33.3799C40.3065 33.5782 40.2091 33.7605 40.066 33.9035C39.923 34.0465 39.7407 34.1439 39.5424 34.1833C39.344 34.2227 39.1383 34.2025 38.9515 34.125C38.7646 34.0476 38.6049 33.9165 38.4926 33.7483C38.3802 33.5801 38.3203 33.3824 38.3203 33.1801C38.3204 32.9089 38.4281 32.6488 38.6199 32.4571C38.8117 32.2653 39.0718 32.1576 39.343 32.1576V32.1576ZM39.343 15.7973C39.5452 15.7973 39.743 15.8572 39.9111 15.9696C40.0793 16.082 40.2104 16.2417 40.2878 16.4286C40.3652 16.6155 40.3854 16.8211 40.346 17.0195C40.3065 17.2179 40.2091 17.4001 40.066 17.5431C39.923 17.6861 39.7407 17.7835 39.5424 17.823C39.344 17.8624 39.1383 17.8421 38.9515 17.7647C38.7646 17.6872 38.6049 17.5561 38.4926 17.3879C38.3802 17.2197 38.3203 17.022 38.3203 16.8197C38.3204 16.5485 38.4281 16.2885 38.6199 16.0967C38.8117 15.905 39.0718 15.7973 39.343 15.7973V15.7973ZM25.1953 7.61719C25.3976 7.61723 25.5953 7.67724 25.7634 7.78965C25.9316 7.90205 26.0626 8.06179 26.14 8.24867C26.2174 8.43556 26.2376 8.64118 26.1981 8.83955C26.1586 9.03792 26.0612 9.22012 25.9181 9.36311C25.7751 9.50611 25.5928 9.60347 25.3944 9.64289C25.196 9.68231 24.9904 9.66202 24.8036 9.58458C24.6167 9.50714 24.457 9.37603 24.3447 9.20783C24.2324 9.03964 24.1724 8.84191 24.1725 8.63965C24.1725 8.50534 24.1989 8.37236 24.2503 8.24828C24.3017 8.12421 24.3771 8.01147 24.4721 7.91652C24.5671 7.82157 24.6798 7.74626 24.8039 7.6949C24.928 7.64354 25.061 7.61714 25.1953 7.61719V7.61719ZM25.1953 40.3377C25.3976 40.3377 25.5953 40.3977 25.7634 40.5101C25.9316 40.6225 26.0626 40.7823 26.14 40.9691C26.2174 41.156 26.2376 41.3616 26.1981 41.56C26.1586 41.7583 26.0612 41.9405 25.9182 42.0835C25.7751 42.2266 25.5929 42.3239 25.3946 42.3634C25.1962 42.4028 24.9906 42.3826 24.8037 42.3051C24.6169 42.2277 24.4572 42.0967 24.3448 41.9285C24.2324 41.7603 24.1725 41.5626 24.1725 41.3604C24.1725 41.226 24.1989 41.093 24.2503 40.969C24.3017 40.8449 24.3771 40.7321 24.4721 40.6372C24.567 40.5422 24.6798 40.4669 24.8039 40.4155C24.928 40.3641 25.061 40.3377 25.1953 40.3377ZM34.2293 39.6561C34.3978 39.6561 34.5626 39.706 34.7027 39.7997C34.8429 39.8933 34.9521 40.0264 35.0166 40.1821C35.0811 40.3378 35.098 40.5091 35.0651 40.6744C35.0322 40.8397 34.951 40.9916 34.8319 41.1108C34.7127 41.2299 34.5608 41.3111 34.3955 41.344C34.2302 41.3769 34.0589 41.36 33.9032 41.2955C33.7475 41.231 33.6144 41.1218 33.5208 40.9816C33.4271 40.8415 33.3771 40.6767 33.3771 40.5082C33.3771 40.3963 33.3992 40.2855 33.442 40.1821C33.4848 40.0787 33.5476 39.9848 33.6267 39.9056C33.7059 39.8265 33.7998 39.7637 33.9032 39.7209C34.0066 39.6781 34.1174 39.6561 34.2293 39.6561V39.6561ZM16.1611 39.6561C16.3297 39.6561 16.4944 39.706 16.6346 39.7997C16.7747 39.8933 16.8839 40.0264 16.9484 40.1821C17.0129 40.3378 17.0298 40.5091 16.9969 40.6744C16.964 40.8397 16.8829 40.9916 16.7637 41.1108C16.6445 41.2299 16.4927 41.3111 16.3274 41.344C16.1621 41.3769 15.9907 41.36 15.835 41.2955C15.6793 41.231 15.5462 41.1218 15.4526 40.9816C15.359 40.8415 15.309 40.6767 15.309 40.5082C15.309 40.3963 15.331 40.2855 15.3738 40.1821C15.4167 40.0787 15.4794 39.9848 15.5586 39.9056C15.6377 39.8265 15.7316 39.7637 15.835 39.7209C15.9384 39.6781 16.0492 39.6561 16.1611 39.6561V39.6561ZM16.1611 8.64043C16.3297 8.64043 16.4944 8.69041 16.6346 8.78404C16.7747 8.87768 16.8839 9.01077 16.9484 9.16648C17.0129 9.32219 17.0298 9.49352 16.9969 9.65883C16.964 9.82413 16.8829 9.97597 16.7637 10.0951C16.6445 10.2143 16.4927 10.2955 16.3274 10.3284C16.1621 10.3612 15.9907 10.3444 15.835 10.2799C15.6793 10.2154 15.5462 10.1061 15.4526 9.966C15.359 9.82587 15.309 9.66112 15.309 9.49258C15.3089 9.3806 15.3308 9.26972 15.3736 9.16624C15.4164 9.06276 15.4792 8.96872 15.5583 8.88951C15.6374 8.8103 15.7314 8.74746 15.8348 8.70459C15.9383 8.66172 16.0492 8.63965 16.1611 8.63965V8.64043ZM34.2293 8.64043C34.3978 8.64043 34.5626 8.69041 34.7027 8.78404C34.8429 8.87768 34.9521 9.01077 35.0166 9.16648C35.0811 9.32219 35.098 9.49352 35.0651 9.65883C35.0322 9.82413 34.951 9.97597 34.8319 10.0951C34.7127 10.2143 34.5608 10.2955 34.3955 10.3284C34.2302 10.3612 34.0589 10.3444 33.9032 10.2799C33.7475 10.2154 33.6144 10.1061 33.5208 9.966C33.4271 9.82587 33.3771 9.66112 33.3771 9.49258C33.377 9.3806 33.399 9.26972 33.4418 9.16624C33.4846 9.06276 33.5473 8.96872 33.6265 8.88951C33.7056 8.8103 33.7996 8.74746 33.903 8.70459C34.0065 8.66172 34.1173 8.63965 34.2293 8.63965V8.64043ZM43.093 24.1482C43.2615 24.1482 43.4263 24.1982 43.5664 24.2919C43.7066 24.3855 43.8158 24.5186 43.8803 24.6744C43.9448 24.8301 43.9616 25.0015 43.9287 25.1668C43.8958 25.3321 43.8146 25.4839 43.6954 25.6031C43.5762 25.7223 43.4243 25.8034 43.259 25.8362C43.0936 25.8691 42.9223 25.8521 42.7666 25.7876C42.6109 25.723 42.4778 25.6137 42.3842 25.4735C42.2907 25.3333 42.2407 25.1686 42.2408 25C42.2408 24.8881 42.2629 24.7773 42.3057 24.6739C42.3485 24.5705 42.4113 24.4766 42.4904 24.3974C42.5695 24.3183 42.6635 24.2555 42.7669 24.2127C42.8702 24.1699 42.9811 24.1479 43.093 24.1479V24.1482ZM7.29746 24.1482C7.46602 24.1482 7.63079 24.1982 7.77093 24.2919C7.91107 24.3855 8.02029 24.5186 8.08478 24.6744C8.14927 24.8301 8.16612 25.0015 8.13321 25.1668C8.10029 25.3321 8.0191 25.4839 7.89988 25.6031C7.78067 25.7223 7.62879 25.8034 7.46347 25.8362C7.29814 25.8691 7.12679 25.8521 6.97109 25.7876C6.81539 25.723 6.68232 25.6137 6.58874 25.4735C6.49515 25.3333 6.44524 25.1686 6.44531 25C6.44531 24.8881 6.46735 24.7773 6.51018 24.6739C6.553 24.5705 6.61577 24.4766 6.6949 24.3974C6.77403 24.3183 6.86797 24.2555 6.97136 24.2127C7.07475 24.1699 7.18556 24.1479 7.29746 24.1479V24.1482Z" fill="white"/>
                                    </svg> */}
                                </div>
                                <div className="col">
                                    <h1>Total Litecoin Received</h1>
                                    {loadingData ? <div class="lds-dual-ring"></div> : <p>{ADARewards} Litecoin </p>}
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* <div className="row info-row">
                        <div className="info-col col-4 col-md-12 col-sm-12">
                            <div className="info">
                                <div className="icon-container icon-container-pink">
                                    <svg className="info-icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.3446 17.6493L16.1617 14.5122V8.12187C16.1617 7.47934 15.6423 6.95996 14.9998 6.95996C14.3573 6.95996 13.8379 7.47934 13.8379 8.12187V15.0932C13.8379 15.4592 14.0099 15.8043 14.3027 16.0228L18.9502 19.5085C19.1593 19.6653 19.4034 19.7408 19.6462 19.7408C20.0006 19.7408 20.3491 19.5816 20.5769 19.2749C20.9627 18.7624 20.8581 18.0339 20.3446 17.6493Z" fill="white"/>
                                        <path d="M15 0C6.7285 0 0 6.7285 0 15C0 23.2715 6.7285 30 15 30C23.2715 30 30 23.2715 30 15C30 6.7285 23.2715 0 15 0ZM15 27.6762C8.01123 27.6762 2.32377 21.9888 2.32377 15C2.32377 8.01123 8.01123 2.32377 15 2.32377C21.9899 2.32377 27.6762 8.01123 27.6762 15C27.6762 21.9888 21.9888 27.6762 15 27.6762Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="col">
                                    <h1>Last Payout Time</h1>
                                    {loadingData ? <div class="lds-dual-ring"></div> : <p id="lastPayout">{Connect || getAccount ? Math.abs(Math.floor(((LastPayoutTime - Math.floor(Date.now()/1000))/60/60))) : 0} HOURS AGO</p>}
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="row" id="ada-info">
                        <div className="info" id="adaAllRewards">
                            <img className="adaLogo" src={AdaLogo} />

                            <h1>Total <span>Litecoin</span> Paid to <b>Litechee</b> holders</h1>
                            <br/>
                            <p className="adaRewardsDol"><b>{totalADARewards} Litecoin</b></p>
                            <br/>
                            {/* {loadingData ? <div class="lds-dual-ring"></div> : <p className="adaRewardsDol">~$ {parseFloat(totalADARewards*AdaPrice).toFixed(2)}</p>} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}