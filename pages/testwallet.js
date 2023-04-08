/* eslint-disable */
// 0x4f762c7ca62994c30a1311537753c8f946e29a9a9c1d30e0dbbc49843697268c;
import React, { useState, useEffect } from 'react';
import config from '../config.json';
import { ethers } from 'ethers';
// import { Buffer } from "buffer";
import axios from 'axios';
// @ts-ignore

const Transfer = () => {
  // 连接到 MetaMask 并获取 signer
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

  // const [key, setKey] = useState('0x0');
  const [signer, setSigner] = useState();

  const [msg, setMsg] = useState();

  const [target, setTarget] = useState(
    '0x0000000000000000000000000000000000000000'
  );

  const [amt, setAmt] = useState('0.0');

  const [token1, setToken1] = useState();
  const [aa_addr, setaa_addr] = useState('undefined');
  const [paddr, setPaddr] = useState('undefined');

  const handleChange = (e) => {
    console.log(e.target.value);
    setTarget(e.target.value);
  };
  const handleAmt = (e) => {
    console.log(e.target.value);
    setAmt(e.target.value);
  };
  const handleTokenChange = (e) => {
    console.log(e.target.value);
    setToken1(e.target.value);
  };
  const handleGetSigner = async (e) => {
    setSigner(
      await (async () => {
        const signer = await getMetaMaskSigner();
        // debugger;
        if (signer) {
          console.log('Connected to MetaMask');
        } else {
          console.log('Failed to connect to MetaMask');
        }
        return signer;
      })()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (() => {
      const aa_addr = axios
        .post('/api/batch20transfer', {
          key: key,
          data: [
            {
              t: target,
              tkn: token1,
              amt: amt,
            },
          ],
          withPM: false,
        })
        .then((data) => {
          setMsg(data.data);
          console.log(data);
        });
    })();
    // batch20transfer(target, amt, 0, setMsg);
  };
  const handleSubmitBatch20Token = (e) => {
    e.preventDefault();
    console.log('handleSubmitBatch20Token');
  };
  const showHex = (s) => {
    return s.slice(0, 8) + '...' + s.slice(s.length - 3, s.length);
    // return s;
  };
  const title = `${paddr} has contract account ${aa_addr}`;
  // const title = 0;
  return (
    <div>
      <button onClick={handleGetSigner}>Connect Wallet</button>
      <div>{title}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>BatchTransferERC20</h3>
          <span>
            <input placeholder="target addr" onChange={handleChange}></input>
            <input placeholder="token" onChange={handleTokenChange}></input>
            <input placeholder="amt" onChange={handleAmt}></input>
          </span>
        </div>

        <button type="submit"> transfer </button>
        {msg && <div>{msg}</div>}
        {/* <form onSubmit={handleSubmitBatch20Token}></form> */}
        {/* <span>
          <h3>ERC20 Batch Transfer:</h3>
          <input placeholder="ERC20 address<>" onChange={handleChange}></input>
          <input placeholder="amt" onChange={handleAmt}></input>
        </span>
        <button type="submit"> transfer </button> */}
        {/* {ecdsa && (
                    <>
                        <div>{`signer: ${ecdsa.signer}`}</div>
                        <div>{`sig: ${ecdsa.signature}`}</div>
                        <div>{`_v: ${ecdsa.v}`}</div>
                        <div>{`_r: ${ecdsa.r}`}</div>
                        <div>{`_s: ${ecdsa.s}`}</div>
                    </>
                )} */}
      </form>
    </div>
  );
};
export default Transfer;
