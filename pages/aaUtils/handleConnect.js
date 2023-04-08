import { getWebSimpleAccount } from './aaUtils/getWebSimpleAccount';
import config from './config'

const handleConnect = async () => {
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
