import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, getSendTokenTxInfo } from "./utils/interact.js";

import Submit from './Submit'
import Confirm from './Confirm'
import Execute from './Execute'
import Info from "./Info";

const SendToken = (props) => {

  // State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState(""); // a message to display at the bottom of the UI
  // const [token, setToken] = useState(""); // a string that stores the NFT's name
  // const [amount, setAmount] = useState(); // a string that is a link to the NFT's digital asset

  useEffect(async () => { //TODO: implement
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);

    addWalletListener();
  }, []); // empty [] meaning -> it will only be called on the component's first render -> Here we'll call our wallet listener and another wallet function to update our UI to reflect whether a wallet is already connected.

  const connectWalletPressed = async () => { //TODO: implement ->  this function will be called to connect the user's Metamask wallet to our dApp.
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>

      <Submit/>
      <Confirm/>
      <Execute/>
      <Info/>
      {/* <h1 id="title">🧙🏼‍♀️ BDEV Multisig Wallet</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>💩 Token Address: </h2>
        <input
          type="text"
          placeholder="e.g. ERC20 Token"
          onChange={(event) => setToken(event.target.value)}
        />
        <h2>🤔 To: </h2>
        <input
          type="text"
          placeholder="e.g. Reciepian Address"
          onChange={(event) => setTo(event.target.value)}
        />
        <h2>💵 Amount: </h2>
        <input
          type="number"
          placeholder="e.g. in Wie (10^18 Wie = 1 Ether)"
          onChange={(event) => setAmount(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onSendTokenTxPressed}>
        Submit Tx
      </button>
      <p id="status">
        {status}
      </p> */}
    </div>
  );
  
};

export default SendToken;
