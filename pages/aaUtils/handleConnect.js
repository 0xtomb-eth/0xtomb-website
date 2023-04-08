import { getWebSimpleAccount } from './getWebSimpleAccount';
import { config } from './config';

export const handleConnect = async () => {
  // debugger
  console.log(config);
  // debugger;
  const accountAPI = await getWebSimpleAccount(
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory
  );
  const address = await accountAPI.getCounterFactualAddress();
  //   console.log(`SimpleAccount address: ${address}`);
  return address;
};
