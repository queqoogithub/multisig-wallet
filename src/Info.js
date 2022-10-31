import { useEffect, useState } from "react";
import { getSendTokenTxInfo } from "./utils/interact.js";

const Info = (props) => {

    const [index, setIndex] = useState("");
    const [status, setStatus] = useState("");
    const [token, setToken] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [executed, setExecutened] = useState("");
    const [confirmed, setConfrimed] = useState("");

    const onConfirmSendTokenTxPressd = async () => {
        const { status, token_address, to_address, amount, executed, confirmed } = await getSendTokenTxInfo(index);
        setStatus(status);
        setToken(token_address);
        setTo(to_address);
        setAmount(amount);
        setExecutened(executed);
        setConfrimed(confirmed);
    }

    return (
        <div className="Minter">
            <form>
            <h2> Check TX Index Info: </h2>
                <input
                    type="number"
                    placeholder="e.g. Place Index that you wanna info "
                    onChange={(event) => setIndex(event.target.value)}
                />
            </form>
            <button id="mintButton" onClick={onConfirmSendTokenTxPressd}>
                Check Tx
            </button>
            { status ? <p> {status} </p> : 
                    (<>
                        <p id="status"> {token} </p>
                        <p id="status"> {to} </p>
                        <p id="status"> {amount} </p>
                        <p id="status"> {executed} </p>
                        <p id="status"> {confirmed} </p>
                    </>) 
            }
        </div>
    );
}

export default Info;