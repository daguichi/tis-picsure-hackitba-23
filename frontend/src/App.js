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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path='image' element={<ImageDetail />} />
            <Route path='profile' element={<Profile />} />
            <Route path='user/:id' element={<User />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
