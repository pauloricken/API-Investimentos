import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [stats, setStats] = useState({
    usuarios: 0,
    categorias: 0,
    investimentos: 0,
    transacoes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, categorias, investimentos, transacoes] = await Promise.all([
          axios.get('http://localhost/api/public/index.php?rota=usuarios'),
          axios.get('http://localhost/api/public/index.php?rota=categorias'),
          axios.get('http://localhost/api/public/index.php?rota=investimentos'),
          axios.get('http://localhost/api/public/index.php?rota=transacoes')
        ]);

        setStats({
          usuarios: usuarios.data.length,
          categorias: categorias.data.length,
          investimentos: investimentos.data.length,
          transacoes: transacoes.data.length
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading mb={6}>Dashboard</Heading>
      <Text mb={8}>Bem-vindo ao Sistema de Gerenciamento de Investimentos</Text>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatGroup>
          <Stat bg="white" p={5} borderRadius="lg" shadow="md">
            <StatLabel>Usuários</StatLabel>
            <StatNumber>{stats.usuarios}</StatNumber>
          </Stat>
          <Stat bg="white" p={5} borderRadius="lg" shadow="md">
            <StatLabel>Categorias</StatLabel>
            <StatNumber>{stats.categorias}</StatNumber>
          </Stat>
          <Stat bg="white" p={5} borderRadius="lg" shadow="md">
            <StatLabel>Investimentos</StatLabel>
            <StatNumber>{stats.investimentos}</StatNumber>
          </Stat>
          <Stat bg="white" p={5} borderRadius="lg" shadow="md">
            <StatLabel>Transações</StatLabel>
            <StatNumber>{stats.transacoes}</StatNumber>
          </Stat>
        </StatGroup>
      </SimpleGrid>
    </Box>
  );
}

export default Home;