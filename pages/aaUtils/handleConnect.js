import { getWebSimpleAccount } from './getWebSimpleAccount';
import { config } from './config';
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";

export const handleConnect = async () => {



  //Initialize within your constructor
  // const web3auth = new Web3Auth({
  //   clientId: "BKP4fsLio7EVgA2GH0iQGUWfZCQaroScJWDQhRxMK3beDhU7beudVK3-F_opZ3z3nqaESbzMDFUsHDhZ8-MMvZ4", // Get your Client ID from Web3Auth Dashboard
  //   chainConfig: {
  //     chainNamespace: "eip155",
  //     chainId: "0x539",
  //   },
  // });
  // console.log("web3auth", web3auth);

  // await web3auth.initModal();
  // await web3auth.connect();
  // const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  // debugger
  console.log(config);
  // debugger;
  const accountAPI = await getWebSimpleAccount(
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory
  );
  console.log(`entryPoint address: ${config.entryPoint}`);
  console.log(`rpcUrl: ${config.rpcUrl}`);
  console.log(`simpleAccountFactory: ${config.simpleAccountFactory}`);

  const address = await accountAPI.getCounterFactualAddress();
  console.log(`aa address: ${address}`);

  return address;
};
