import { ethers } from 'ethers';
import { SimpleAccountAPI, PaymasterAPI } from '@account-abstraction/sdk';
import { JsonRpcProvider } from '@ethersproject/providers';

import {
  getVerifyingPaymaster,
  getSimpleAccount,
  getGasFee,
  printOp,
  getHttpRpcClient,
  ERC20_ABI,
} from '../../src';

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

export async function getWebSimpleAccount(rpcUrl, entryPointAddress, factoryAddress) {
  const owner = await getMetaMaskSigner();
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
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
