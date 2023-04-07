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
        alignItems="center"
        justifyContent="space-between"
        height={{ md: '88px' }}
        maxWidth="1216px"
        marginX={{ lg: 'auto', md: '20px', xs: '20px' }}
        borderBottom="1px solid black"
      >
        <Box display="flex">LOGO</Box>
        <Box
          gap={4}
          display={{ md: 'flex', sm: 'none', xs: 'none' }}
          fontSize={2}
          lineHeight={3}
        >
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              router.push('/');
            }}
          >
            签署遗嘱
          </Typography>
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              router.push('/will');
            }}
          >
            确认遗嘱
          </Typography>
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              router.push('/cemetery');
            }}
          >
            墓园
          </Typography>
        </Box>
        <Box display="flex" gap="40px">
          <ConnectButton />
        </Box>
      </Box>
    </>
  );
};

export default Header;
