/* eslint-disable */
// 0x4f762c7ca62994c30a1311537753c8f946e29a9a9c1d30e0dbbc49843697268c;
import React, { useState, useEffect } from 'react';
// import styled from "styled-components";
// import {
//     getVerifyingPaymaster,
//     getSimpleAccount,
//     getGasFee,
//     printOp,
//     getHttpRpcClient,
// } from "../aa";
// import Web3 from "web3";
import config from '../config.json';
import { ethers } from 'ethers';
// import { Buffer } from "buffer";
import axios from 'axios';
// @ts-ignore

// async function transfer(t, amt, withPM, setMsg) {
//     const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
//     const paymasterAPI = withPM
//         ? getVerifyingPaymaster(config.paymasterUrl, config.entryPoint)
//         : undefined;
//     const accountAPI = getSimpleAccount(
//         provider,
//         config.signingKey,
//         config.entryPoint,
//         config.simpleAccountFactory,
//         paymasterAPI
//     );
//     var msg = "";
//     const target = ethers.utils.getAddress(t);
//     const value = ethers.utils.parseEther(amt);
//     const op = await accountAPI.createSignedUserOp({
//         target,
//         value,
//         data: "0x",
//         ...(await getGasFee(provider)),
//     });
//     console.log(`Signed UserOperation: ${await printOp(op)}`);
//     msg += `Signed UserOperation: ${await printOp(op)}`;
//     const client = await getHttpRpcClient(
//         provider,
//         config.bundlerUrl,
//         config.entryPoint
//     );
//     const uoHash = await client.sendUserOpToBundler(op);
//     console.log(`UserOpHash: ${uoHash}`);

//     console.log("Waiting for transaction...");
//     const txHash = await accountAPI.getUserOpReceipt(uoHash);
//     console.log(`Transaction hash: ${txHash}`);
//     msg += `Transaction hash: ${txHash}`;
//     setMsg(msg);
// }

// async function _getCounterFactualAddress(config) {
//     const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
//     const accountAPI = getSimpleAccount(
//         provider,
//         config.signingKey,
//         config.entryPoint,
//         config.simpleAccountFactory
//     );
//     const address = await accountAPI.getCounterFactualAddress();

//     //   console.log(`SimpleAccount address: ${address}`);
//     return address;
// }

const Transfer = () => {
  const [key, setKey] = useState('0x0');
  const [msg, setMsg] = useState();

  const [target, setTarget] = useState(
    '0x0000000000000000000000000000000000000000'
  );
  const [target1, setTarget1] = useState(
    '0x0000000000000000000000000000000000000000'
  );

  const [amt, setAmt] = useState('0.0');
  const [amt1, setAmt1] = useState('0.0');

  const [token1, setToken1] = useState();
  const [token2, setToken2] = useState();
  const [aa_addr, setaa_addr] = useState('undefined');
  const [paddr, setPaddr] = useState('undefined');
  useEffect(() => {
    console.log('requestAddress');
    if (key.length == 66) {
      console.log(`requesting contract address for ${key}`);
      const aa_addr = axios
        .post('/api/getAddress', {
          key: key,
        })
        .then((data) => {
          setaa_addr(data.data);
          return data.data;
        });
    }
  }, [key]);
  //    get account public address using ethers from private key:

  // const aa_addr = 0;
  // console.log("public_addr: " + public_addr);
  // _getCounterFactualAddress(config);
  // async function signMessage(target) {
  //     if (!window.ethereum) return alert("Please Install Metamask");
  //     const ethereum = window.ethereum;
  //     // connect and get metamask account
  //     const accounts = await ethereum.request({
  //         method: "eth_requestAccounts",
  //     });

  //     // message to sign
  //     const message = target;
  //     // console.log({ message });

  //     // hash message
  //     const hashedMessage = Web3.utils.soliditySha3(message);
  //     // console.log({ hashedMessage });

  //     // sign hashed message
  //     const signature = await ethereum.request({
  //         method: "personal_sign",
  //         params: [hashedMessage, accounts[0]],
  //     });
  //     console.log(
  //         "SIGNING:\n" +
  //             "\tsigning target " +
  //             target +
  //             " hashed message: " +
  //             hashedMessage +
  //             " signature: " +
  //             signature
  //     );
  //     const signer = accounts[0];
  //     // split signature
  //     const r = signature.slice(0, 66);
  //     const s = "0x" + signature.slice(66, 130);
  //     const v = parseInt(signature.slice(130, 132), 16);
  //     console.log({ r, s, v });
  //     setEcdsa({ r, s, v, signature, signer });
  // }

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
  const handleChange1 = (e) => {
    console.log(e.target.value);
    setTarget1(e.target.value);
  };
  const handleAmt1 = (e) => {
    console.log(e.target.value);
    setAmt1(e.target.value);
  };
  const handleTokenChange2 = (e) => {
    console.log(e.target.value);
    setToken2(e.target.value);
  };
  const handleKeyChange = (e) => {
    console.log(e.target.value);
    setKey(e.target.value);
    if (e.target.value.length == 66) {
      const wallet = new ethers.Wallet(e.target.value);
      setPaddr(wallet.address);
    }
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
  const title = `${paddr} (privateKey: ${showHex(
    key
  )}) has contract account ${aa_addr}`;
  // const title = 0;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="privateKey" onChange={handleKeyChange}></input>
        <div>{title}</div>
        <div>
          <h3>BatchTransferERC20</h3>
          <span>
            <input placeholder="target addr" onChange={handleChange}></input>
            <input placeholder="token" onChange={handleTokenChange}></input>
            <input placeholder="amt" onChange={handleAmt}></input>
          </span>
          <span>
            <input placeholder="target addr" onChange={handleChange1}></input>
            <input placeholder="token" onChange={handleTokenChange2}></input>
            <input placeholder="amt" onChange={handleAmt1}></input>
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
