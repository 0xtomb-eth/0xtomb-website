import {
  Box,
  TextField,
  Container,
  Button,
  Stack,
  Slide,
  Grid,
  Card,
  Typography,
  LinearProgress,
} from '@mui/material';
import { Controller } from 'react-hook-form';

import Layout from '../layout/Layout';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  useContractInfiniteReads,
  useContractWrite,
  usePrepareContractWrite,
  useContractReads,
} from 'wagmi';
import WILL_ABI from '../abi/willAbi.json';
import useAA from '../components/useAA';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultAll = {
  death: false,
  threshold: 0,
  willStatus: false,
  validators: [
    '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
    '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
  ],
  allocations: [
    {
      token: 'ABC',
      allocation: [
        {
          beneficiaries: '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
          percentages: '30',
        },
        {
          beneficiaries: '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
          percentages: '70',
        },
      ],
    },
    {
      token: 'DEF',
      allocation: [
        {
          beneficiaries: '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
          percentages: '80',
        },
        {
          beneficiaries: '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
          percentages: '20',
        },
      ],
    },
  ],
};
function Will() {
  const [active, setActive] = useState(1);
  const { aa } = useAA();
  const [all, setAll] = useState(defaultAll);
  const [death, setDeath] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [executed, setExecuted] = useState(false);
  const [willStatus, setWillStatus] = useState(false);
  const [validators, setValidators] = useState([
    '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
    '0x453AA106A34e8F72fAA687326071bAC1E5D34af5',
  ]);
  const [willer, setWiller] = useState(aa);

  const [allocations, setAllocations] = useState([
    {
      token: 'ABC',
      allocation: [
        {
          beneficiaries: '0xacf9dD5172cE19BFD910b8E8252a2E7b47C977df',
          percentages: '30',
        },
        {
          beneficiaries: '0x863A0C95bF5dFc2b8404a81878dC5d533dbb523C',
          percentages: '70',
        },
      ],
    },
    {
      token: 'DEF',
      allocation: [
        {
          beneficiaries: '0xacf9dD5172cE19BFD910b8E8252a2E7b47C977df',
          percentages: '80',
        },
        {
          beneficiaries: '0x863A0C95bF5dFc2b8404a81878dC5d533dbb523C',
          percentages: '20',
        },
      ],
    },
  ]);

  //read data from contract
  const willContractConfig = {
    address: willer,
    abi: WILL_ABI,
  };

  const { data, isLoading } = useContractReads({
    contracts: [
      { ...willContractConfig, functionName: 'checkDeath' },
      { ...willContractConfig, functionName: 'getVotingThreshold' },
      { ...willContractConfig, functionName: 'getWillStatus' },
      { ...willContractConfig, functionName: 'getValidators' },
      { ...willContractConfig, functionName: 'getAllocationAssets' },
    ],
  });
  console.log(data);

  // useEffect(() => {
  //   all.death = result.data[0];
  //   all.threshold = result.data[1];
  //   all.willStatus = result.data[2];
  //   all.validators = result.data[3];
  //   // all.allocations=result.data[4]
  // });
  // const { config: ackDeathConfig, error } = usePrepareContractWrite({
  //   address: '0x630852804e7da852564d5E7437E570d77Ef9Faf6',
  //   abi: WILL_ABI,
  //   functionName: 'ackDeath',
  //   args: [willer, true],
  // });
  // const { writeAsync: ackDeathWriteAsync } = useContractWrite(ackDeathConfig);

  return (
    <>
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
                src="/svg/skull.svg"
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
                  Did he/she Die?
                </Typography>
                <Typography
                  fontSize={'15px'}
                  fontWeight={200}
                  fontStyle={'italic'}
                >
                  Put on address
                </Typography>

                <TextField
                  value={willer}
                  label="Willer Addres"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    setWiller(e.target.value);
                  }}
                />

                <Button
                  size="small"
                  fullWidth
                  variant="outlined"
                  color='primary'
                  onClick={() => {
                    setActive(active + 1);
                  }}
                >
                  Index
                </Button>
              </Stack>
            </Stack>
          )}
          {active == 2 && (
            <Stack direction={'row'} justifyContent="center">
              <Box
                component={'img'}
                src="/svg/skull.svg"
                width={'400px'}
                height={'400px'}
                mr={'20px'}
              />
              <Stack width={'400px'} justifyContent="center" gap={1}>
                <Typography
                  fontSize={'15px'}
                  fontWeight={200}
                  fontStyle={'italic'}
                >
                  遗嘱状态如下
                </Typography>
                <Card
                  sx={{
                    padding: '10px',
                  }}
                >
                  <Typography align="center">确认进度：2/5</Typography>
                  <Typography align="center">触发阈值：3</Typography>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    gap={1}
                    my={1}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      padding={0}
                      sx={{ padding: 0 }}
                    >
                      {executed ? 'executed' : 'not execute'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color={death ? 'error' : 'success'}
                      sx={{ padding: 0 }}
                    >
                      {death ? 'dead' : 'not dead'}
                    </Button>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.floor((2 / 5) * 100)}
                  />
                  <Typography align="center" mt={2}>
                    验证者
                  </Typography>
                  {validators.map((val, index) => (
                    <Typography key={index} variant="body2" align="center">
                      {val.slice(0, 20) + '...' + val.slice(-15, -1)}
                      {/* {val} */}
                    </Typography>
                  ))}
                  <Typography align="center" mt={2}>
                    受益人
                  </Typography>
                  {allocations.map((val, index) => (
                    <Grid container key={index} sx={12}>
                      <Grid xs={3}>{val.token}</Grid>
                      <Grid xs={9} container>
                        {val.allocation.map((v, i) => {
                          return (
                            <>
                              <Grid xs={6}>
                                <Typography align="right">
                                  {v.beneficiaries.slice(0, 4) +
                                    '...' +
                                    v.beneficiaries.slice(-5, -1)}
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography align="right">
                                  {v.percentages}%
                                </Typography>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    </Grid>
                    // <Typography key={index} variant="body2" align="center">
                    //   {val.slice(0, 20) + '...' + val.slice(-15, -1)}
                    //   {/* {val} */}
                    // </Typography>
                  ))}
                  <Box display={'flex'} gap={1} mt={2}>
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

                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      color='primary'
                      onClick={() => {
                        console.log('AckDeath');
                      }}
                    >
                      AckDeath
                    </Button>
                  </Box>
                </Card>
              </Stack>
            </Stack>
          )}
        </Container>
      </Layout>
    </>
  );
}
export default Will;
