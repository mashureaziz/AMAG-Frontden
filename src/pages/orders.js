import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Button, Card, Container, Divider, TablePagination, Typography } from '@material-ui/core';
import Modal from '@mui/material/Modal';
import CheckIcon from '@mui/icons-material/Check';
import { SitesTable } from '../components/sites-table';
import { orders } from '../__mocks__/orders';
import { sendRequest } from '../utils/sendRequest';
import SiteAudit from '../components/SiteAudit';

export const Orders = () => {
  const [refresh, setRefresh] = useState(false);
  const [save, setSave] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [sites, setSites] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const toggleSave = () => {
    setSave(true);
    setTimeout(() => {
      setSave(false);
    }, 5000);
  };

  const handleClose = () => {
    setDisplayModal(false);
  };

  const toggleModal = () => {
    setDisplayModal(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    sendRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/sites`, 'GET')
      .then((res) => {
        if (res.ok) {
          // setLoading(false);
          return res.json();
        }
        throw new Error('API request failed. Try again');
      })
      .then((res) => {
        setSites(res);
      })
      .catch((err) => { console.log(err.message); });
  }, [refresh]);

  return (
    <>
      <Modal
        sx={{
          top: '2%',
          overflowY: 'scroll',
          mb: 3
        }}
        open={displayModal}
      >
        <div>
          <SiteAudit
            siteNo={parseInt(Math.random() * 100 + 50, 10)}
            toggleSave={toggleSave}
            handleClose={handleClose}
            setRefresh={setRefresh}
          />
        </div>
      </Modal>
      <Helmet>
        <title>Sites</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          pb: 3,
          pt: 8
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              mb: 3
            }}
          >
            <Typography
              sx={{ width: '7%' }}
              color="textPrimary"
              variant="h4"
            >
              Sites
            </Typography>
            <Box sx={{ backgroundColor: '#01321f' }}>
              {save && (
              <Typography
                sx={{ padding: 0.5,
                  pr: 2,
                  pad: 2 }}
                color="#fff"
              >
                <CheckIcon color="fff" />
                Save Complete
              </Typography>
              )}

            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={toggleModal}
              color="primary"
              size="large"
              variant="contained"
            >
              Add
            </Button>
          </Box>
          <Card variant="outlined">
            <Divider />
            <SitesTable
              setRefresh={setRefresh}
              sites={sites}
              toggleSave={toggleSave}
            />
            <Divider />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};
