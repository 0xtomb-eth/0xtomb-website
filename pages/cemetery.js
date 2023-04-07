import {
  Box,
  Container,
  Select,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  DialogContentText,
  DialogContent,
  LinearProgress,
  DialogActions,
  DialogTitle,
  Dialog,
  CardMedia,
  Button,
  Divider,
  Snackbar,
  Alert,
  Stack,
  List,
  ListItem,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Slide,
} from '@mui/material';
import Layout from '../layout/Layout';
import React from 'react';
import { useState } from 'react';
import MintTomb from '../components/MintTomb';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Cemetery() {
  return (
    <>
      <Layout>
        <Container
          // maxWidth="lg"
          width="100%"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: 'full',
            justifyContent: 'start',
            mt: 6,
            gap: 2,
          }}
        >
          <MintTomb></MintTomb>
        </Container>
      </Layout>
    </>
  );
}
export default Cemetery;
