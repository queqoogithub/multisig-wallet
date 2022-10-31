import { useEffect, useState } from "react";
import { confirmSendTokenTx } from "./utils/interact.js";

const Confirm = (props) => {

    const [status, setStatus] = useState("");
    const [index, setIndex] = useState("");

    const onConfirmSendTokenTxPressd = async () => {
        const { status } = await confirmSendTokenTx(index);
        setStatus(status);
    }

    return (
        <div className="Minter">
            <form>
            <h2> TX Index to Confirm: </h2>
                <input
                    type="number"
                    placeholder="e.g. Place Index that you wanna operate"
                    onChange={(event) => setIndex(event.target.value)}
                />
            </form>
            <button id="mintButton" onClick={onConfirmSendTokenTxPressd}>
                Confirm Tx
            </button>
            <p id="status">
                {status}
            </p>
        </div>
    );
}

export default Confirm;