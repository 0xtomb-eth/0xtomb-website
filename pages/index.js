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
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import Layout from '@/layout/Layout';

function HomePage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendMesaage, setSendMesaage] = useState('');
  const [processedEmail, setProcessedEmail] = useState('');
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, '']);
  };
  const removeField = (index) => {
    setFields([...fields, '']);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });
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
        {fields.map((text, index) => (
          <Controller
            name={`beneficiary${index}`}
            control={control}
            key={index}
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
                  <Button onClick={addField} variant="contained">
                    +
                  </Button>
                </Grid>
                <Grid xs={1}>
                  <Button
                    onClick={() => {
                      removeField(index);
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

        <Button onClick={addField}>Add Field</Button>
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
