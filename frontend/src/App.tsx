import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import WorldTree from './pages/WorldTree';
import Compact from './pages/Compact';
import Immersion from './pages/Immersion';
import ReLiving from './pages/ReLiving';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="worldtree" element={<WorldTree />} />
            <Route path="compact" element={<Compact />} />
            <Route path="immersion" element={<Immersion />} />
            <Route path="reliving" element={<ReLiving />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
