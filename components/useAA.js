import { fetchBalance } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { handleConnect } from '../pages/aaUtils/handleConnect';

export default function useAA() {
  const { address } = useAccount();
  const [aa, setAa] = useState('');
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    (async () => {
      const adr = await handleConnect();
      setAa(adr);
      const balance = await fetchBalance({
        address: adr,
        formatUnits: 'ether',
      });
      setBalance(parseFloat(balance.formatted).toFixed(2));
    })();
  }, [address]);
  return { address, aa, balance };
}
