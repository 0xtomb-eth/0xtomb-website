import '@rainbow-me/rainbowkit/styles.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Tooltip, Button } from '@mui/material';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import useAA from './useAA';
import useWeb3Auth from './useWeb3auth';

const Header = () => {
  const { aa, balance } = useAA();

  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleConnectWithWeb3Auth = async () => {
    try {
      await web3auth.connect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        display="flex"
        position="sticky"
        top={0}
        alignItems="center"
        px={8}
        justifyContent="space-between"
        height={'100px'}
        width="100vw"
        marginX={{ lg: 'auto', md: '20px', xs: '20px' }}
      >
        <Box display="flex" justifyContent="center" alignItems={'center'}>
          <Box
            component={'img'}
            src="/svg/logo.svg"
            width={'35px'}
            height={'35px'}
          ></Box>
          <Typography variant="h5" sx={{ ml: '10px' }} fontWeight={'800'}>
            0xTomb
          </Typography>
          <Box gap={4} display={'flex'} fontSize={2} lineHeight={3} ml={'40px'}>
            {[
              { path: '/', title: 'Sign' },
              { path: '/will', title: 'Confirm' },
              { path: '/cemetery', title: 'Cemetery' },
            ].map((val, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    fontSize: '20px',
                    lineHeight: '40px',
                    color: 'white',
                    px: '16px',
                    fontWeight: '400',
                    transform: 'skewX(-10deg)',
                    background: 'black',
                  }}
                  onClick={() => {
                    router.push(val.path);
                  }}
                >
                  {val.title}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box display="flex">
          <Tooltip
            title={copied ? 'copied!' : 'click to copy: ' + aa}
            onClick={() => {
              navigator.clipboard.writeText(aa).then(
                function () {
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 500);
                },
                function (e) {
                  console.error(e);
                }
              );
            }}
          >
            <Button variant="outlined" sx={{ fontSize: '8px', mr: '10px' }}>
              AA: {aa.slice(0, 4) + '...' + aa.slice(-5, -1)}
              <br />
              {balance}
            </Button>
          </Tooltip>

          <ConnectButton
            showBalance={false}
            chainStatus="none"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </Box>
        <Box display="flex">
          <header>
            <nav>
              <ul>
                <li>
                  <button onClick={handleConnectWithWeb3Auth}>Login With Web3Auth</button>
                </li>
              </ul>
            </nav>
          </header>
        </Box>
      </Box>
    </>
  );
};

export default Header;
