import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './components/HomePage'
import UsuariosPage from './components/UsuariosPage'
import CategoriasPage from './components/CategoriasPage'
import InvestimentosPage from './components/InvestimentosPage'
import TransacoesPage from './components/TransacoesPage'

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand bg-light mb-4">
        <div className="container">
          <NavLink className="navbar-brand" to="/">Minha API</NavLink>
          <div className="navbar-nav">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/usuarios">Usuários</NavLink>
            <NavLink className="nav-link" to="/categorias">Categorias</NavLink>
            <NavLink className="nav-link" to="/investimentos">Investimentos</NavLink>
            <NavLink className="nav-link" to="/transacoes">Transações</NavLink>
          </div>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/investimentos" element={<InvestimentosPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
