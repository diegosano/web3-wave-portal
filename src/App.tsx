import { ethers } from 'ethers';

import styles from './App.module.css';

export default function App() {
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
