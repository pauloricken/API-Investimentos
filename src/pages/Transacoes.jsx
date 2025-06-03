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

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editingTransacao, setEditingTransacao] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    id_investimento: '',
    tipo: '',
    valor: '',
    data: '',
    categoria_id: '',
    usuario_id: '',
    descricao: ''
  });
  const toast = useToast();

  const fetchData = async () => {
    try {
      const [transacoesRes, investimentosRes, categoriasRes, usuariosRes] = await Promise.all([
        axios.get('http://localhost/api/public/index.php?rota=transacoes'),
        axios.get('http://localhost/api/public/index.php?rota=investimentos'),
        axios.get('http://localhost/api/public/index.php?rota=categorias'),
        axios.get('http://localhost/api/public/index.php?rota=usuarios')
      ]);
      
      setTransacoes(transacoesRes.data);
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

      if (editingTransacao) {
        await axios.put('http://localhost/api/public/index.php?rota=transacoes', {
          ...payload,
          id: editingTransacao.id
        });
      } else {
        await axios.post('http://localhost/api/public/index.php?rota=transacoes', payload);
      }
      
      onClose();
      fetchData();
      setFormData({
        id_investimento: '',
        tipo: '',
        valor: '',
        data: '',
        categoria_id: '',
        usuario_id: '',
        descricao: ''
      });
      setEditingTransacao(null);
      
      toast({
        title: `Transação ${editingTransacao ? 'atualizada' : 'criada'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar transação',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost/api/public/index.php?rota=transacoes', {
        data: { id }
      });
      fetchData();
      toast({
        title: 'Transação deletada com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao deletar transação',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (transacao) => {
    setEditingTransacao(transacao);
    setFormData({
      id_investimento: transacao.id_investimento,
      tipo: transacao.tipo,
      valor: transacao.valor.toString(),
      data: transacao.data,
      categoria_id: transacao.categoria_id,
      usuario_id: transacao.usuario_id,
      descricao: transacao.descricao
    });
    onOpen();
  };

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading mb={6}>Transações</Heading>
      <Button colorScheme="blue" mb={4} onClick={() => {
        setEditingTransacao(null);
        setFormData({
          id_investimento: '',
          tipo: '',
          valor: '',
          data: '',
          categoria_id: '',
          usuario_id: '',
          descricao: ''
        });
        onOpen();
      }}>
        Nova Transação
      </Button>

      <Table variant="simple" bg="white" shadow="md" borderRadius="lg">
        <Thead>
          <Tr>
            <Th>Investimento</Th>
            <Th>Tipo</Th>
            <Th>Valor</Th>
            <Th>Data</Th>
            <Th>Categoria</Th>
            <Th>Usuário</Th>
            <Th>Descrição</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transacoes.map((transacao) => (
            <Tr key={transacao.id}>
              <Td>{investimentos.find(i => i.id === transacao.id_investimento)?.nome}</Td>
              <Td>{transacao.tipo}</Td>
              <Td>R$ {transacao.valor.toFixed(2)}</Td>
              <Td>{new Date(transacao.data).toLocaleDateString()}</Td>
              <Td>{categorias.find(c => c.id === transacao.categoria_id)?.nome}</Td>
              <Td>{usuarios.find(u => u.id === transacao.usuario_id)?.nome}</Td>
              <Td>{transacao.descricao}</Td>
              <Td>
                <Button size="sm" colorScheme="yellow" mr={2} onClick={() => handleEdit(transacao)}>
                  Editar
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(transacao.id)}>
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
          <ModalHeader>{editingTransacao ? 'Editar Transação' : 'Nova Transação'}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Investimento</FormLabel>
              <Select
                value={formData.id_investimento}
                onChange={(e) => setFormData({ ...formData, id_investimento: e.target.value })}
              >
                <option value="">Selecione um investimento</option>
                {investimentos.map(investimento => (
                  <option key={investimento.id} value={investimento.id}>
                    {investimento.nome}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Tipo</FormLabel>
              <Select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="">Selecione o tipo</option>
                <option value="débito">Débito</option>
                <option value="crédito">Crédito</option>
              </Select>
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
              <FormLabel>Data</FormLabel>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Categoria</FormLabel>
              <Select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
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
            <FormControl mt={4}>
              <FormLabel>Descrição</FormLabel>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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

export default Transacoes;