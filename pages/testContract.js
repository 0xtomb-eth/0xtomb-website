import React from 'react';
import { ethers } from 'ethers';
import {
  getVerifyingPaymaster,
  getSimpleAccount,
  getGasFee,
  printOp,
  getHttpRpcClient,
  ERC20_ABI,
} from '../src';
import { getWebSimpleAccount } from './aaUtils/getWebSimpleAccount';
import WILL_CONTRACT from './aaUtils/willAbi.json';
import { config } from './aaUtils/config';

// https://node.stackup.sh/v1/rpc/62cf70c33d4cfac79cb844edf79d4afbb5056d7d6901d47669e29e344e10190a
// const config = {
//   bundlerUrl:
//     'https://node.stackup.sh/v1/rpc/62cf70c33d4cfac79cb844edf79d4afbb5056d7d6901d47669e29e344e10190a',
//   rpcUrl:
//     'https://node.stackup.sh/v1/rpc/62cf70c33d4cfac79cb844edf79d4afbb5056d7d6901d47669e29e344e10190a',
//   entryPoint: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
//   simpleAccountFactory: '0x71D63edCdA95C61D6235552b5Bc74E32d8e2527B',
//   // simpleAccountFactory: '0x7Bcf6f55E7136960A5602d6AB6bc163C7D7C4902',
// };

/* * 
test ERC20: 0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e
test ERC20: 0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1
*/
async function seWillAllocation() {
// tkn: string,
// t: Array<string>,
const accountAPI = await getWebSimpleAccount(
  config.rpcUrl,
  config.entryPoint,
  config.simpleAccountFactory
  );
  // if use metamask provider
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const willAddress = ethers.utils.getAddress(accountAPI.getCounterFactualAddress());
  const wililbase = new ethers.Contract(willAddress, WILL_CONTRACT, provider);
  wililbase.interface.encodeFunctionData('setAllocation', [

  ])
  let dest = [];
  let data = [];
  // debugger;
  const sender = await accountAPI.getCounterFactualAddress();
  let p = transfer20Info.map(async ({ tkn, t, amt }) => {
    const token = ethers.utils.getAddress(tkn);
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const [symbol, decimals] = await Promise.all([
      erc20.symbol(),
      erc20.decimals(),
    ]);

    const amount = ethers.utils.parseUnits(amt, decimals);
    // UserOperation Destination(contract addr)
    dest = [...dest, erc20.address];

    data = [
      ...data,
      erc20.interface.encodeFunctionData('transfer', [
        ethers.utils.getAddress(t),
        amount,
      ]),
    ];
    console.log(
      `Batch transferring ${amt} ${symbol} to ${ethers.utils.getAddress(t)}`
    );
  });
  await Promise.all(p);
  let msg = '';
  const ac = await accountAPI._getAccountContract();
  const op = await accountAPI.createSignedUserOp({
    target: sender,
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);
  msg += `Signed UserOperation: ${await printOp(op)}`;

  const client = await getHttpRpcClient(
    provider,
    config.bundlerUrl,
    config.entryPoint
  );

  const uoHash = await client.sendUserOpToBundler(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await accountAPI.getUserOpReceipt(uoHash);
  msg += '\n' + `Transaction hash: ${txHash}`;
  console.log(`Transaction hash: ${txHash}`);
  return msg;
}
/*
*!    async _getAccountContract() {
*!        if (this.accountContract == null) {
*!            this.accountContract = contracts_1.SimpleAccount__factory.connect(await this.getAccountAddress(), this.provider);
*!        }
*!        return this.accountContract;
*!    }
*!     SimpleAccount__factory.connect = function (address, signerOrProvider) {
*!        return new ethers_1.Contract(address, _abi, signerOrProvider);
*!   };
*! 
*! 
*! 
*! 
*! 
*/
/* * 
test ERC20: 0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e
test ERC20: 0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1
*/
async function batchTransferERC20(
  // tkn: string,
  // t: Array<string>,
  transfer20Info
) {
  const accountAPI = await getWebSimpleAccount(
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory
  );
  // if use metamask provider
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

  let dest = [];
  let data = [];
  // debugger;
  const sender = await accountAPI.getCounterFactualAddress();
  let p = transfer20Info.map(async ({ tkn, t, amt }) => {
    const token = ethers.utils.getAddress(tkn);
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const [symbol, decimals] = await Promise.all([
      erc20.symbol(),
      erc20.decimals(),
    ]);

    const amount = ethers.utils.parseUnits(amt, decimals);
    // UserOperation Destination(contract addr)
    dest = [...dest, erc20.address];

    data = [
      ...data,
      erc20.interface.encodeFunctionData('transfer', [
        ethers.utils.getAddress(t),
        amount,
      ]),
    ];
    console.log(
      `Batch transferring ${amt} ${symbol} to ${ethers.utils.getAddress(t)}`
    );
  });
  await Promise.all(p);
  let msg = '';
  const ac = await accountAPI._getAccountContract();
  const op = await accountAPI.createSignedUserOp({
    target: sender,
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);
  msg += `Signed UserOperation: ${await printOp(op)}`;

  const client = await getHttpRpcClient(
    provider,
    config.bundlerUrl,
    config.entryPoint
  );

  const uoHash = await client.sendUserOpToBundler(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await accountAPI.getUserOpReceipt(uoHash);
  msg += '\n' + `Transaction hash: ${txHash}`;
  console.log(`Transaction hash: ${txHash}`);
  return msg;
}

/**
 * react components
 *
 * @returns
 */
const testpage = () => {

  const handleConnect = async () => {
    // debugger;
    const accountAPI = await getWebSimpleAccount(
      config.rpcUrl,
      config.entryPoint,
      config.simpleAccountFactory
    );
    const address = await accountAPI.getCounterFactualAddress();
    //   console.log(`SimpleAccount address: ${address}`);
    console.log(address);
  };
  const handleBatchTransact = async () => {
    // debugger;
    const msg = await batchTransferERC20([
      {
        tkn: '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
        t: '0xBD62B143954Fb954012685699df95681D5501540',
        amt: '0.001',
      },
      {
        tkn: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
        t: '0xBD62B143954Fb954012685699df95681D5501540',
        amt: '0.001',
      },
    ]);
    console.log(msg);
  };

  return (
    <div>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleBatchTransact}>transact</button>
    </div>
  );
};

export default testpage;
