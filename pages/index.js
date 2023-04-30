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
import { useTheme } from '@mui/material/styles';

function HomePage() {
  const theme = useTheme();
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
      </Container>
      {/* <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
        </a>
        Connect with Web3Auth
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      </div> */}
    </Layout>
  );
}

export default HomePage;
