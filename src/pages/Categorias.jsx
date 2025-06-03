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

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ nome: '' });
  const toast = useToast();

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost/api/public/index.php?rota=categorias');
      setCategorias(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar categorias',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingCategoria) {
        await axios.put('http://localhost/api/public/index.php?rota=categorias', {
          ...formData,
          id: editingCategoria.id
        });
      } else {
        await axios.post('http://localhost/api/public/index.php?rota=categorias', formData);
      }
      
      onClose();
      fetchCategorias();
      setFormData({ nome: '' });
      setEditingCategoria(null);
      
      toast({
        title: `Categoria ${editingCategoria ? 'atualizada' : 'criada'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar categoria',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost/api/public/index.php?rota=categorias', {
        data: { id }
      });
      fetchCategorias();
      toast({
        title: 'Categoria deletada com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao deletar categoria',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria);
    setFormData({ nome: categoria.nome });
    onOpen();
  };

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading mb={6}>Categorias</Heading>
      <Button colorScheme="blue" mb={4} onClick={() => {
        setEditingCategoria(null);
        setFormData({ nome: '' });
        onOpen();
      }}>
        Nova Categoria
      </Button>

      <Table variant="simple" bg="white" shadow="md" borderRadius="lg">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categorias.map((categoria) => (
            <Tr key={categoria.id}>
              <Td>{categoria.nome}</Td>
              <Td>
                <Button size="sm" colorScheme="yellow" mr={2} onClick={() => handleEdit(categoria)}>
                  Editar
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(categoria.id)}>
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
          <ModalHeader>{editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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

export default Categorias;