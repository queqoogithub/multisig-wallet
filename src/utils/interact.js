import {pinJSONToIPFS} from './pinata.js'
import Web3 from 'web3';

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
//const web3 = createAlchemyWeb3(alchemyKey); // alchemy-web3 ไม่มี methods.Contract_Get_Function(args).call()
const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/4695172c81c2421a87212d4e0980c680');

const contractABI = require('../contract-abi.json')
const contractAddress = "0xc9b9AD59585aeB502D1227dA496272582165Ec4B"; // owner is que address

const multisigContractABI = require('../simple-multisig-wallet-contract-abi.json') // POC_MULTISIG_ADDRESS 
const multisigContractAddress = "0xeACb83baA3E9426634EAD8fA93Cf922544866728"; // ["0xF54CfCf35A9A01AE30FCc5c58C13ef761db56d18", "0xdC147A1C62C2C83C8E2f6688706376269A346B02", "0xa0993817cdeaBC68B506b7972eB2BbA0D739A4aC"], 2

const sendTx = async (transactionParameters) => {
    try {
        const txHash = await window.ethereum.request({method: 'eth_sendTransaction', params: [transactionParameters],});
        // todo ... check tx -> waiting until finish !
        await checkTx(txHash);
        return {
            success: true, 
            status: "✅ Check out your transaction on Etherscan: https://kovan.etherscan.io/tx/" + txHash}
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

const checkTx = async (hash) => {
    // Log which tx hash we're checking
    console.log("Waiting for tx " + hash)

    // Set interval to regularly check if we can get a receipt
    let interval = setInterval(() => {

        web3.eth.getTransactionReceipt(hash, (err, receipt) => {

            // If we've got a receipt, check status and log / change text accordingly
            if (receipt) {
                
                console.log("Gotten receipt")
                if (receipt.status === true) {
                    console.log(receipt)
                } else if (receipt.status === false) {
                    console.log("Tx failed")
                }

                // Clear interval
                clearInterval(interval)
            }
        })
    }, 1000)
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({ //  Calling this function will open up Metamask in the browser
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({ // which simply returns an array containing the Metamask addresses currently connected to our dApp.
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

// TODO: export sendToken -> 1. submit fucntion 2. confirm function 3. exe fucntion 
export const submitSendTokenTx = async (token, to, amount, mode) => {
    //load smart contract
    window.contract = await new web3.eth.Contract(multisigContractABI, multisigContractAddress);
    const transactionParameters = {
        to: multisigContractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.submitSendTokenTx(token, to, amount).encodeABI() //make call to 721 smart contract
    }

    const { status } = await sendTx(transactionParameters);
    const index_count = await window.contract.methods.getTxCount(1).call();
    console.log('index ccount ---> ', index_count)
    console.log('status --> ', status)
    return { status: status, index_count: "🆔 Tx index count = " + index_count + " (Please makesure with Tx info again)" }

    // try {
    //     const txHash = await window.ethereum.request({method: 'eth_sendTransaction', params: [transactionParameters],});
    //     return {success: true, status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash}
    // } catch (error) {
    //     return {
    //         success: false,
    //         status: "😥 Something went wrong: " + error.message
    //     }
    // }
}

export const callTxCount = async() => {
    window.contract = await new web3.eth.Contract(multisigContractABI, multisigContractAddress);
    
    const index_count = await window.contract.methods.getTxCount(1).call();
    console.log('indexxxxxx -----> ', index_count)
}

// NOTE: function confirm ใน js สามารถ re-use ได้ แต่ใน sol ไม่ควร เพราะจะทำให้ต้องเพิ่ม parameter เข้าไปใน function
export const confirmSendTokenTx = async (index) => {
    //load smart contract
    window.contract = await new web3.eth.Contract(multisigContractABI, multisigContractAddress);
    const transactionParameters = {
        to: multisigContractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.confirmSendTokenTx(index).encodeABI() //make call to 721 smart contract
    }

    const { status } = await sendTx(transactionParameters);
    return { status: status }
}

export const executeSendTokenTx = async (indexes) => {
    var indexes = indexes;
    //var selectedTxIndexList = [indexes];
    var selectedTxIndexList = JSON.parse("[" + indexes + "]");
    console.log('index list --> ', selectedTxIndexList)
    //load smart contract
    window.contract = await new web3.eth.Contract(multisigContractABI, multisigContractAddress);
    const transactionParameters = {
        to: multisigContractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.batchExeSendTokenTx(selectedTxIndexList).encodeABI() //make call to 721 smart contract
    }

    const { status } = await sendTx(transactionParameters);
    return { status: status }
}

export const getSendTokenTxInfo = async (index) => {
    window.contract = await new web3.eth.Contract(multisigContractABI, multisigContractAddress);
    try {
        const info = await window.contract.methods.getSendTokenTxInfo(index).call();
        return { status: "",
                 token_address: "Token: " + info[0], 
                 to_address: "Recipient: " + info[1], 
                 amount: "Amount: " + info[2] + "", 
                 executed: "Executed: " + info[3], 
                 confirmed: "Confirmed: " + info[4] 
        }
    } catch (error) {
        return { status: "😥 Something went wrong: " + error.message,
                 token_address: "", 
                 to_address: "", 
                 amount: "", 
                 executed: "", 
                 confirmed: "" 
        }
    }  
}

export const getTokenBalance = async (address) => {
    window.contract = await new web3.eth.Contract(multisigContractABI, multisigContractAddress);
    try {
        const balance = await window.contract.methods.balanceOf(address).call();
        console.log('balance ====> ', balance)
        return { balance: balance}
    } catch (error) {
        return { status: "😥 Something went wrong: " + error.message }
    } 
}


