import { AppBar, Avatar, Box, Toolbar, Typography } from '@material-ui/core';

export const Navbar = () => (
  <AppBar
    elevation={0}
    sx={{ backgroundColor: '#1e212a' }}
  >
    <Toolbar
      disableGutters
      sx={{
        alignItems: 'center',
        display: 'flex',
        minHeight: 64,
        px: 3,
        py: 1
      }}
    >
      <Box sx={{ flexGrow: 1 }} />
      <Typography sx={{
        mr: 3,
        ml: 3
      }}
      >
        manager1
      </Typography>
      <Avatar
        alt="User"
      />
    </Toolbar>
  </AppBar>
);
