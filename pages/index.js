import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import WILL_ABI from '../abi/willAbi.json';

import Layout from '../layout/Layout';
import showMessage from '../components/showMessage';
import { useContractWrite } from 'wagmi';

function HomePage() {
  const [open, setOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
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

  const { data, writeAsync } = useContractWrite({
    address: '0x630852804e7da852564d5E7437E570d77Ef9Faf6',
    abi: WILL_ABI,
    functionName: 'setAllocation',
    mode: 'recklesslyUnprepared',
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!data?.amount) {
      return;
    }
    let fieldValue = [];
    data.beneficiary = data.beneficiary.map((val) => {
      return val.beneficiary;
    });
    data.amount = data.amount.map((i) => {
      return i.map((j) => j.amount);
    });
    try {
      const res = await Promise.all(
        data.amount.map(async (val) => {
          return await writeAsync?.({
            recklesslySetUnpreparedArgs: [
              '0x630852804e7da852564d5E7437E570d77Ef9Faf6',
              data.beneficiary,
              val,
            ],
          });
        })
      );
    } catch (error) {
      console.log(error);
      showMessage({
        type: 'error',
        title: 'Fail to Tx',
        body: JSON.stringify(error),
      });
    }
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          mt: 6,
          gap: 2,
        }}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: '请输入姓名' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              label="姓名"
              error={errors?.name?.message}
              helperText={errors?.name?.message}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="epitaph"
          control={control}
          rules={{ required: '请输入墓志铭' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value}
              label="墓志铭"
              error={errors?.epitaph?.message}
              helperText={errors?.epitaph?.message}
              onChange={onChange}
            />
          )}
        />
        <Divider />
        <Typography>请填入受益人的地址</Typography>
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
                      required
                      value={value}
                      error={
                        (errors != undefined) &
                          (errors?.beneficiary?.length > 0) &&
                        errors?.beneficiary[index]?.beneficiary?.message
                      }
                      helperText={
                        (errors != undefined) &
                        (errors?.beneficiary?.length > 0)
                          ? errors?.beneficiary[index]?.beneficiary?.message
                          : ''
                      }
                      onChange={onChange}
                      label={`受益方 ${index + 1}`}
                    />
                  </Box>
                </Grid>
                <Grid xs={1}>
                  <Button onClick={append} variant="contained">
                    +
                  </Button>
                </Grid>
                <Grid xs={1}>
                  <Button
                    onClick={() => {
                      remove(index);
                    }}
                    variant="contained"
                  >
                    -
                  </Button>
                </Grid>
              </Grid>
            )}
          />
        ))}

        <Button onClick={append}>Add Field</Button>
        <Button
          disabled={!fields.length}
          onClick={() => {
            const b = getValues('beneficiary');
            const beneficiaries = b
              .map((val) => {
                return val.beneficiary;
              })
              .filter((item) => item != null && item !== '');
            if (beneficiaries.length == 0) {
              onSubmit();
            }
            setBeneficiaries(beneficiaries);
          }}
        >
          Confirm beneficiary
        </Button>
        <Divider />
        <Typography>资产分配</Typography>
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
                          {value?.slice(0, 5) + '...' + value?.slice(-5, -1)}
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
                                  ? errors?.amount[index][index2].amount.message
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
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          autoHideDuration={1000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Send Success
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}

export default HomePage;
