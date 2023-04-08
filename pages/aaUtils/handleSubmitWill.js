import { ethers } from 'ethers';
import {
  getVerifyingPaymaster,
  getSimpleAccount,
  getGasFee,
  printOp,
  getHttpRpcClient,
  ERC20_ABI,
} from '../../src';
import { getWebSimpleAccount } from './getWebSimpleAccount';
import will_abi from './WillAccount.json';
import { config } from './config';

/* * 
test ERC20: 0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e
test ERC20: 0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1
AA: 0x19CB25D9010597837078933b5546571dED91aE1f
*/

export async function handleSubmitWill(willData) {
  console.log(willData);
  console.log(config);
  //   debugger;
  const accountAPI = await getWebSimpleAccount(
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory
  );
  // if use metamask provider
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const willAddress = ethers.utils.getAddress(
    await accountAPI.getCounterFactualAddress()
  );

  const setAllocData = (function constructArray(data) {
    let result = [];
    for (let i = 0; i < data.assets.length; i++) {
      result.push([
        ethers.utils.getAddress(data.assets[i]),
        data.beneficiary.map((b) => {
          return ethers.utils.getAddress(b);
        }),
        data.amount[i],
      ]);
    }
    return result;
  })(willData);
  console.log(will_abi);
  const gasFee = await getGasFee(provider);
  const willbase = new ethers.Contract(willAddress, will_abi.abi, provider);

  const setAllocOpsPromises = setAllocData.map(async (data) => {
    return accountAPI.createSignedUserOp({
      target: willAddress,
      data: willbase.interface.encodeFunctionData('setAllocation', data),
      ...gasFee,
    });
  });
  // debugger
  const setValidOpsPromises = accountAPI.createSignedUserOp({
    target: willAddress,
    data: willbase.interface.encodeFunctionData('setDeathValidators', [
      willData.validator.map((v) => ethers.utils.getAddress(v)),
      willData.threshold,
    ]),
    ...gasFee,
  });

  //   console.log(`Signed UserOperation: ${await printOp(op)}`);
  //   msg += `Signed UserOperation: ${await printOp(op)}`;
  const ops = await Promise.all([...setAllocOpsPromises, setValidOpsPromises]);

  const client = await getHttpRpcClient(
    provider,
    config.bundlerUrl,
    config.entryPoint
  );

  //   const uoHash = await client.sendUserOpToBundler(op);
  const uoHashs = await Promise.all(
    ops.map((op) => {
      return client.sendUserOpToBundler(op);
    })
  );
  console.log(`UserOpHash: ${uoHashs}`);

  console.log('Waiting for transaction...');
  const txHashs = await Promise.all(
    uoHashs.map((uoHash) => {
      return accountAPI.getUserOpReceipt(uoHash);
    })
  );
  const tx = txHashs.filter(function (element) {
    return element !== undefined;
  });
  //   const txHash = await accountAPI.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${tx}`);
  return tx;
}
