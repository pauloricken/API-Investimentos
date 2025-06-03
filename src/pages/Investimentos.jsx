import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Investimentos() {
  const [investimentos, setInvestimentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editingInvestimento, setEditingInvestimento] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    usuario_id: '',
    id_categoria: ''
  });
  const toast = useToast();

  const fetchData = async () => {
    try {
      const [investimentosRes, categoriasRes, usuariosRes] = await Promise.all([
        axios.get('http://localhost/api/public/index.php?rota=investimentos'),
        axios.get('http://localhost/api/public/index.php?rota=categorias'),
        axios.get('http://localhost/api/public/index.php?rota=usuarios')
      ]);
      
      setInvestimentos(investimentosRes.data);
      setCategorias(categoriasRes.data);
      setUsuarios(usuariosRes.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        valor: parseFloat(formData.valor)
      };

      if (editingInvestimento) {
        await axios.put('http://localhost/api/public/index.php?rota=investimentos', {
          ...payload,
          id: editingInvestimento.id
        });
      } else {
        await axios.post('http://localhost/api/public/index.php?rota=investimentos', payload);
      }
      
      onClose();
      fetchData();
      setFormData({ nome: '', valor: '', usuario_id: '', id_categoria: '' });
      setEditingInvestimento(null);
      
      toast({
        title: `Investimento ${editingInvestimento ? 'atualizado' : 'criado'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar investimento',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost/api/public/index.php?rota=investimentos', {
        data: { id }
      });
      fetchData();
      toast({
        title: 'Investimento deletado com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao deletar investimento',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (investimento) => {
    setEditingInvestimento(investimento);
    setFormData({
      nome: investimento.nome,
      valor: investimento.valor.toString(),
      usuario_id: investimento.usuario_id,
      id_categoria: investimento.id_categoria
    });
    onOpen();
  };

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading mb={6}>Investimentos</Heading>
      <Button colorScheme="blue" mb={4} onClick={() => {
        setEditingInvestimento(null);
        setFormData({ nome: '', valor: '', usuario_id: '', id_categoria: '' });
        onOpen();
      }}>
        Novo Investimento
      </Button>

      <Table variant="simple" bg="white" shadow="md" borderRadius="lg">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Valor</Th>
            <Th>Categoria</Th>
            <Th>Usuário</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {investimentos.map((investimento) => (
            <Tr key={investimento.id}>
              <Td>{investimento.nome}</Td>
              <Td>R$ {investimento.valor.toFixed(2)}</Td>
              <Td>
                {categorias.find(c => c.id === investimento.id_categoria)?.nome}
              </Td>
              <Td>
                {usuarios.find(u => u.id === investimento.usuario_id)?.nome}
              </Td>
              <Td>
                <Button size="sm" colorScheme="yellow" mr={2} onClick={() => handleEdit(investimento)}>
                  Editar
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(investimento.id)}>
                  Excluir
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingInvestimento ? 'Editar Investimento' : 'Novo Investimento'}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Valor</FormLabel>
              <Input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Categoria</FormLabel>
              <Select
                value={formData.id_categoria}
                onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Usuário</FormLabel>
              <Select
                value={formData.usuario_id}
                onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
              >
                <option value="">Selecione um usuário</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Investimentos;