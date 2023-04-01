import { Box, useColorModeValue, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
function MainLayout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
    }}>
      <Nav />
      <Box as="main" bg={useColorModeValue('gray.50', 'gray.800')} p={8} >
        <Outlet />
      </Box>
      <Footer style={{ flexShrink: 0 }} />
    </div>
  )
}

export default MainLayout;