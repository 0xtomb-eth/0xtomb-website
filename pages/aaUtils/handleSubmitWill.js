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
  console.log('signer is: ', signer);
  const willAddress = ethers.utils.getAddress(
    await accountAPI.getCounterFactualAddress()
  );
  const willContract = new ethers.Contract(willAddress, will_abi.abi, signer);
  console.log('willAddress: ', willAddress);

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

  for (let i = 0; i < setAllocData.length; i++) {
    const gasLimit = await willContract.estimateGas.setAllocation(
      setAllocData[i][0],
      setAllocData[i][1],
      setAllocData[i][2]
    );
    console.log('this is setAllocData: ', setAllocData);
    const tx = await willContract.setAllocation(
      setAllocData[i][0],
      setAllocData[i][1],
      setAllocData[i][2],
      { gasLimit: gasLimit }
    );
    console.log(`Transaction hash for setAllocData tx${i}: `, tx.hash);
    console.log(`Successfully Set Allocation${i}`);
  }

  console.log(willContract);
  // set allocation

  // set death validators
  const gasLimit = await willContract.estimateGas.setDeathValidators(
    willData.validator,
    willData.threshold
  );
  const tx = await willContract.setDeathValidators(
    willData.validator,
    willData.threshold,
    { gasLimit: gasLimit }
  );
  console.log('Transaction hash for setDeathValidators: ', tx.hash);
  await tx.wait();
  console.log('Successfully Set Validators');
}
