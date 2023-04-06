import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';
import {
  getVerifyingPaymaster,
  getSimpleAccount,
  getGasFee,
  printOp,
  getHttpRpcClient,
  ERC20_ABI,
} from '../src';
// import Web3 from "web3";
import config from '../config.json';

async function transfer(key, t, amt, withPM) {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const paymasterAPI = withPM
    ? getVerifyingPaymaster(config.paymasterUrl, config.entryPoint)
    : undefined;
  const accountAPI = getSimpleAccount(
    provider,
    key,
    config.entryPoint,
    config.simpleAccountFactory,
    paymasterAPI
  );
  let msg = '';
  const target = ethers.utils.getAddress(t);
  const value = ethers.utils.parseEther(amt);
  const op = await accountAPI.createSignedUserOp({
    target,
    value,
    data: '0x',
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
  console.log(`Transaction hash: ${txHash}`);
  msg += `Transaction hash: ${txHash}`;
  return msg;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const { key, t, amt, withPM } = await JSON.parse(req.body);
    const data = await transfer(key, t, amt, withPM);
    res.status(200).json(JSON.stringify(data));
  } catch (e) {
    console.log(e);
    res.status(400).json(e?.message);
  }
};
