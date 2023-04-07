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
import WILL_ABI from '../abi/willAbi.json';

import Layout from '../layout/Layout';
import showMessage from '../components/showMessage';
import { useContractWrite } from 'wagmi';

function HomePage() {
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

  const { data, writeAsync } = useContractWrite({
    address: '0x630852804e7da852564d5E7437E570d77Ef9Faf6',
    abi: WILL_ABI,
    functionName: 'setAllocation',
    mode: 'recklesslyUnprepared',
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    console.log(data);
    data.beneficiary = data.beneficiary.map((val) => {
      return val.beneficiary;
    });
    data.validator = data.validator.map((val) => {
      return val.validator;
    });
    data.amount = data.amount?.map((i) => {
      return i.map((j) => j.amount);
    });
    // try {
    //   const res = await Promise.all(
    //     data.amount.map(async (val) => {
    //       return await writeAsync?.({
    //         recklesslySetUnpreparedArgs: [
    //           '0x7Bcf6f55E7136960A5602d6AB6bc163C7D7C4902',
    //           data.beneficiary,
    //           val,
    //         ],
    //       });
    //     })
    //   );
    //   showMessage({
    //     type: 'success',
    //     title: 'Sign Will Success',
    //     message: JSON.stringify(res),
    //   });
    //   setLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   showMessage({
    //     type: 'error',
    //     title: 'Fail to Tx',
    //     body: JSON.stringify(error),
    //   });
    //   setLoading(false);
    // }
  });

  useEffect(() => {
    if (!fields.length) {
      append();
    }
  }, [fields]);

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
                Sign Your Will Sign Your Will Sign
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
              >
                Sign Your Will Sign Your Will Sign
              </Typography>
              {fields.map(({ id }, index) => (
                <Controller
                  name={`[${index}].validator`}
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
                            // error={errors?.beneficiary?.length > 0}
                            // helperText={
                            //   errors?.beneficiary?.length > 0
                            //     ? errors?.beneficiary[index]?.beneficiary
                            //         ?.message
                            //     : ''
                            // }
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
                Sign Your Will Sign Your Will Sign
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
                Sign Your Will Sign Your Will Sign
              </Typography>
              {[{ name: 'ETH' }, { name: 'USDT' }].map((value, index) => {
                return (
                  <Grid key={index} container spacing={1}>
                    <Grid xs={3}>
                      <Typography>{value.name}</Typography>
                    </Grid>
                    <Grid xs={3}>
                      <Typography>{value.amount}</Typography>
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
                                name={`amount.${index}.${index2}.amount`}
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
                    variant="contained"
                    onClick={onSubmit}
                  >
                    Submit
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
                color={active == index + 1 ? 'black' : '#a2a9b4'}
                textTransform={'capitalize'}
              >
                {v}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default HomePage;
