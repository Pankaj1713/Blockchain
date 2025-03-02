import axios from "axios";

const rpcUrl = process.env.BTC_FLASH_RPC_URL;
const rpcUser = process.env.RPC_USER;
const rpcPassword = process.env.RPC_PASSWORD;
const walletName = process.env.BTC_FLASH_WALLET_NAME;

export async function sendManyByAddress(sender, recipients) {
    console.log({sender, recipients});
    try {
        const utxoResponse = await axios.post(
            `${rpcUrl}/wallet/${walletName}`,
            {
                jsonrpc: "1.0",
                id: "listunspent",
                method: "listunspent",
                params: [1, 9999999, [sender]],
            },
            {
                auth: { username: rpcUser, password: rpcPassword },
                headers: { "Content-Type": "application/json" },
            }
        );

        const utxos = utxoResponse.data.result;
        if (!utxos.length) {
            return { data: "No UTXOs available", success: false };
        }

        let selectedUtxos = [];
        let totalInputAmount = 0;
        const totalOutputAmount = Object.values(recipients).reduce((sum, value) => sum + parseFloat(value), 0);

        for (let utxo of utxos) {
            selectedUtxos.push({ txid: utxo.txid, vout: utxo.vout });
            totalInputAmount += utxo.amount;
            if (totalInputAmount >= totalOutputAmount) break;
        }

        if (totalInputAmount < totalOutputAmount) {
            return { data: "Insufficient balance", success: false };
        }

        const fee = 2;
        const change = totalInputAmount - totalOutputAmount - fee;
        if (change > 0) {
            recipients[sender] = (recipients[sender] || 0) + change;
        }

        console.log("chnage: ", change);

        const rawTxResponse = await axios.post(
            `${rpcUrl}/wallet/${walletName}`,
            {
                jsonrpc: "1.0",
                id: "createrawtransaction",
                method: "createrawtransaction",
                params: [selectedUtxos, recipients],
            },
            {
                auth: { username: rpcUser, password: rpcPassword },
                headers: { "Content-Type": "application/json" },
            }
        );
console.log({rawTxResponse});
        const rawTx = rawTxResponse.data.result;
        const signedTxResponse = await axios.post(
            `${rpcUrl}/wallet/${walletName}`,
            {
                jsonrpc: "1.0",
                id: "signrawtransactionwithwallet",
                method: "signrawtransactionwithwallet",
                params: [rawTx],
            },
            {
                auth: { username: rpcUser, password: rpcPassword },
                headers: { "Content-Type": "application/json" },
            }
        );

        const signedTx = signedTxResponse.data.result.hex;
        const sendTxResponse = await axios.post(
            `${rpcUrl}/wallet/${walletName}`,
            {
                jsonrpc: "1.0",
                id: "sendrawtransaction",
                method: "sendrawtransaction",
                params: [signedTx],
            },
            {
                auth: { username: rpcUser, password: rpcPassword },
                headers: { "Content-Type": "application/json" },
            }
        );
console.log({sendTxResponse});
        const txid = sendTxResponse.data.result;
        return { data: txid, success: true };
    } catch (error) {
        return { data: error.response ? error.response.data : error.message, success: false };
    }
}
