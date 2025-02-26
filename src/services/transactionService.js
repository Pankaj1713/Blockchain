import axios from "axios";

const rpcUrl = process.env.BTC_FLASH_RPC_URL;
const RPC_USER = process.env.RPC_USER;
const RPC_PASSWORD = process.env.RPC_PASSWORD;
const senderAddress = process.env.BTC_OWNER_ADDRESS;

export const sendBitcoin = async (amount, recipientAddresses) => {
    try {
        const utxoResponse = await axios.post(
            rpcUrl,
            {
                jsonrpc: "1.0",
                id: "listutxos",
                method: "listunspent",
                params: [1, 9999999, [senderAddress]], 
            },
            {
                auth: { username: RPC_USER, password: RPC_PASSWORD },
                headers: { "Content-Type": "application/json" },
            }
        );

        const utxos = utxoResponse.data.result;
        if (!utxos.length) return { error: "No UTXOs available for sender", success: false };

        let selectedUtxos = [];
        let totalInputAmount = 0;
        for (let utxo of utxos) {
            selectedUtxos.push({ txid: utxo.txid, vout: utxo.vout });
            totalInputAmount += utxo.amount;
            if (totalInputAmount >= parseFloat(amount) * recipientAddresses.length) break;
        }

        if (totalInputAmount < parseFloat(amount) * recipientAddresses.length) {
            return { error: "Insufficient balance", success: false };
        }

        const outputs = {};
        recipientAddresses.forEach((address) => {
            outputs[address] = parseFloat(amount);
        });

        const totalOutputAmount = parseFloat(amount) * recipientAddresses.length;
        const change = totalInputAmount - totalOutputAmount;
        if (change > 0) {
            outputs[senderAddress] = change; 
        }

        const rawTxResponse = await axios.post(
            rpcUrl,
            {
                jsonrpc: "1.0",
                id: "createrawtransaction",
                method: "createrawtransaction",
                params: [selectedUtxos, outputs],
            },
            {
                auth: { username: RPC_USER, password: RPC_PASSWORD },
                headers: { "Content-Type": "application/json" },
            }
        );

        const rawTx = rawTxResponse.data.result;

        const signedTxResponse = await axios.post(
            rpcUrl,
            {
                jsonrpc: "1.0",
                id: "signrawtransactionwithwallet",
                method: "signrawtransactionwithwallet",
                params: [rawTx],
            },
            {
                auth: { username: RPC_USER, password: RPC_PASSWORD },
                headers: { "Content-Type": "application/json" },
            }
        );

        const signedTx = signedTxResponse.data.result.hex;

        const sendTxResponse = await axios.post(
            rpcUrl,
            {
                jsonrpc: "1.0",
                id: "sendrawtransaction",
                method: "sendrawtransaction",
                params: [signedTx],
            },
            {
                auth: { username: RPC_USER, password: RPC_PASSWORD },
                headers: { "Content-Type": "application/json" },
            }
        );

        const txid = sendTxResponse.data.result;
        return { data:txid, success: true };

    } catch (error) {
        return { data: error.message, success: false };
    }
};
