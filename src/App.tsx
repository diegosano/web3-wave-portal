import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import styles from './App.module.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log('Make sure you have metamask!');
          return;
        }

        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (
          !accounts ||
          !Array.isArray(accounts) ||
          (Array.isArray(accounts) && !accounts.length)
        ) {
          console.log('No authorized account found');
          return;
        }

        const account = accounts[0];
        setCurrentAccount(account);
        console.log('Found an authorized account:', account);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const wave = () => {};

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dataContainer}>
        <div className={styles.header}>👋 Hey there!</div>

        <div className={styles.bio}>
          I am Diego Sano, and I am learning Web 3.0 and Solidity, that's pretty
          cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className={styles.waveButton} onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
