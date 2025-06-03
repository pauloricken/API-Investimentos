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
  useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const toast = useToast();

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost/api/public/index.php?rota=usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar usuários',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await axios.put('http://localhost/api/public/index.php?rota=usuarios', {
          ...formData,
          id: editingUser.id
        });
      } else {
        await axios.post('http://localhost/api/public/index.php?rota=usuarios', formData);
      }
      
      onClose();
      fetchUsuarios();
      setFormData({ nome: '', email: '' });
      setEditingUser(null);
      
      toast({
        title: `Usuário ${editingUser ? 'atualizado' : 'criado'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar usuário',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost/api/public/index.php?rota=usuarios', {
        data: { id }
      });
      fetchUsuarios();
      toast({
        title: 'Usuário deletado com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao deletar usuário',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({ nome: usuario.nome, email: usuario.email });
    onOpen();
  };

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading mb={6}>Usuários</Heading>
      <Button colorScheme="blue" mb={4} onClick={() => {
        setEditingUser(null);
        setFormData({ nome: '', email: '' });
        onOpen();
      }}>
        Novo Usuário
      </Button>

      <Table variant="simple" bg="white" shadow="md" borderRadius="lg">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuarios.map((usuario) => (
            <Tr key={usuario.id}>
              <Td>{usuario.nome}</Td>
              <Td>{usuario.email}</Td>
              <Td>
                <Button size="sm" colorScheme="yellow" mr={2} onClick={() => handleEdit(usuario)}>
                  Editar
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(usuario.id)}>
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
          <ModalHeader>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
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

export default Usuarios;