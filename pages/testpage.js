import React from 'react';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { SimpleAccountAPI, PaymasterAPI } from '@account-abstraction/sdk';
import {
  getVerifyingPaymaster,
  getSimpleAccount,
  getGasFee,
  printOp,
  getHttpRpcClient,
  ERC20_ABI,
} from '../src';
const config = {
  bundlerUrl:
    'https://node.stackup.sh/v1/rpc/ab34b239039b78a490192eebb2898648b599e2c85b758b435ddcc336b8afa9fc',
  rpcUrl:
    'https://node.stackup.sh/v1/rpc/ab34b239039b78a490192eebb2898648b599e2c85b758b435ddcc336b8afa9fc',
  entryPoint: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
  simpleAccountFactory: '0x71D63edCdA95C61D6235552b5Bc74E32d8e2527B',
};
/**
 * get aa account
 *
 * @param {*} provider
 * @param {*} signingKey
 * @param {*} entryPointAddress
 * @param {*} factoryAddress
 * @param {*} paymasterAPI
 * @returns
 */
async function getWebSimpleAccount(entryPointAddress, factoryAddress) {
  const owner = await getMetaMaskSigner();
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const sw = new SimpleAccountAPI({
    provider,
    entryPointAddress,
    owner,
    factoryAddress,
    undefined,
  });

  // Hack: default getUserOpReceipt does not include fromBlock which causes an error for some RPC providers.
  sw.getUserOpReceipt = async (
    userOpHash,
    timeout = 30000,
    interval = 5000
  ) => {
    const endtime = Date.now() + timeout;
    const block = await sw.provider.getBlock('latest');
    while (Date.now() < endtime) {
      // @ts-ignore
      const events = await sw.entryPointView.queryFilter(
        // @ts-ignore
        sw.entryPointView.filters.UserOperationEvent(userOpHash),
        Math.max(0, block.number - 100)
      );
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  };

  return sw;
}

/**
 * Get signer from mm
 *
 * @returns
 */
async function getMetaMaskSigner() {
  // 检查是否已安装 MetaMask
  if (typeof window.ethereum !== 'undefined') {
    try {
      // 请求 MetaMask 账户访问权限
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // 连接到 MetaMask 提供的 Ethereum 网络
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // 获取 signer 对象
      const signer = provider.getSigner();

      return signer;
    } catch (error) {
      console.error('User rejected access to MetaMask');
    }
  } else {
    console.error('MetaMask is not installed');
  }
  return null;
}

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
    config.entryPoint,
    config.simpleAccountFactory
  );
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

  let dest = [];
  let data = [];
  const sender = await accountAPI.getCounterFactualAddress();
  let p = transfer20Info.map(async ({ tkn, t, amt }) => {
    const token = ethers.utils.getAddress(tkn);
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const [symbol, decimals] = await Promise.all([
      erc20.symbol(),
      erc20.decimals(),
    ]);
    const amount = ethers.utils.parseUnits(amt, decimals);
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
    debugger;
    const accountAPI = await getWebSimpleAccount(
      config.entryPoint,
      config.simpleAccountFactory
    );
    const address = await accountAPI.getCounterFactualAddress();
    //   console.log(`SimpleAccount address: ${address}`);
    console.log(address);
  };
  const handleBatchTransact = async () => {
    debugger;
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
