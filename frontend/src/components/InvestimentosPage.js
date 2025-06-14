
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_INV = 'http://localhost/api/public/index.php?rota=investimentos'
const API_USU = 'http://localhost/api/public/index.php?rota=usuarios'
const API_CAT = 'http://localhost/api/public/index.php?rota=categorias'

export default function InvestimentosPage() {
  const [itens, setItens]               = useState([])
  const [usuarios, setUsuarios]         = useState([])
  const [categorias, setCategorias]     = useState([])
  const [form, setForm]                 = useState({
    nome: '',
    valor: '',
    usuario_id: '',
    id_categoria: ''
  })
  const [editingId, setEditingId]       = useState(null)
  const [error, setError]               = useState('')

  useEffect(() => {
    fetchMetadados()
    fetchInvestimentos()
  }, [])

  // busca usuários e categorias para os selects
  async function fetchMetadados() {
    try {
      const [uRes, cRes] = await Promise.all([
        axios.get(API_USU),
        axios.get(API_CAT)
      ])
      setUsuarios(uRes.data)
      setCategorias(cRes.data)
    } catch (err) {
      console.error('Erro ao carregar usuários ou categorias:', err)
      setError('Falha ao carregar usuários/categorias.')
    }
  }

  // lista investimentos
  async function fetchInvestimentos() {
    setError('')
    try {
      const res = await axios.get(API_INV)
      setItens(res.data)
    } catch (err) {
      console.error('Erro ao carregar investimentos:', err)
      setError('Erro ao carregar investimentos.')
    }
  }

  // cria ou atualiza
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await axios.put(API_INV, { id: editingId, ...form })
      } else {
        await axios.post(API_INV, form)
      }
      // limpa form e recarrega
      setForm({ nome:'', valor:'', usuario_id:'', id_categoria:'' })
      setEditingId(null)
      fetchInvestimentos()
    } catch (err) {
      console.error('Erro ao salvar investimento:', err.response || err)
      setError('Erro ao salvar investimento: ' + (err.response?.data?.erro || err.message))
    }
  }

  // prepara edição
  function handleEdit(item) {
    setForm({
      nome: item.nome,
      valor: item.valor,
      usuario_id: item.usuario_id,
      id_categoria: item.id_categoria
    })
    setEditingId(item.id)
  }

  // exclui
  async function handleDelete(id) {
    if (!window.confirm('Confirmar exclusão?')) return
    setError('')
    try {
      await axios.delete(API_INV, { data: { id } })
      fetchInvestimentos()
    } catch (err) {
      console.error('Erro ao excluir investimento:', err)
      setError('Erro ao excluir investimento.')
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h1 className="card-title">
          {editingId ? 'Editar Investimento' : 'Novo Investimento'}
        </h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Valor</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={form.valor}
              onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              value={form.id_categoria}
              onChange={e => setForm(f => ({ ...f, id_categoria: e.target.value }))}
              required
            >
              <option value="">— selecione —</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Usuário</label>
            <select
              className="form-select"
              value={form.usuario_id}
              onChange={e => setForm(f => ({ ...f, usuario_id: e.target.value }))}
              required
            >
              <option value="">— selecione —</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
          {editingId && (
            <div className="col-12">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm({ nome:'', valor:'', usuario_id:'', id_categoria:'' })
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </form>

        <h2 className="h5 mb-3">Lista de Investimentos</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length > 0 ? itens.map(i => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.nome}</td>
                <td>{i.valor}</td>
                <td>{categorias.find(c => c.id === i.id_categoria)?.nome}</td>
                <td>{usuarios.find(u => u.id === i.usuario_id)?.nome}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-warning me-2"
                    onClick={() => handleEdit(i)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(i.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Sem investimentos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
