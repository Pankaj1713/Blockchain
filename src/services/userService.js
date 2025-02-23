import axios from "axios";

let users = [];

const rpcUrl = process.env.BTC_FLASH_RPC_URL
const walletName = process.env.BTC_FLASH_WALLET_NAME
export const getUsers = () => users;

export const addUser = (user) => {
    users.push(user);
    return user;
};

export const getNewAddress = async () => {
 
        try {
          const response = await axios.post(
            rpcUrl,
            {
              jsonrpc: '1.0',
              id: 'curltest',
              method: 'getnewaddress',
              params: [walletName],
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.data.error) {
            return null
          }
          return response.data.result;
        } catch (error) {
          console.error('Error getting new address:', error.response ? error.response.data : error.message);
          return null
        }
};

export const getAddressBalance = async (address)=> {
    try {
      const response = await axios.post(
        rpcUrl,
        {
          jsonrpc: '1.0',
          id: 'curltest',
          method: 'listunspent',
          params: [0, 9999999, [address]], 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const unspentOutputs = response.data.result;
      let balance = 0;
      unspentOutputs.forEach(output => {
        balance += output.amount;
      });

      console.log({balance});
  
      return balance
    } catch (error) {
      console.error('Error checking address balance:', error.message);
      return null
    }
  }