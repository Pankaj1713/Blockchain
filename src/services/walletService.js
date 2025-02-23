import axios from "axios";


const rpcUrl = process.env.BTC_FLASH_RPC_URL

export const generateBlock = async (blockAddress)=> {
    try {
        const response = await axios.post(
          rpcUrl,
          {
            jsonrpc: '1.0',
            id: 'curltest',
            method: 'generatetoaddress',
            params: [1, blockAddress],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data.result) {
          console.log(`Blocks generated: ${response.data.result}`);
        } else {
          console.error('Block generation failed:', response.data.error);
        }
      } catch (error) {
        console.error('Error generating blocks:', error.message);
      }
  }