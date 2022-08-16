import { useCallback, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';

import wavePortalContractABI from './utils/WavePortal.json';

import styles from './App.module.css';
import { Loader } from './components/Loader';
import { Wave } from './components/Wave';

const CONTRACT_ADDRESS = '0x882F41f098009d1eA5c4490041EFDb0231d8F60a';
const CONTRACT_ABI = wavePortalContractABI.abi;
const MILLISECONDS = 1000;

export interface IWave {
  address: string;
  timestamp: Date;
  message: string;
}

interface SmartContractWave {
  message: string;
  timestamp: number;
  waver: string;
}

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [allWaves, setAllWaves] = useState<IWave[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageInput = useRef<HTMLInputElement>(null);

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
        await getAllWaves();
        console.log('Found an authorized account:', account);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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

      const message = messageInput?.current?.value;

      const waveTxn = await wavePortalContract.wave(message);
      console.log('Mining...', waveTxn.hash);

      await waveTxn.wait();
      console.log('Mined -- ', waveTxn.hash);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllWaves = useCallback(async () => {
    try {
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

      const waves: SmartContractWave[] = await wavePortalContract.getAllWaves();

      const formattedWaves = waves.map((wave) => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * MILLISECONDS),
          message: wave.message,
        };
      });

      setAllWaves(formattedWaves);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const renderButton = useCallback(() => {
    if (currentAccount) {
      return (
        <>
          <input
            type="text"
            placeholder="Leave me a message"
            ref={messageInput}
            className={styles.waveInput}
            required
          />

          <button className={styles.waveButton} onClick={wave}>
            Wave at Me
          </button>
        </>
      );
    }

    return (
      <button className={styles.waveButton} onClick={connectWallet}>
        Connect Wallet
      </button>
    );
  }, [currentAccount]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dataContainer}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1 className={styles.header}>👋 Hey there!</h1>

            <div className={styles.bio}>
              My name is{' '}
              <a href="https://www.linkedin.com/in/diego-sano/" target="_blank">
                Diego Sano
              </a>
              , and I am learning Web 3.0 and Solidity, that's pretty cool
              right? Connect your Ethereum wallet and wave at me!
            </div>

            {renderButton()}

            <div className={styles.waveList}>
              <h2> Wave history </h2>
              {allWaves.map((wave) => (
                <Wave
                  key={wave.timestamp.getTime()}
                  message={wave.message}
                  publishedAt={wave.timestamp}
                  address={wave.address}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
