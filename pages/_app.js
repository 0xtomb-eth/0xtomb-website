import Head from 'next/head';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  optimismGoerli,
  arbitrum,
  polygonMumbai,
  localhost,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../styles/globals.css';

// import Header from '@/components/Header';

const { chains, provider } = configureChains(
  // [mainnet, polygon, optimism, arbitrum],
  [localhost],
  [publicProvider()]
  // [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]

);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = createTheme({
    typography: {
      fontFamily: ['"Helvetica Neue"'].join(','),
    },
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        // Purple and green play nicely together.
        main: '#000000',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
      dark: {
        primary: {
          main: '#f5f5f5',
        },
        secondary: {
          main: '#11cb5f',
        },
      },
    },
  });
  return (
    <div style={{ background: theme.palette.mode === 'dark' ? '#000000' : '#ffffff' }}>
      <Head>
        <title>0xtomb</title>
        <meta
          name="description"
          content="SBT Ring, one man, one life, one ring"
        />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </div>
  );
}
