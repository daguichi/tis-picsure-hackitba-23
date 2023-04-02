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
            <Heading as="h1" size="xl" mb={8}>
              ¡Bienvenido a PicSure!
            </Heading>
            <Text fontSize="lg" mb={8}>
              Somos un protocolo <strong>descentralizado</strong> de{" "}
              <strong>verificación</strong> de contenido mediado por una comunidad de
              personas <strong>autenticas</strong>. Dirigido a creadores de contenido
              que deseen tener una reputación de{" "}
              <strong>transparencia y originalidad</strong>.
            </Text>
            <Text fontSize="lg" mb={8}>
              Nuestro objetivo es brindar a nuestros usuarios una experiencia
              confiable y <strong>auténtica</strong> al ofrecer su producto. Nos
              enorgullece decir que todo el contenido en nuestra plataforma es
              sometido a un <strong>proceso democrático</strong> de arbitraje.
            </Text>
            <Text fontSize="lg" mb={8}>
              Trabajamos con un sistema basado en tecnología blockchain, similar al
              protocolo de Proof of Humanity y Kleros, para garantizar la veracidad de
              la informacion de nuestros clientes.
            </Text>
            <Text fontSize="lg" mb={8}>
              En PicSure, creemos que la <strong>autenticidad</strong> es la clave
              para construir <strong>confianza</strong> y{" "}
              <strong>credibilidad</strong> en el mundo digital. Mejora tu reputacion
              compartiendo contenido <strong>legitimo</strong>.
            </Text>
            <Text fontSize='lg' mb={8}>
              Estamos emocionados de ser parte de tu experiencia en línea!
            </Text>
            <Text fontSize="xl" mb={4} fontWeight={'extrabold'}>
              ¿Estas listo para unirte a la era de la transparencia digital?
            </Text>
            
          </Box>
        </motion.div>
      </Flex>
    </Box>
  );
};

export default AboutUs;
