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
  console.log(`entryPoint address: ${config.entryPoint}`);
  console.log(`rpcUrl: ${config.rpcUrl}`);
  console.log(`simpleAccountFactory: ${config.simpleAccountFactory}`);

  const address = await accountAPI.getCounterFactualAddress();
  console.log(`aa address: ${address}`);

  return address;
};
