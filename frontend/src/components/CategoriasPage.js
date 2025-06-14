import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost/api/public/index.php?rota=categorias'

export default function CategoriasPage() {
  const [itens, setItens] = useState([])
  const [nome, setNome] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { fetch() }, [])

  async function fetch() {
    try {
      const res = await axios.get(API)
      setItens(res.data)
    } catch {
      setError('Erro ao carregar categorias.')
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await axios.put(API, { id: editingId, nome })
      } else {
        await axios.post(API, { nome })
      }
      setNome(''); setEditingId(null)
      fetch()
    } catch {
      setError('Erro ao salvar categoria.')
    }
  }

  async function remove(id) {
    if (!window.confirm('Confirma exclusão?')) return
    try {
      await axios.delete(API, { data: { id } })
      fetch()
    } catch {
      setError('Erro ao excluir.')
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h1 className="card-title">{editingId ? 'Editar Categoria' : 'Nova Categoria'}</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit} className="row g-3 mb-4">
          <div className="col-md-10">
            <input
              className="form-control"
              placeholder="Nome da Categoria"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
        <table className="table table-striped">
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {itens.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>
                  <button className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => { setNome(c.nome); setEditingId(c.id) }}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(c.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {itens.length===0 && (
              <tr><td colSpan="3" className="text-center text-muted">Sem categorias</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
)
}
