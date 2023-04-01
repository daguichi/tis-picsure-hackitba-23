import { Box, useColorModeValue, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
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
      <Box as="main" bg={useColorModeValue('gray.50', 'gray.800')} >
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout;