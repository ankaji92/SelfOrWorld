import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Container,
  Box,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Layout = () => {
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', description: 'ホーム' },
    { path: '/worldtree', label: 'WorldTree', description: '大事なこと' },
    { path: '/compact', label: 'Compact', description: '未来を眺める' },
    { path: '/immersion', label: 'Immersion', description: '明日を生きる' },
    { path: '/reliving', label: 'ReLiving', description: '過去を学ぶ' },
  ];

  const currentTab = navItems.findIndex((item) => item.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            SelfOrWorld
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            「私」と「世界」を知る
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <AppBar position="static" color="default" elevation={0}>
        <Tabs
          value={currentTab === -1 ? 0 : currentTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {navItems.map((item) => (
            <Tab
              key={item.path}
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              }
              component={RouterLink}
              to={item.path}
            />
          ))}
        </Tabs>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
