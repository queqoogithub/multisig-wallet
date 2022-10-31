import { useEffect, useState } from "react";
import { submitSendTokenTx, getTokenBalance } from "./utils/interact.js";

const Submit = (props) => {

    const [status, setStatus] = useState(""); // a message to display at the bottom of the UI
    const [indexCount, setIndexCount] = useState("");
    const [token, setToken] = useState(""); // a string that stores the NFT's name
    const [to, setTo] = useState(""); // a string that stores the NFT's description
    const [amount, setAmount] = useState(); // a string that is a link to the NFT's digital asset
    
    const [tokenBalance, setTokenBalance] = useState();

    const popBalance = async (address) => {
       const { balance } = await getTokenBalance(address);
       setTokenBalance(balance);
    }

    const onSendTokenTxPressed = async () => { //TODO: implement ->  this function will be called to mint the user's NFT.
        const { status, index_count } = await submitSendTokenTx(token, to, amount, 'sendToken');
        setStatus(status);
        setIndexCount(index_count);
    };

    return (
        <div className="Minter">
            <h1 id="title">BDEV Multisig Wallet</h1>
            <p>
                Simply add token address, to, and amount, then press "Submit Tx"
            </p>
            <form>
                <h2> Token Address: </h2>
                <input
                    type="text"
                    placeholder="e.g. ERC20 Token"
                    onChange={(event) => { setToken(event.target.value) ; popBalance(event.target.value)}}
                />
                {tokenBalance? (<p id="status"> Balance: {tokenBalance} wie </p>): ""}
                <h2> To: </h2>
                <input
                    type="text"
                    placeholder="e.g. Reciepian Address"
                    onChange={(event) => setTo(event.target.value)}
                />
                <h2> Amount: </h2>
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
            </p>
            <p id="status">
                {indexCount}
            </p>
            {/* TODO: Message box -> Recheck Tx index: Tx info with frontend (submit input)  */}
        </div>
    );
}

export default Submit;