import { Avatar, Box, Button, Heading, Image, Text, useColorModeValue, useToast, VStack, Wrap } from "@chakra-ui/react";
import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import { TiTick, TiCancel } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { getImageByUrl } from "../contractMethods";
import { getProfilePicture } from "../utils";
import { voteImage } from "../contractMethods";

const ImageDetail = () => {

  const noOfVoters = 100;
  const { account } = useMetaMask();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const imageUrl = searchParams.get('url');
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const bg1 = useColorModeValue("white", "gray.900");

  const toast = useToast()

  const handleValid = async () => {
    const vote = await voteImage(imageUrl, 0);
    console.log(vote)
    if (vote.status === true) {

      toast(
        {
          title: 'Votado como Válido!',
          status: 'success',
          isClosable: true,
          duration: 3000,
        }
      )

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
        validness: response.positiveVotes.length / response.assignedVoters.length
      });
    }
    return vote;
  }

  const handleInvalid = async () => {
    const vote = await voteImage(imageUrl, 1);
    console.log(vote)
    if (vote.status === true) {

      toast(
        {
          title: 'Votado como Inválido!',
          status: 'success',
          isClosable: true,
          duration: 3000,
        }
      )
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
        validness: response.positiveVotes.length / response.assignedVoters.length
      });
    }
    return vote;
  }

  useEffect(() => {
    async function getImage() {
      const response = await getImageByUrl(imageUrl);
      console.log(response)
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
        validness: response.positiveVotes.length / response.assignedVoters.length
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
              <Text fontSize={'2xl'}>{data.validness * 100}% Válido</Text>
              <Text fontSize={'2xl'}>{data.isVotationOpen ? 'Votacion ABIERTA' : 'Votacion CERRADA'}</Text>
            </Box>
            <Box bgColor={bg1}
              rounded="lg"
              p={8}
              boxShadow="lg"
              gap={6}
              display={'flex'}
              flexDirection={'column'}
            >
              <Heading>Votación asignada a:</Heading>
              <Wrap>

                {data.assignedVoters.length === 0 ? <Text>Sin votantes asignados</Text>
                  : data.assignedVoters.map((voter) => (
                    <Avatar key={voter} src={getProfilePicture(voter)} cursor={'pointer'} onClick={() => navigate('/user/' + voter)} />
                  ))}
              </Wrap>
              {
                data.positiveVotes && data.positiveVotes.some(voter => voter.toLowerCase() === account.toLowerCase()) && (
                  <Text>Ya has votado como Válido</Text>
                )
              }
              {
                data.assignedVoters && !data.assignedVoters.some(voter => voter.toLowerCase() === account.toLowerCase()) && (
                  <Text>No te han asignado para votar</Text>
                )
              }
              {
                data.negativeVotes && data.negativeVotes.some(voter => voter.toLowerCase() === account.toLowerCase()) && (
                  <Text>Ya has votado como Inválido</Text>
                )
              }
            </Box>

            {
              data.isVotationOpen && data.assignedVoters && data.assignedVoters.some(voter => voter.toLowerCase() === account.toLowerCase())
              && data.positiveVotes && !data.positiveVotes.some(voter => voter.toLowerCase() === account.toLowerCase())
              && data.negativeVotes && !data.negativeVotes.some(voter => voter.toLowerCase() === account.toLowerCase())
              &&
              <Box>
                <Button leftIcon={<TiTick />} colorScheme='blue' mr={3} onClick={() => handleValid()}>
                  Válido
                </Button>
                <Button leftIcon={<TiCancel />} colorScheme='red' onClick={() => handleInvalid()}>
                  Inválido
                </Button>
              </Box>
            }
            {
              !data.isVotationOpen && (
                <Box bgColor={bg1}
                  rounded="lg"
                  p={8}
                  boxShadow="lg">
                  <Heading>Votado por {data.assignedVoters.length} personas</Heading>
                  <VStack>
                    <VStack>
                    <Text>Válido:</Text>
                    {data.positiveVotes}
                    </VStack>
                    <Text>Inválido: {data.negativeVotes}</Text>
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
              <Heading>Evidencias</Heading>
              {data.comments.length === 0 ? <Text>Sin evidencias todavía</Text>
                : data.comments.map((comment) => (
                  <Box border={'1px'} borderColor={'white'} borderRadius={'lg'} padding={4}>
                    <Text>Evidencia de <strong>{comment.user}</strong></Text>
                    <Text>{comment.text}</Text>
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