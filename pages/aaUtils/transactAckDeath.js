import {ethers} from 'ethers';

export async function transactAckDeath(contractAddress) {
  // Check if MetaMask is installed
  debugger
  if (typeof window.ethereum !== 'undefined') {
    // Create an instance of the ethers.js library
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Request access to the user's MetaMask account
    await provider.send('eth_requestAccounts', []);
    // Get the signer from the provider
    const signer = provider.getSigner();
    // Set the contract address and ABI
    const contractABI = [
      {
        inputs: [
          {
            internalType: 'bool',
            name: 'ack',
            type: 'bool',
          },
        ],
        name: 'ackDeath',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    // Create a new instance of the contract
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // Call the ackDeath function with true as an argument
    const res = await contract.ackDeath(true);
    debugger
    console.log(res);
  } else {
    console.log('MetaMask is not installed');
  }
}
