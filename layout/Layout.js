/* eslint-disable no-undef */
import React from 'react';
import Head from 'next/head';
import { Box, CssBaseline } from '@mui/material';

import Header from '../components/Header';

// eslint-disable-next-line react/prop-types
export default function Layout({ children, title, description }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/icons/favicon.png" />
        <title>{title}</title>
        <meta name="description" content="" />
      </Head>

      <CssBaseline />
      <Box>
        <Header />
        <Box height={'calc(100vh - 100px)'}>{children}</Box>
      </Box>
    </>
  );
}
