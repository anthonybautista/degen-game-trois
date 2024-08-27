'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import logo from '/static/logo_thin.png';
import dynamic from 'next/dynamic'
const Wall = dynamic(() => import('../components/Wall'), { ssr: false })
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useContractEvent,
  useAccount, useContractRead,
} from 'wagmi'
import {gameAbi} from "../consts/abi";

const Home: NextPage = () => {
  const chain = 43114;
  const game = '0xB0Da95d4ea390E435584baACc3BA82F91A752a15';
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentBoard, setCurrentBoard] = useState(["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]);
  const [currentRemaining, setCurrentRemaining] = useState([]);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const { address } = useAccount();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const {refetch: refetchState} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'getGameState',
    chainId: chain,
    onSuccess(data: any) {
      let remaining: any = []
      data[0]?.forEach(num => {
        remaining.push(Number(num));
      })
      setCurrentRemaining(remaining);
      setCurrentBoard(data[1]);
      refetchTimestamp();
    },
  })

  const {refetch: refetchTimestamp} = useContractRead({
    address: game,
    abi: gameAbi,
    functionName: 'currentTimestamp',
    chainId: chain,
    onSuccess(data: any) {
      setCurrentTimestamp(Number(data) * 1000)
    },
  })

  const safeAddress = () => {
    return address ? address : '0x0000000000000000000000000000000000000000';
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Degen Game Trois</title>
        <meta
          content="Don't play this game."
          name="Degen Game Trois"
        />
        <link href="/static/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ToastContainer
          position="top-right"
          theme="dark"
        />

        {/*<div id="logo">*/}
        {/*  <Image*/}
        {/*    width={600}*/}
        {/*    height={209}*/}
        {/*    src={logo}*/}
        {/*    id="logo"*/}
        {/*    alt="Coq Blocks Logo"*/}
        {/*    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"*/}
        {/*  />*/}
        {/*</div>*/}

        <ConnectButton />

        <h3>Do not play this game unless you are a degen and do not care about losing money.</h3>

        {/*<a className={styles.fancyLink}*/}
        {/*  href="https://snowtrace.io/token/0x24bF871BEda962Dc98F6CF28726a85B60D0bc10C?chainId=43114#code"*/}
        {/*  target="_blank" rel="noopener noreferrer">Verified Contract</a>*/}

        <div className={styles.grid}>

          <div className={styles.canvasCard}>
            <p>Each square costs 0.5 AVAX</p>
            <p>Click on empty square to initiate transaction</p>
            <div>{ currentTimestamp > 0 ? new Date(currentTimestamp).toDateString() : 'Not started' }</div>

            <Wall
              board={currentBoard}
              game={game}
              chain={chain}
              // selectedBlock={selectedBlock === 'Select Block' ? 100 : selectedBlock}
              toast={toast}
              address={address}
              remaining={currentRemaining}
              refetchState={refetchState}
            />
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://smolrun.com" rel="noopener noreferrer" target="_blank">
          <Image
            src="/static/smolrun.png"
            width={200}
            height={200}
            alt="Smolrun Logo"
          />
        </a>
      </footer>
    </div>
  );
};

export default Home;
