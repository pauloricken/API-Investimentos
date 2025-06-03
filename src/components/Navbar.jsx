import { Box, Flex, Link as ChakraLink, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Box bg="blue.500" px={4} py={3}>
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        <Heading size="md" color="white">
          <ChakraLink as={Link} to="/" _hover={{ textDecoration: 'none' }}>
            Sistema de Investimentos
          </ChakraLink>
        </Heading>
        <Flex gap={6}>
          <ChakraLink as={Link} to="/usuarios" color="white" _hover={{ textDecoration: 'underline' }}>
            Usuários
          </ChakraLink>
          <ChakraLink as={Link} to="/categorias" color="white" _hover={{ textDecoration: 'underline' }}>
            Categorias
          </ChakraLink>
          <ChakraLink as={Link} to="/investimentos" color="white" _hover={{ textDecoration: 'underline' }}>
            Investimentos
          </ChakraLink>
          <ChakraLink as={Link} to="/transacoes" color="white" _hover={{ textDecoration: 'underline' }}>
            Transações
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;