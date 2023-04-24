import RemoveIcon from '@mui/icons-material/Remove';

import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Divider,
  IconButton,
  Grid,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';

import Layout from '../layout/Layout';
import showMessage from '../components/showMessage';
import { handleSubmitWill } from './aaUtils/handleSubmitWill';

import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/modal";
import { useTheme } from '@mui/material/styles';

// import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
// import RPC from ".api/ethersRPC"; // for using ethers.js
// Plugins
// import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
// Adapters
import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"

function HomePage() {
  const theme = useTheme();
  const [web3auth, setWeb3auth] = useState(null);
  // const [torusPlugin, setTorusPlugin] = useState(null);
  const [provider, setProvider] = useState(null);
  
  const [active, setActive] = useState(1);
  const [beneficiaries, setBeneficiaries] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'beneficiary', // unique name for your Field Array
  });

  const {
    fields: validatorField,
    append: validatorAppend,
    remove: validatorRemove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'validator', // unique name for your Field Array
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    data.beneficiary = data.beneficiary.map((val) => {
      return val.beneficiary;
    });
    data.validator = data.validator.map((val) => {
      return val.validator;
    });
    data.amount = data.amount?.map((arr) => {
      return arr.map((val) => {
        return val.amount;
      });
    });
    data.assets = [
      '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
      '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
    ];
    // data.percentages = [[100], [100]];
    data.threshold = parseInt(data.threshold);
    try {
      console.log('submit data: ', { data });
      const res = await handleSubmitWill(data);
      showMessage({
        type: 'success',
        title: 'Sign Will Success',
        message: JSON.stringify(res),
      });
    } catch (error) {
      console.log(error);
      showMessage({
        type: 'error',
        title: 'something wrong happened',
        message: JSON.stringify(error),
      });
    }
    setLoading(false);
  });

  useEffect(() => {
    if (!fields.length) {
      append();
    }
  }, [fields]);

  useEffect(() => {
    if (!validatorField.length) {
      validatorAppend();
    }
  }, [validatorField]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          web3AuthNetwork: "cyan",
        });

        // plugins and adapters are optional and can be added as per your requirement
        // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

        // adding torus wallet connector plugin

        // const torusPlugin = new TorusWalletConnectorPlugin({
        //   torusWalletOpts: {},
        //   walletInitOptions: {
        //     whiteLabel: {
        //       theme: { isDark: true, colors: { primary: "#00a8ff" } },
        //       logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        //       logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        //     },
        //     useWalletConnect: true,
        //     enableLogging: true,
        //   },
        // });
        // setTorusPlugin(torusPlugin);
        // await web3auth.addPlugin(torusPlugin);

        // read more about adapters here: https://web3auth.io/docs/sdk/web/adapters/

        // adding wallet connect v1 adapter

        const walletConnectV1Adapter = new WalletConnectV1Adapter({
          adapterSettings: {
            bridge: "https://bridge.walletconnect.org",
          },
          clientId,
        });

        web3auth.configureAdapter(walletConnectV1Adapter);

        // adding metamask adapter

        const metamaskAdapter = new MetamaskAdapter({
          clientId,
          sessionTime: 3600, // 1 hour in seconds
          web3AuthNetwork: "cyan",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });
        // we can change the above settings using this function
        metamaskAdapter.setAdapterSettings({
          sessionTime: 86400, // 1 day in seconds
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x89",
            rpcTarget: "https://rpc-mainnet.matic.network", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          web3AuthNetwork: "cyan",
        });

        // it will add/update  the metamask adapter in to web3auth class
        web3auth.configureAdapter(metamaskAdapter);

        // const torusWalletAdapter = new TorusWalletAdapter({
        //   clientId,
        // });

        // // it will add/update  the torus-evm adapter in to web3auth class
        // web3auth.configureAdapter(torusWalletAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    uiConsole("Logged in Successfully!");
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const showWCM = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const initiateTopUp = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.initiateTopup("moonpay", {
      selectedAddress: "0x8cFa648eBfD5736127BbaBd1d3cAe221B45AB9AF",
      selectedCurrency: "USD",
      fiatValue: 100,
      selectedCryptoCurrency: "ETH",
      chainNetwork: "mainnet",
    });
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const newChain = {
      chainId: "0x5",
      displayName: "Goerli",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: "Goerli",
      ticker: "ETH",
      decimals: 18,
      rpcTarget: "https://rpc.ankr.com/eth_goerli",
      blockExplorer: "https://goerli.etherscan.io",
    };
    await web3auth?.addChain(newChain);
    uiConsole("New Chain Added");
  };

  const switchChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    await web3auth?.switchChain({ chainId: "0x5" });
    uiConsole("Chain Switched");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={showWCM} className="card">
            Show Wallet Connect Modal
          </button>
        </div>
        <div>
          {/* <button onClick={initiateTopUp} className="card">
            initiateTopUp
          </button> */}
        </div>
        <div>
          {/* <button onClick={getChainId} className="card">
            Get Chain ID
          </button> */}
        </div>
        <div>
          {/* <button onClick={addChain} className="card">
            Add Chain
          </button> */}
        </div>
        <div>
          {/* <button onClick={switchChain} className="card">
            Switch Chain
          </button> */}
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          {/* <button onClick={getBalance} className="card">
            Get Balance
          </button> */}
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          {/* <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button> */}
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pt: '80px',
        }}
      >
        {active == 1 && (
          <Stack direction={'row'} justifyContent="center">
            <Box
              component={'img'}
              src="/svg/scroll.svg"
              width={'400px'}
              height={'400px'}
              mr={'20px'}
            />
            <Stack width={'400px'} justifyContent="center" gap={1}>
              <Typography
                width={'180px'}
                fontSize={'64px'}
                fontWeight="200"
                lineHeight={'64px'}
              >
                Sign Your Will
              </Typography>
              <Typography
                fontSize={'15px'}
                fontWeight={200}
                fontStyle={'italic'}
              >
                I've designated a beneficiary for my life insurance policy.
              </Typography>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Enter your name' }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    value={value}
                    label="name"
                    size="small"
                    fullWidth
                    error={errors?.name?.message}
                    helperText={errors?.name?.message}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                name="epitaph"
                control={control}
                rules={{ required: 'Enter your epitaph' }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    value={value}
                    label="epitaph"
                    width={'400px'}
                    size="small"
                    error={errors?.epitaph?.message}
                    helperText={errors?.epitaph?.message}
                    onChange={onChange}
                  />
                )}
              />

              <Button
                size="small"
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => {
                  setActive(active + 1);
                }}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        )}
        {active == 2 && (
          <Stack direction={'row'}>
            <Box
              component={'img'}
              src="/svg/scroll.svg"
              width={'400px'}
              height={'400px'}
              mr={'20px'}
            />
            <Stack width={'400px'} justifyContent="center" gap={1}>
              <Typography
                width={'180px'}
                fontSize={'64px'}
                fontWeight="200"
                lineHeight={'64px'}
              >
                Who is Validator?
              </Typography>
              <Typography
                fontSize={'15px'}
                fontWeight={200}
                fontStyle={'italic'}
                color="primary"
              >
                I've created a trust to protect my assets for my loved ones
                after my passing.
              </Typography>
              <Controller
                name="threshold"
                control={control}
                rules={{ required: 'Enter your threshold' }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    value={value}
                    label="threshold"
                    width={'400px'}
                    size="small"
                    error={errors?.epitaph?.message}
                    helperText={errors?.epitaph?.message}
                    onChange={onChange}
                  />
                )}
              />
              {validatorField.map(({ id }, index) => (
                <Controller
                  name={`validator.[${index}].validator`}
                  control={control}
                  key={id}
                  rules={{ required: '请输入验证者地址' }}
                  render={({ field: { onChange, value } }) => (
                    <Grid container gap={2} alignItems={'center'}>
                      <Grid xs={9}>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={value}
                            onChange={onChange}
                            label={`Validator ${index + 1}`}
                          />
                        </Box>
                      </Grid>
                      <Grid xs={1}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={validatorAppend}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid xs={1}>
                        <IconButton
                          color="primary"
                          size="small"
                          disabled={validatorField.length == 1}
                          onClick={() => {
                            validatorRemove(index);
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )}
                />
              ))}
              <Grid container gap={2}>
                <Grid xs={5}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color='primary'
                    onClick={() => {
                      setActive(active - 1);
                    }}
                  >
                    Pre
                  </Button>
                </Grid>
                <Grid xs={5}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="primary"
                    disabled={!fields.length}
                    onClick={() => {
                      setActive(active + 1);
                    }}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        )}
        {active == 3 && (
          <Stack direction={'row'}>
            <Box
              component={'img'}
              src="/svg/scroll.svg"
              width={'400px'}
              height={'400px'}
              mr={'20px'}
            />
            <Stack width={'400px'} justifyContent="center" gap={1}>
              <Typography
                width={'180px'}
                fontSize={'64px'}
                fontWeight="200"
                lineHeight={'64px'}
              >
                Who is beneficiary?
              </Typography>
              <Typography
                fontSize={'15px'}
                fontWeight={200}
                fontStyle={'italic'}
              >
                I've written a living will to outline my end-of-life wishes.
              </Typography>
              {fields.map(({ id }, index) => (
                <Controller
                  name={`beneficiary[${index}].beneficiary`}
                  control={control}
                  key={id}
                  rules={{ required: '请输入受益人地址' }}
                  render={({ field: { onChange, value } }) => (
                    <Grid container gap={2} alignItems={'center'}>
                      <Grid xs={9}>
                        <Box>
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={value}
                            error={errors?.beneficiary?.length > 0}
                            helperText={
                              errors?.beneficiary?.length > 0
                                ? errors?.beneficiary[index]?.beneficiary
                                    ?.message
                                : ''
                            }
                            onChange={onChange}
                            label={`Beneficiary ${index + 1}`}
                          />
                        </Box>
                      </Grid>
                      <Grid xs={1}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={append}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid xs={1}>
                        <IconButton
                          color="primary"
                          size="small"
                          disabled={fields.length == 1}
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )}
                />
              ))}
              <Grid container gap={2}>
                <Grid xs={5}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color='primary'
                    onClick={() => {
                      setActive(active - 1);
                    }}
                  >
                    Pre
                  </Button>
                </Grid>
                <Grid xs={5}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="primary"
                    disabled={!fields.length}
                    onClick={() => {
                      const b = getValues('beneficiary');
                      const beneficiaries = b
                        .map((val) => {
                          return val.beneficiary;
                        })
                        .filter((item) => item != null && item !== '');

                      setBeneficiaries(beneficiaries);
                      setActive(active + 1);
                    }}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        )}
        {active == 4 && (
          <Stack direction={'row'}>
            <Box
              component={'img'}
              src="/svg/scroll.svg"
              width={'400px'}
              height={'400px'}
              mr={'20px'}
            />
            <Stack width={'400px'} justifyContent="center" gap={1}>
              <Typography
                width={'300px'}
                fontSize={'64px'}
                fontWeight="200"
                lineHeight={'64px'}
              >
                How much they get?
              </Typography>
              <Typography
                fontSize={'15px'}
                fontWeight={200}
                fontStyle={'italic'}
              >
                I've appointed an executor to handle my estate after I'm gone.
              </Typography>
              {[{ name: 'USDT' }, { name: 'USDC' }].map((value, index) => {
                return (
                  <Grid key={index} container spacing={1}>
                    <Grid xs={2}>
                      <Typography>{value.name}</Typography>
                    </Grid>
                    <Grid xs={2}>
                      <Typography>100</Typography>
                    </Grid>
                    <Grid xs={6} container>
                      {beneficiaries.map((value, index2) => {
                        return (
                          <>
                            <Grid xs={6} rowSpacing={3}>
                              <Typography>
                                {value?.slice(0, 5) +
                                  '...' +
                                  value?.slice(-5, -1)}
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Controller
                                name={`amount[${index}][${index2}].amount`}
                                control={control}
                                rules={{
                                  required: '请输入分配比例',
                                }}
                                render={({ field: { onChange, value } }) => (
                                  <TextField
                                    sx={{ mb: '5px' }}
                                    value={value}
                                    onChange={onChange}
                                    size={'small'}
                                    error={
                                      errors?.amount &&
                                      errors?.amount[index] &&
                                      errors?.amount[index][index2]
                                    }
                                    helperText={
                                      errors?.amount &&
                                      errors?.amount[index] &&
                                      errors?.amount[index][index2]
                                        ? errors?.amount[index][index2].amount
                                            .message
                                        : ''
                                    }
                                  />
                                )}
                              />
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  </Grid>
                );
              })}
              <Divider />

              <Grid container gap={2}>
                <Grid xs={5}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color='primary'
                    onClick={() => {
                      setActive(active - 1);
                    }}
                  >
                    Pre
                  </Button>
                </Grid>
                <Grid xs={5}>
                  <Button
                    size="small"
                    fullWidth
                    disabled={loading}
                    variant="contained"
                    onClick={onSubmit}
                  >
                    {loading ? 'loading' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        )}
        <Box
          className="bigline"
          sx={{
            position: 'absolute',
            bottom: '100px',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            px: '10px',
          }}
        >
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {[
              'Sign Your Will',
              'Who is Validator',
              'Who is beneficiary',
              'How much they get',
            ].map((v, index) => (
              <Typography
                key={index}
                fontStyle={active == index + 1 ? '' : 'italic'}
                color={theme.palette.mode === 'dark' ? (active == index + 1 ? 'white' : '#a2a9b4') : (active == index + 1 ? 'black' : '#a2a9b4')}
                textTransform={'capitalize'}
              >
                {v}
              </Typography>
            ))}
          </Box>
        </Box>

        <Box display="flex">
          
        </Box>

      </Container>
      <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
        </a>
        Connect with Web3Auth
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a href="https://github.com/Web3Auth/examples/tree/main/web-modal-sdk/evm/nextjs-evm-modal-example" target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </footer>
    </div>
    </Layout>
  );
}

export default HomePage;
