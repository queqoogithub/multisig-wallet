import { useEffect, useState } from "react";
import { executeSendTokenTx } from "./utils/interact.js";

const Execute = (props) => {

    const [status, setStatus] = useState("");
    const [indexes, setIndexes] = useState("");

    const onExecuteSendTokenTxPressd = async () => {
        const { status } = await executeSendTokenTx(indexes);
        setStatus(status);
    }

    return (
        <div className="Minter">
            <form>
            <h2> Selected TX Index to Execute: </h2>
                <input
                    type="text"
                    placeholder="e.g. Place selected index in form Ex. 2,0 for group or 3 for one"
                    onChange={(event) => setIndexes(event.target.value)}
                />
            </form>
            <button id="mintButton" onClick={onExecuteSendTokenTxPressd}>
                Execute Tx
            </button>
            <p id="status">
                {status}
            </p>
        </div>
    );
}

export default Execute;