import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'

const EMAIL_ADMINS = [
  'lucasmarques630@gmail.com',
  'arenato13@hotmail.com',
  'neusa.scarelli@gmail.com'
]

export default function Admin() {
  const [dados, setDados] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {

  async function verificarUsuario() {

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      navigate('/login')
      return
    }

    setUser(session.user)
    setLoading(false)

    if (EMAIL_ADMINS.includes(session.user.email)) {
  carregar()
}
  }

  verificarUsuario()

  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {

      if (!session) {
        navigate('/login')
        return
      }

      setUser(session.user)
    }
  )

  return () => {
    subscription.unsubscribe()
  }

}, [navigate]), []

  async function carregar() {
    const { data, error } = await supabase
      .from('inscricoes')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setDados(data || [])
  }

async function aprovar(item) {

  const { error } = await supabase
    .from('inscricoes')
    .update({ status_pagamento: 'PAGO' })
    .eq('id', item.id)

  if (error) {
    alert(error.message)
    return
  }

  const telefone = `55${item.telefone}`

  const mensagem =
    `Olá ${item.nome_completo}! Sua inscrição na Corrida São Silvestre foi aprovada e o pagamento foi confirmado. 🏃🎉`

  window.open(
    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`,
    '_blank'
  )

  carregar()
}

  async function sair() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(dados)
    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Inscritos')
    XLSX.writeFile(wb, 'inscritos.xlsx')
  }
  function enviarWhatsapp(inscricao) {

  const telefone = `55${inscricao.telefone}`

  const mensagem =
    `Olá ${inscricao.nome_completo}! Sua inscrição na Corrida São Silvestre foi aprovada e o pagamento foi confirmado. 🏃🎉`

  const url =
    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`

  window.open(url, '_blank')
}

  // 🔵 loading global
  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Carregando...</h2>
        </div>
      </div>
    )
  }

  // 🔵 sem usuário
  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Redirecionando...</h2>
        </div>
      </div>
    )
  }

  // 🔴 bloqueio de admin
  if (!EMAIL_ADMINS.includes(user.email)){
    return (
      <div className="container">
        <div className="card">
          <h2>Acesso negado</h2>

          <p>Usuário logado: {user.email}</p>

          <button onClick={sair}>
            Sair
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">

       <h2 className="admin-title">
  Painel Administrativo
</h2>

  <div className="admin-header">

  <div className="admin-user">

    <img
      src={
        user.user_metadata?.avatar_url ||
        'https://via.placeholder.com/80'
      }
      alt="Perfil"
      className="admin-avatar"
    />

    <div className="admin-info">


      <p>
        {user.user_metadata?.full_name || 'Administrador'}
      </p>

      <small>
        {user.email}
      </small>

    </div>

  </div>

</div>
       <div className="admin-actions">
          <button onClick={exportarExcel}>
            Exportar Excel
          </button>

          <button onClick={sair}>
            Sair
          </button>
        </div>
<div className="stats-grid">

  <div className="stat-card">
    <h2>{dados.length}</h2>
    <p>Total de Inscrições</p>
  </div>

  <div className="stat-card pago">
    <h2>
      {
        dados.filter(
          i => i.status_pagamento === 'PAGO'
        ).length
      }
    </h2>

    <p>Pagamentos Confirmados</p>
  </div>

  <div className="stat-card pendente">
    <h2>
      {
        dados.filter(
          i => i.status_pagamento !== 'PAGO'
        ).length
      }
    </h2>

    <p>Pendentes</p>
  </div>

</div>
<div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nascimento</th>
              <th>Camisa</th>
              <th>Status</th>
              <th>Comprovante</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((item) => (
              <tr key={item.id}>
                <td>{item.nome_completo}</td>
                <td>
                {item.data_nascimento
                  ?.split('-')
                  .reverse()
                  .join('/')}
              </td>
                <td>{item.tamanho_camisa}</td>

                <td>
                  <span className={
                    item.status_pagamento === 'PAGO'
                      ? 'status-pago'
                      : 'status-pendente'
                  }>
                    {item.status_pagamento}
                  </span>
                </td>

                <td>
                  {item.comprovante_url ? (
                    <a href={item.comprovante_url} target="_blank" rel="noreferrer">
                      Ver comprovante
                    </a>
                  ) : (
                    'Não enviado'
                  )}
                </td>

                <td>
                  {item.status_pagamento !== 'PAGO' && (
                    <button onClick={() => aprovar(item)}>
  Aprovar
</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
</div>
      </div>
    </div>
  )
}