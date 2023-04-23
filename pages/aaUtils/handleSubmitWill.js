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
  const accountAPI = await getWebSimpleAccount(
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory
  );
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const signer = provider.getSigner();
  const willAddress = ethers.utils.getAddress(
    await accountAPI.getCounterFactualAddress()
  );
  const willContract = new ethers.Contract(willAddress, will_abi.abi, signer);
  console.log("willAddress: ", willAddress);

  const setAllocData = (function constructArray(data) {
    let result = [];
    for (let i = 0; i < data.assets.length; i++) {
      result.push([
        ethers.utils.getAddress(data.assets[i]),
        data.beneficiary.map((b) => {
          return ethers.utils.getAddress(b);
        }),
        data.percentages[i],
      ]);
    }
    return result;
  })(willData);

  // set allocation
  const gasLimit = await willContract.setAllocation.estimateGas(setAllocData[0][0], setAllocData[0][1], setAllocData[0][2]);
  console.log("this is setAllocData: ", setAllocData);
  console.log(setAllocData[0][0], setAllocData[0][1], setAllocData[0][2]);
  console.log(setAllocData[1][0], setAllocData[1][1], setAllocData[1][2]);
  const tx1 = await willContract.setAllocation(setAllocData[0][0], setAllocData[0][1], setAllocData[0][2], { gasLimit: gasLimit });
  console.log("Transaction hash for tx1: ", tx1.hash);
  console.log("Successfully Set Allocation1");

  const gasLimit2 = await willContract.setAllocation.estimateGas(setAllocData[0][0], setAllocData[0][1], setAllocData[0][2]);
  const tx2 = await willContract.setAllocation(setAllocData[1][0], setAllocData[1][1], setAllocData[1][2], { gasLimit: gasLimit2 });
  console.log("Transaction hash for tx2: ", tx2.hash);
  await tx2.wait();
  console.log("Successfully Set Allocation2");

  // set death validators
  const gasLimit3 = await willContract.setAllocation.estimateGas(setAllocData[0][0], setAllocData[0][1], setAllocData[0][2]);
  const tx3 = await willContract.setDeathValidators(willData.validator, willData.threshold, { gasLimit: gasLimit3 });
  console.log("Transaction hash for tx3: ", tx3.hash);
  await tx2.wait();
  console.log("Successfully Set Validators");
}
