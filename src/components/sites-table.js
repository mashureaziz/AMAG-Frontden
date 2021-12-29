import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import { Scrollbar } from './scrollbar';
import SiteAudit from './SiteAudit';

export const SitesTable = (props) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [siteNo, setSiteNo] = useState();
  const [siteId, setSiteId] = useState();
  // eslint-disable-next-line react/prop-types
  const { sites, toggleSave, setRefresh } = props;

  function handleClose() {
    setDisplayModal(false);
  }

  function handleEdit(site) {
    setSiteNo(site.siteNo);
    setSiteId(site.id);
    setDisplayModal(true);
  }

  return (
    <>
      <Modal
        sx={{
          top: '2%',
          overflowY: 'scroll',
          mb: 3
        }}
        open={displayModal}
        onClose={handleClose}
      >
        <div>
          <SiteAudit
            setRefresh={setRefresh}
            handleClose={handleClose}
            siteNo={siteNo}
            siteId={siteId}
            toggleSave={toggleSave}
          />
        </div>
      </Modal>
      <div>
        <Scrollbar>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Site Id
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Region
                </TableCell>
                <TableCell>
                  Latitude
                </TableCell>
                <TableCell>
                  Longitude
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.siteNo}>
                  <TableCell>
                    {`#${site.siteNo}`}
                  </TableCell>
                  <TableCell>
                    {site.name}
                  </TableCell>
                  <TableCell>
                    {`${site.region}`}
                  </TableCell>
                  <TableCell>
                    {`${site.latitude}`}
                  </TableCell>
                  <TableCell>
                    {`${site.longitude}`}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => { handleEdit(site); }}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </div>

    </>
  );
};

SitesTable.propTypes = {
  sites: PropTypes.array.isRequired
};
