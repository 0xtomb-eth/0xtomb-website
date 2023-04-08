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

const config = {
  bundlerUrl:
    'https://node.stackup.sh/v1/rpc/ab34b239039b78a490192eebb2898648b599e2c85b758b435ddcc336b8afa9fc',
  rpcUrl:
    'https://node.stackup.sh/v1/rpc/ab34b239039b78a490192eebb2898648b599e2c85b758b435ddcc336b8afa9fc',
  entryPoint: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
  simpleAccountFactory: '0x9F1ABFc7E1643d599216e394f2b1300B48c159FD',
};

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
  // debugger
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
  return address;
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

/**
 * react components
 *
 * @returns
 */
const testpage = () => {
  return (
    <div>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleBatchTransact}>transact</button>
    </div>
  );
};

export default testpage;
export { handleConnect };
