import { createTheme } from '@mui/material/styles';

// 和 (wa) - Japanese aesthetic color palette
export const getLightTheme = () => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#047857', // 深緑 (emerald-700)
      light: '#10b981',
      dark: '#065f46',
    },
    secondary: {
      main: '#44403c', // stone-700
      light: '#57534e',
      dark: '#292524',
    },
    background: {
      default: '#f5f5f4', // 和紙色
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif',
  },
});

// Dark mode: 夜の神社・寺 (灯籠、月明かり)
export const getDarkTheme = () => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7ca982', // 苔むした緑
      light: '#6b9270',
      dark: '#5a8060',
    },
    secondary: {
      main: '#f4a460', // 灯籠の光
      light: '#f5b97a',
      dark: '#e89350',
    },
    background: {
      default: '#0f1419', // 夜空の色
      paper: '#1a1f2e', // 境内の闇
    },
    text: {
      primary: '#e8e6e3', // 月明かりに照らされた白
      secondary: '#b8b5b2', // 薄い灯り
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif',
  },
});
