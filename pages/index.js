import {
  Box,
  Container,
  Select,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
  Stack,
  List,
  ListItem,
  Grid,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Layout from '../layout/Layout';

function HomePage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendMesaage, setSendMesaage] = useState('');
  const [processedEmail, setProcessedEmail] = useState('');
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = handleSubmit((data) => {
    let fieldValue = [];
    data.beneficiary.forEach((val) => {
      fieldValue.push(val.beneficiary);
    });
    data.beneficiary = fieldValue;
    console.log(data);
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'beneficiary', // unique name for your Field Array
    }
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {});

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
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField value={value} label="姓名" onChange={onChange} />
          )}
        />
        <Controller
          name="epitaph"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextField value={value} label="遗嘱" onChange={onChange} />
          )}
        />
        <Divider />
        <Typography>请填入受益人的地址</Typography>
        {fields.map(({ id }, index) => (
          <Controller
            name={`beneficiary[${index}].beneficiary`}
            control={control}
            key={id}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Grid container gap={2} alignItems={'center'}>
                <Grid xs={9}>
                  <Box>
                    <TextField
                      fullWidth
                      value={value}
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
          onClick={() => {
            const b = getValues('beneficiary');
            console.log(
              b.map((val) => {
                return val.beneficiary;
              })
            );
          }}
        >
          Comfirm beneficiary
        </Button>
        <Divider />
        <Typography>资产分配</Typography>

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
