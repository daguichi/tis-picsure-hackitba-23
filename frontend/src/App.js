import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  Navigate,
  Routes
} from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import Home from './views/Home';
import ImageDetail from './views/ImageDetail';
import Profile from './views/Profile';
import User from './views/User';
import AboutUs from './views/AboutUs';
import { useMetaMask } from 'metamask-react';

function App() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  return (
    <ChakraProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<MainLayout />} >
            <Route index element={<Navigate to={status === 'connected' ? '/profile' : '/about-us'} /> } />
            <Route path='explore' element={<Home />} />
            <Route path='image' element={<ImageDetail />} />
            <Route path='profile' element={<Profile />} />
            <Route path='user/:id' element={<User />} />
            <Route path='about-us' element={<AboutUs />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
