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

async function _getAddress(key) {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const accountAPI = getSimpleAccount(
    provider,
    key,
    config.entryPoint,
    config.simpleAccountFactory
  );
  const address = await accountAPI.getCounterFactualAddress();

  //   console.log(`SimpleAccount address: ${address}`);
  return address;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const { key } = await JSON.parse(req.body);
    const data = await _getAddress(key);
    res.status(200).json(JSON.stringify(data));
  } catch (e) {
    console.log(e);
    res.status(400).json(e?.message);
  }
};
