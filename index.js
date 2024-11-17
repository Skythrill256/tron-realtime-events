const axios = require('axios');

const url = 'https://go.getblock.io/656fc9e461c84f32882ef0407baa6e22/jsonrpc';

async function sendRequest(method, params = []) {
  try {
    const response = await axios.post(url, {
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.data && response.data.result !== undefined) {
      return response.data.result;
    } else {
      console.error(`Error in ${method}:`, response.data.error || "No result found");
      return null;
    }
  } catch (error) {
    console.error(`Error in ${method}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

async function fetchData() {
  console.log("Fetching data...");

  const latestBlock = await sendRequest("eth_getBlockByNumber", ["latest", true]);
  console.log("Latest Block:", latestBlock);

  const gasPrice = await sendRequest("eth_gasPrice");
  console.log("Current Gas Price:", gasPrice);

  const chainId = await sendRequest("eth_chainId");
  console.log("Chain ID:", chainId);

  const estimatedGas = await sendRequest("eth_estimateGas", [{
    from: "0x7b579b04b8e70a827ea55cbc0b6d3a09447dd802",
    to: "0xeae2c6bd6bf70163fa6b2f1d997e50c0bc470a4d",
    value: "0x0",
    data: "0x"
  }]);
  console.log("Estimated Gas:", estimatedGas);

  const balance = await sendRequest("eth_getBalance", ["0x7b579b04b8e70a827ea55cbc0b6d3a09447dd802", "latest"]);
  console.log("Balance:", balance);

  const blockByHash = await sendRequest("eth_getBlockByHash", ["0x0000000003ff7870773d4625b514cb331fb942d93d52069fc7464645f8c2cfab", true]);
  console.log("Block By Hash:", blockByHash);

  const transactionByHash = await sendRequest("eth_getTransactionByHash", ["0xb65d41127fd547cf8db3f26ba819ffe93e507347153a9f1ced351390528047ef"]);
  console.log("Transaction By Hash:", transactionByHash);
}

setInterval(fetchData, 5000);
