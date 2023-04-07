import '@rainbow-me/rainbowkit/styles.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Link, Menu, MenuItem } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [governance, setGovernance] = useState(null);
  const router = useRouter();

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpenMenu(open);
  };

  const handleGovernanceMenuClick = (event) => {
    setGovernance(event.currentTarget);
  };

  const handleGovernanceMenuClose = () => {
    setGovernance(null);
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
          <ConnectButton />
        </Box>
      </Box>
    </>
  );
};

export default Header;
