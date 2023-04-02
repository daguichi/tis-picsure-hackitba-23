import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { useNavigate } from 'react-router-dom';
import { useMetaMask } from 'metamask-react';
import { publishImage } from '../contractMethods';
import { getProfilePicture } from '../utils';
import logo from '../logo.png'
import MetamaskStatus from '../MetamaskStatus';

function UploadButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const onSubmit = async (data) => {
    console.log(data)

    const { title, url } = data

    const res = await publishImage(url, title)
    if (res.status === true) {
      toast(
        {
          title: 'Image uploaded',
          status: 'success',
          isClosable: true,
          duration: 3000,
        }
      )
      onClose()
    }
  }

  const { handleSubmit, register } = useForm()

  return (
    <>
      <Button
        variant={'solid'}
        colorScheme={'teal'}
        size={'sm'}
        mr={4}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Upload
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload your image</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input placeholder='Title' {...register('title')} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>URL</FormLabel>
                <Input placeholder='URL' {...register('url')} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type='submit' colorScheme='blue' mr={3}>
                Upload
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

const Links = [
  {
    name: 'Explorar',
    href: 'explore'
  },
  {
    name: 'Sobre nosotros',
    href: 'about-us'
  }
];

const NavLink = ({ children, href }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}
  >
    {children}
  </Link>
);

const Nav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { account } = useMetaMask();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box cursor={'pointer'} onClick={() => navigate('/')}>
            <Image src={logo} alt='logo' height="40px" />
          </Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} href={link.href}>{link.name}</NavLink>
            ))}
          </HStack>
        </HStack>

        {
          account ?

          <Flex alignItems={'center'}>
            <ColorModeSwitcher mr={4}/>
            <UploadButton />
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  src={getProfilePicture(account)}
                  size={'sm'}

                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                {/* <MenuDivider />
              <MenuItem>Log out</MenuItem> */}
              </MenuList>
            </Menu>
          </Flex> :
          <MetamaskStatus/>
        }

      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

export default Nav;