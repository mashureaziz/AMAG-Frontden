/* eslint-disable react/prop-types */
import React, { useState, useEffect, Fragment } from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import {
  validateCordinate,
  validateRequired,
  capitalizeFirstLetter,
  convertDate
} from '../utils/helperFunctions';
import { sendRequest } from '../utils/sendRequest';

// Set theme properties
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d0733',
    },
    secondary: {
      main: '#f2f2f2',
    },
  },
});

export default function SiteAudit(props) {
  // Fetch props
  let isNew = true;
  const { siteNo, siteId, handleClose, toggleSave, setRefresh } = props;
  if (siteId) {
    isNew = false;
  }

  // Setup Form constraints
  const maxLengths = {
    Name: 40,
    Region: 40,
    Description: 200,
    Longitude: 12,
    Latitude: 12,
  };

  // Setup Internal States
  const [disableSubmit, setDisableSubmit] = useState(!isNew);
  const [audits, setAudits] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({
    Name: '',
    Region: '',
    Description: '',
    Latitude: '',
    Longitude: '',
  });
  const [defaultValues, setDefaultValues] = useState({
    name: '',
    region: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  // Render Audit Log
  const renderedAudits = audits.map((audit) => (
    <li key={audit.id}>
      {`${capitalizeFirstLetter(audit.actionType)} by`}
      {' '}
      <span className="auditor">
        {' '}
        {audit.user.name}
      </span>
      {' '}
      on
      {' '}
      {`
        ${convertDate(process.env.REACT_APP_TIME_OFFSET, audit.date)}
      (UTC ${process.env.REACT_APP_TIME_OFFSET})`}
    </li>
  ));

  // Handle form change
  const handleFormChange = () => {
    if (disableSubmit) {
      setDisableSubmit(false);
    }
  };
  // Handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let hasErrors = false;
    data.forEach((val, key) => {
      let validationResult;

      // Validate Latitude and Longitude
      if (key === 'Latitude' || key === 'Longitude') {
        validationResult = validateCordinate(key, val, maxLengths);
        if (validationResult.error) {
          setErrors((prev) => ({ ...prev, [key]: `${validationResult.message}` }));
          if (!hasErrors) hasErrors = true;
          return;
        }
      }

      // Validate required fields and maxlength
      validationResult = validateRequired(key, val, maxLengths);
      if (validationResult.error) {
        setErrors((prev) => ({ ...prev, [key]: `${validationResult.message}` }));
        if (!hasErrors) hasErrors = true;
      } else {
        setErrors((prev) => ({ ...prev, [key]: '' }));
      }
    });

    // Check if Form is error free
    if (!hasErrors) {
      setSending(true);

      // Convert Form data to JSON
      let content = {};
      data.forEach((val, key) => {
        content[key.toLowerCase()] = val;
      });
      content = { ...content, user: '61c99b478b1d34621110d48b', siteNo: parseInt(Math.random() * 100 + 50, 10) };

      // Send HTTP Request
      sendRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/site/${!isNew ? `${siteId}` : ''}`, isNew ? 'POST' : 'PUT', content)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('API request failed. Try again');
        })
        .then((res) => {
          console.log(res);
          toggleSave();
          setRefresh((prev) => !prev);
          handleClose();
        })
        .catch((err) => { console.log(err.message); });
    }
  };

  useEffect(() => {
    // Fetch Site Data and Audit Logs
    if (!isNew) {
      setFetching(true);
      sendRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/site/${siteId}`, 'GET')
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('API request failed. Try again');
        })
        .then((data) => {
          console.log(data);
          setAudits(data.audits);
          const { name, region, description, latitude, longitude } = data;
          setDefaultValues({ name, region, description, latitude, longitude });
          setFetching(false);
        })
        .catch((err) => { console.log(err.message); });
    }
  }, [isNew]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
      >
        <CssBaseline />
        <Box
          sx={{
            width: '100%',
            overflowY: 'scroll',
            borderRadius: 1,
            height: '78vh',
            backgroundColor: '#fff',
            padding: '5%',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="form"
            noValidate
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid
              container
              spacing={2}
            >
              {fetching && (
                <div className="circular_loader">
                  <CircularProgress />
                </div>
              )}
              {!fetching && (
                <>
                  <Grid
                    item
                    sm={2}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          width: '120px',
                          backgroundColor: 'secondary.main',
                          padding: '10px',
                        }}
                      >
                        Site Id:
                        {' '}
                        {siteNo}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <TextField
                      error={!!errors.Name}
                      defaultValue={defaultValues.name}
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="Name"
                      data-test="name"
                      helperText={errors.Name}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <TextField
                      defaultValue={defaultValues.region}
                      error={!!errors.Region}
                      required
                      fullWidth
                      id="region"
                      label="Jurisdiction/City/Region"
                      name="Region"
                      helperText={errors.Region}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <TextField
                      defaultValue={defaultValues.description}
                      error={!!errors.Description}
                      multiline
                      minRows={2}
                      required
                      fullWidth
                      id="siteDescription"
                      label="Site Description"
                      name="Description"
                      helperText={errors.Description}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >
                    <TextField
                      defaultValue={defaultValues.latitude}
                      error={!!errors.Latitude}
                      name="Latitude"
                      required
                      fullWidth
                      id="siteLatitude"
                      label="Latitude"
                      autoFocus
                      helperText={errors.Latitude}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >
                    <TextField
                      defaultValue={defaultValues.longitude}
                      error={!!errors.Longitude}
                      required
                      fullWidth
                      id="siteLongitude"
                      label="Longitude"
                      name="Longitude"
                      helperText={errors.Longitude}
                    />
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                  />
                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >
                    <LoadingButton
                      id="save"
                      disabled={disableSubmit}
                      loading={sending}
                      type="submit"
                      fullWidth
                      variant="contained"
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </LoadingButton>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                  >
                    <Button
                      onClick={handleClose}
                      disabled={sending}
                      fullWidth
                      variant="outlined"
                      endIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                  >
                    {!isNew && (
                      <Box
                        sx={{
                          backgroundColor: 'secondary.main',
                          padding: '20px',
                          mt: 3,
                          mb: 3,
                        }}
                      >
                        <Typography variant="h6"> Audit Log: </Typography>
                        <ul>{renderedAudits}</ul>
                      </Box>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
