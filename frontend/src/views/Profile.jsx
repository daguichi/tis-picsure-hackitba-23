import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import { Box, Text, Image, Button, useColorModeValue, Avatar } from '@chakra-ui/react';

const ProfileView = () => {
  const { status, account, balance } = useMetaMask();
  return (
    <Box p={6} boxShadow="md" rounded="md"
      bgColor={useColorModeValue("white", "gray.900")}

    >
      <Avatar alt="Profile avatar" rounded="full" boxSize="150px" />
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Account
      </Text>
      <Text fontSize="lg" color="gray.500">
        {account}
      </Text>
      <Text fontSize="lg" color="green.500">
        {balance}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Images uploaded
      </Text>
    </Box>
  );
};

export default ProfileView;
