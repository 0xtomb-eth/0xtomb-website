// express helloworld
import { ethers } from 'ethers';
import {
  getVerifyingPaymaster,
  getSimpleAccount,
  getGasFee,
  printOp,
  getHttpRpcClient,
  ERC20_ABI,
} from '../../src';
// import Web3 from "web3";
import config from '../../config.json';

// * TODO: batch approve ERC20s
// This example requires several layers of calls:
// EntryPoint
//  ┕> sender.executeBatch
//    ┕> token.transfer (recipient 1)
//    ⋮
//    ┕> token.transfer (recipient N)

/* * 
test ERC20: 0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e
test ERC20: 0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1

*/
async function batchTransferERC20(
  // tkn: string,
  // t: Array<string>,
  key: string,
  transfer20Info: Array<{ tkn: string; t: string; amt: string }>,
  withPM: boolean
) {
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
  let dest: Array<string> = [];
  let data: Array<string> = [];
  const sender = await accountAPI.getCounterFactualAddress();
  let p = transfer20Info.map(async ({ tkn, t, amt }) => {
    const token = ethers.utils.getAddress(tkn);
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const [symbol, decimals] = await Promise.all([
      erc20.symbol(),
      erc20.decimals(),
    ]);
    const amount = ethers.utils.parseUnits(amt, decimals);
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

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const key = req.body.key;
    const data = req.body.data;
    batchTransferERC20(key, data, false).then((msg) => {
      res.status(200).send(msg);
    });
  } catch {
    (e: Error) => {
      res.status(500).send(JSON.stringify(e));
    };
  }
};
