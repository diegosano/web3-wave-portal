import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import wavePortalContractABI from './utils/WavePortal.json';

import styles from './App.module.css';

const CONTRACT_ADDRESS = '0x4a68071aFAd0131C23f1fe9D1B4E0d9f3D9c2B46';
const CONTRACT_ABI = wavePortalContractABI.abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (
        !accounts ||
        !Array.isArray(accounts) ||
        (Array.isArray(accounts) && !accounts.length)
      ) {
        console.log('No authorized account found');
        return;
      }

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      setIsLoading(true);

      const { ethereum } = window;

      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      let count = await wavePortalContract.getTotalWaves();
      console.log('Retrieved total wave count...', count.toNumber());

      const waveTxn = await wavePortalContract.wave();
      console.log("Mining...", waveTxn.hash);

      
      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dataContainer}>
        <div className={styles.header}>👋 Hey there!</div>

        <div className={styles.bio}>
          I am Diego Sano, and I am learning Web 3.0 and Solidity, that's pretty
          cool right? Connect your Ethereum wallet and wave at me!
        </div>

        {currentAccount ? (
          <button className={styles.waveButton} onClick={wave}>
            Wave at Me
          </button>
        ) : (
          <button className={styles.waveButton} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
