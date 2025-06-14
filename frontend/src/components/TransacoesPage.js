import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost/api/public/index.php?rota=transacoes'
const API_USU = 'http://localhost/api/public/index.php?rota=usuarios'
const API_CAT = 'http://localhost/api/public/index.php?rota=categorias'
const API_INV = 'http://localhost/api/public/index.php?rota=investimentos'

export default function TransacoesPage() {
  const [itens, setItens]         = useState([])
  const [usuarios, setUsuarios]   = useState([])
  const [categorias, setCategorias]= useState([])
  const [investimentos, setInvest] = useState([])
  const [form, setForm] = useState({
    id_investimento: '',
    tipo: 'entrada',
    valor: '',
    data: '',
    categoria_id: '',
    usuario_id: '',
    descricao: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError]         = useState('')

  useEffect(() => {
    fetchAll()
    fetchTransacoes()
  }, [])

  async function fetchAll() {
    const [u, c, i] = await Promise.all([
      axios.get(API_USU),
      axios.get(API_CAT),
      axios.get(API_INV)
    ])
    setUsuarios(u.data)
    setCategorias(c.data)
    setInvest(i.data)
  }

  async function fetchTransacoes() {
    try {
      const res = await axios.get(API)
      setItens(res.data)
    } catch {
      setError('Erro ao carregar transações.')
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await axios.put(API, { id: editingId, ...form })
      } else {
        await axios.post(API, form)
      }
      setForm({
        id_investimento: '',
        tipo: 'entrada',
        valor: '',
        data: '',
        categoria_id: '',
        usuario_id: '',
        descricao: ''
      })
      setEditingId(null)
      fetchTransacoes()
    } catch {
      setError('Erro ao salvar transação.')
    }
  }

  async function remove(id) {
    if (!window.confirm('Confirma exclusão?')) return
    try {
      await axios.delete(API, { data: { id } })
      fetchTransacoes()
    } catch {
      setError('Erro ao excluir transação.')
    }
  }

  function loadEdit(t) {
    setForm({ 
      id_investimento: t.id_investimento,
      tipo: t.tipo,
      valor: t.valor,
      data: t.data.split('T')[0],
      categoria_id: t.categoria_id,
      usuario_id: t.usuario_id,
      descricao: t.descricao
    })
    setEditingId(t.id)
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h1 className="card-title">
          {editingId ? 'Editar Transação' : 'Nova Transação'}
        </h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit} className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="form-label">Investimento</label>
            <select
              className="form-select"
              value={form.id_investimento}
              onChange={e => setForm(f => ({ ...f, id_investimento: e.target.value }))}
              required
            >
              <option value="">— escolha —</option>
              {investimentos.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.nome}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={form.tipo}
              onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
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
          <div className="col-md-2">
            <label className="form-label">Data</label>
            <input
              type="date"
              className="form-control"
              value={form.data}
              onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              value={form.categoria_id}
              onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
              required
            >
              <option value="">— escolha —</option>
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
              <option value="">— escolha —</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Descrição</label>
            <input
              type="text"
              className="form-control"
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100">
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
                  setForm({
                    id_investimento: '',
                    tipo: 'entrada',
                    valor: '',
                    data: '',
                    categoria_id: '',
                    usuario_id: '',
                    descricao: ''
                  })
                }}
              >Cancelar</button>
            </div>
          )}
        </form>

        <h2 className="h5 mb-3">Lista de Transações</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th><th>Inv.</th><th>Tipo</th><th>Valor</th><th>Data</th>
              <th>Categoria</th><th>Usuário</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{investimentos.find(i=>i.id===t.id_investimento)?.nome}</td>
                <td>{t.tipo}</td>
                <td>{t.valor}</td>
                <td>{t.data.split('T')[0]}</td>
                <td>{categorias.find(c=>c.id===t.categoria_id)?.nome}</td>
                <td>{usuarios.find(u=>u.id===t.usuario_id)?.nome}</td>
                <td>
                  <button className="btn btn-sm btn-outline-warning me-2"
                          onClick={()=>loadEdit(t)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger"
                          onClick={()=>remove(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {itens.length===0 && (
              <tr><td colSpan="8" className="text-center text-muted">Sem transações</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
)
}
