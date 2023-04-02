import { Avatar, Box, Button, Divider, Heading, HStack, Image, Progress, Text, Tooltip, useColorModeValue, useToast, VStack, Wrap } from "@chakra-ui/react";
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
          <VStack spacing={8}>
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
              borderColor={!data.isVotationOpen ? (data.validness > 0.5 ? 'green.500' : 'red.500') : null}
              borderWidth={'2px'}
            >

              <Heading alignSelf={'center'}>{data.title}</Heading>
              <Image
                src={data.url}
                alt={`Picture of ${data.title}`}
                roundedTop="lg"
              />
              {
                !data.isVotationOpen &&
                <Text fontSize={'2xl'}>{data.validness * 100}% Válido</Text>
              }

              <Text fontSize={'2xl'}>{data.isVotationOpen ? 'Votación ABIERTA' : 'Votación CERRADA'}</Text>
              <Text fontSize={'lg'}>{
                data.isVotationOpen ? 'Todavía no se pueden sacar conclusiones acerca de la validez de la imagen' : 'La votación ha finalizado y se puede sacar una conclusión acerca de la validez de la imagen'
              }</Text>
            </Box>
            {
              data.isVotationOpen && data.assignedVoters && data.assignedVoters.some(voter => voter.toLowerCase() === account.toLowerCase())
              && data.positiveVotes && !data.positiveVotes.some(voter => voter.toLowerCase() === account.toLowerCase())
              && data.negativeVotes && !data.negativeVotes.some(voter => voter.toLowerCase() === account.toLowerCase())
              &&
              <>
                <Box w={'70%'}>
                  <Button leftIcon={<TiTick />} colorScheme='blue' mr={3} onClick={() => handleValid()}>
                    Válido
                  </Button>
                  <Button leftIcon={<TiCancel />} colorScheme='red' onClick={() => handleInvalid()}>
                    Inválido
                  </Button>
                </Box>
              </>
            }
            <Divider w={'70%'} />

            <Box bgColor={bg1}
              rounded="lg"
              p={8}
              boxShadow="lg"
              gap={6}
              w={'70%'}
              display={'flex'}
              flexDirection={'column'}
            >
              <Heading>Votación asignada a:</Heading>
              <Wrap>

                {data.assignedVoters.length === 0 ? <Text>Sin votantes asignados</Text>
                  : data.assignedVoters.map((voter) => (
                    <Tooltip label={
                      voter
                    }>
                      <Avatar key={voter} src={getProfilePicture(voter)} cursor={'pointer'} onClick={() => navigate('/user/' + voter)} />
                    </Tooltip>
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
              !data.isVotationOpen && (
                <Box bgColor={bg1}
                  rounded="lg"
                  p={8}
                  w={'70%'}
                  boxShadow="lg">
                  <Heading>Votado por {data.assignedVoters.length} personas</Heading>
                  <HStack mt={4}>
                    <Box borderRadius={'md'}
                      border={'1px'}
                      borderColor={'green.500'}
                      borderStyle={'dotted'}
                      w={'50%'}
                      p={4}
                    >
                      <Text>Válidos: <b>{data.positiveVotes.length}</b></Text>
                      <Wrap>

                        {data.positiveVotes.length === 0 ? <Text>Sin positivos</Text>
                          : data.positiveVotes.map((voter) => (
                            <Tooltip label={voter}>
                              <Avatar key={voter} src={getProfilePicture(voter)} cursor={'pointer'} onClick={() => navigate('/user/' + voter)} />
                            </Tooltip>
                          ))}
                      </Wrap>
                    </Box>
                    <Box borderRadius={'md'}
                      w={'50%'}
                      border={'1px'}
                      borderColor={'red.500'}
                      borderStyle={'dotted'}
                      p={4}
                    >
                      <Text>Inválidos: <b>{data.negativeVotes.length}</b></Text>
                      <Wrap>

                        {data.negativeVotes.length === 0 ? <Text>Sin negativos</Text>
                          : data.negativeVotes.map((voter) => (
                            <Tooltip label={voter}>
                              <Avatar key={voter} src={getProfilePicture(voter)} cursor={'pointer'} onClick={() => navigate('/user/' + voter)} />
                            </Tooltip>
                          ))}
                      </Wrap>
                    </Box>
                  </HStack>

                </Box>
              )
            }
            <Divider w={'70%'} />
            <Box bgColor={bg1}
              rounded="lg"
              p={8}
              boxShadow="lg"
              gap={6}
              w={'70%'}
              display={'flex'}
              flexDirection={'column'}
            >
              <Heading>Evidencias</Heading>
              {data.comments.length === 0 ? <Text>Sin evidencias todavía</Text>
                : data.comments.map((comment) => (
                  <Box border={'1px'} borderColor={'white'} borderRadius={'lg'} padding={4}
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    spacing={4}
                  >
                    <Tooltip label={comment.user}>
                      <Avatar src={getProfilePicture(comment.user)} cursor={'pointer'} onClick={() => navigate('/user/' + comment.user)} />
                    </Tooltip>
                    <Text ml={4} fontStyle={'italic'}>{comment.text}</Text>
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