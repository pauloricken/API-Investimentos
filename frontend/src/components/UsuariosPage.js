import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost/api/public/index.php?rota=usuarios'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ nome: '', email: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    try {
      const res = await axios.get(API_BASE)
      setUsuarios(res.data)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar a lista.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await axios.put(API_BASE, { id: editingId, ...form })
      } else {
        await axios.post(API_BASE, form)
      }
      setForm({ nome: '', email: '' })
      setEditingId(null)
      fetchUsuarios()
    } catch (err) {
      console.error(err.response || err)
      setError('Erro ao salvar usuário.')
    }
  }

  function handleEdit(u) {
    setForm({ nome: u.nome, email: u.email })
    setEditingId(u.id)
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirmar exclusão?')) return
    try {
      await axios.delete(API_BASE, { data: { id } })
      fetchUsuarios()
    } catch (err) {
      console.error(err)
      setError('Erro ao deletar usuário.')
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h1 className="card-title">{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-5">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-5">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
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
                  setForm({ nome: '', email: '' })
                }}
              >
                Cancelar edição
              </button>
            </div>
          )}
        </form>

        <h2 className="h5 mb-3">Lista de Usuários</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-warning me-2"
                    onClick={() => handleEdit(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(u.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
