import { Box, Heading, Text, Image, Flex, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import logo from "../logo.png";
const AboutUs = () => {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} borderRadius={'lg'} px={12}>
      <Flex justifyContent="center" alignItems="center" flexDir="column" py={12}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <Heading as="h1" size="xl" mb={8}>
            Sobre nosotros
          </Heading>
          <Text fontSize="2xl" textAlign="center" mb={12}>
            Bienvenido a PicSure, una plataforma de verificación de contenido descentralizado mediado por una comunidad de personas auténticas.
          </Text>
        </motion.div>
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Image src={logo} alt="imagen" borderRadius="md" mb={8} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Box maxW="700px">
            <Text fontSize="xl" mb={4} fontWeight={'extrabold'}>
              Nuestro objetivo
            </Text>
            <Text fontSize="lg" mb={8}>
              Nuestro objetivo es brindar a nuestros usuarios una experiencia confiable y auténtica al ofrecer su producto.
            </Text>
            <Text fontSize="xl" mb={4} fontWeight={'extrabold'}>
              Proceso democrático de arbitraje
            </Text>
            <Text fontSize="lg" mb={8}>
              En PicSure, todo el contenido en nuestra plataforma es sometido a un proceso democrático de arbitraje, asegurando la transparencia y originalidad del contenido.
            </Text>
            <Text fontSize="xl" mb={4} fontWeight={'extrabold'}>
              Tecnología blockchain
            </Text>
            <Text fontSize="lg" mb={8}>
              Trabajamos con un sistema basado en tecnología blockchain, similar al protocolo de Proof of Humanity y Kleros, para garantizar la veracidad de la información de nuestros clientes.
            </Text>
            <Text fontSize="xl" mb={4} fontWeight={'extrabold'}>
              Autenticidad es la clave
            </Text>
            <Text fontSize="lg" mb={8}>
              En PicSure, creemos que la autenticidad es la clave para construir confianza y credibilidad en el mundo digital. Mejora tu reputación compartiendo contenido legítimo.
            </Text>
          </Box>
        </motion.div>
      </Flex>
    </Box>
  );
};

export default AboutUs;
