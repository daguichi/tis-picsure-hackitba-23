import * as React from "react";
import {
  Container,
  FormLabel,
  Input,
  Button,
  Box,
  useColorModeValue,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = React.useState();

  return (
    <Box
      bgColor={useColorModeValue("white", "gray.900")}
      rounded="lg"
      p={5}
      boxShadow="xl"
      w={'2xl'}
    >
      <VStack w={"full"} p={2} spacing={3}>
        <Container>
          <FormLabel>Search</FormLabel>
          <Input
            type="text"
            placeholder={'Search images'}
            name="query"
            variant="filled"
            defaultValue={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </Container>

        <Container>
          <HStack justifyContent={"center"}>
            <Button
              leftIcon={<SearchIcon />}
              w={"35%"}
              colorScheme="blue"
              type="submit"
              marginTop={6}
              alignSelf={"center"}
            >
              Search
            </Button>
          </HStack>
        </Container>
      </VStack>
    </Box>
  );
};

export default SearchBar;
