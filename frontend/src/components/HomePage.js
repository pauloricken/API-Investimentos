import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="text-center py-5">
      <h1 className="mb-4">Bem-vindo ao Painel da Minha API</h1>
      <p>Escolha uma das seções abaixo para gerenciar seus dados:</p>
       <p>Alunos: Paulo Vitor Ricken e Josué Maas</p>  
      <div className="list-group w-50 mx-auto mt-4">
        <Link to="/usuarios" className="list-group-item list-group-item-action">Usuários</Link>
        <Link to="/categorias" className="list-group-item list-group-item-action">Categorias</Link>
        <Link to="/investimentos" className="list-group-item list-group-item-action">Investimentos</Link>
        <Link to="/transacoes" className="list-group-item list-group-item-action">Transações</Link>
      </div>
    </div>
)
}
