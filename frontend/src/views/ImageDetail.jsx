import { Avatar, Box, Button, Heading, Image, Text, useColorModeValue, VStack, Wrap } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { TiTick, TiCancel } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { getImageByUrl } from "../contractMethods";
import { getProfilePicture } from "../utils";


const ImageDetail = () => {

  const noOfVoters = 100;
  const { account } = useMetaMask();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const imageUrl = searchParams.get('url');
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const bg1 = useColorModeValue("white", "gray.900");
  useEffect(() => {
    async function getImage() {
      const response = await getImageByUrl(imageUrl);
      setData({
        url: response.url,
        title: response.description,
        owner: response.owner,
        uploadDate: response.uploadDate,
        isVotationOpen: response.isVotationOpen,
        assignedVoters: response.assignedVoters,
        positiveVotes: response.positiveVotes,
        negativeVotes: response.negativeVotes,
        comments: response.comments,
        validness: response.positiveVotes / noOfVoters
      });
    }
    getImage();
  }, [imageUrl]);

  return (
    <>
      {
        data && (
          <VStack>

            <Box
              bgColor={bg1}
              rounded="lg"
              p={8}
              boxShadow="lg"
              w="70%"
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              flexDirection={'column'}
              gap={6}
              borderColor={data.validness > 0.5 ? 'green.500' : 'red.500'}
              borderWidth={'2px'}
            >
              <Heading alignSelf={'center'}>{data.title}</Heading>
              <Image
                src={data.url}
                alt={`Picture of ${data.title}`}
                roundedTop="lg"
              />
              <Text fontSize={'2xl'}>{data.validness * 100}% Valid</Text>
            </Box>
            <Box bgColor={bg1}
              rounded="lg"
              p={8}
              boxShadow="lg"
              gap={6}
              display={'flex'}
              flexDirection={'column'}
            >
              <Heading>Voting assigned to:</Heading>
              <Wrap>

                {data.assignedVoters.length === 0 ? <Text>No voters yet</Text>
                  : data.assignedVoters.map((voter) => (
                    <Avatar key={voter} src={getProfilePicture(voter)} cursor={'pointer'} onClick={() => navigate('/user/' + voter)} />
                  ))}
              </Wrap>
            </Box>
            {
              data.isVotationOpen && data.assignedVoters.includes(account) &&
              <Box>
                <Button leftIcon={<TiTick />} colorScheme='blue' mr={3} onClick={() => console.log('accept')}>
                  Valid
                </Button>
                <Button leftIcon={<TiCancel />} colorScheme='red' onClick={() => console.log('Invalid')}>
                  Invalid
                </Button>
              </Box>
            }
            {
              !data.isVotationOpen && (
                <Box bgColor={bg1}
                  rounded="lg"
                  p={8}
                  boxShadow="lg">
                  <Heading>Voted by {data.assignedVoters.length} persons</Heading>
                  <VStack>
                    <Text>Valid: {data.positiveVotes}</Text>
                    <Text>Invalid: {data.negativeVotes}</Text>
                  </VStack>
                </Box>
              )
            }
            <Box bgColor={bg1}
              rounded="lg"
              p={8}
              boxShadow="lg"
              gap={6}
              display={'flex'}
              flexDirection={'column'}
            >
              <Heading>Evidences</Heading>
              {data.comments.length === 0 ? <Text>No evidences yet</Text>
                : data.comments.map((comment) => (
                  <Box border={'1px'} borderColor={'white'} borderRadius={'lg'} padding={4}>
                    <Text>Comment by {comment.user}</Text>
                    <Text>{comment.comment}</Text>
                  </Box>
                ))}
            </Box>
          </VStack>
        )
      }

    </>
  );

}

export default ImageDetail;