import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

const EMAIL_ADMINS = [
  'lucasmarques630@gmail.com',
  'arenato13@hotmail.com',
  'neusa.scarelli@gmail.com',
  'allan.renato.ar@gmail.com'
]

export default function Admin() {
  const [dados, setDados] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 🎯 Estados de Filtro e Busca
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('TODOS') // TODOS, PAGO, PENDENTE

  // 🎯 Estados de Paginação Avançada
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const navigate = useNavigate()

  useEffect(() => {
    async function verificarUsuario() {
      const { data: { session } } = await supabase.auth.getSession()

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
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
  }, [navigate])

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
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao aprovar',
        text: error.message,
        showConfirmButton: false,
        timer: 3000
      })
      return
    }

    // Toast de sucesso ao aprovar
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Inscrição aprovada com sucesso!',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    })

    const telefone = `55${item.telefone}`
    const textoCodigo = item.codigo_inscricao ? ` (Inscrição #${item.codigo_inscricao})` : ''
    const mensagem = `Olá ${item.nome_completo}! Sua inscrição${textoCodigo} na Corrida São Silvestre foi aprovada e o pagamento foi confirmado. 🏃🎉`

    window.open(
      `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    )

    carregar()
  }

  // 🔄 Nova Função: Alterar Linha (Modal interativo)
  async function alterarLinha(item) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Inscrição',
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <label style="font-weight: bold; display: block; margin-bottom: 5px;">Nome Completo:</label>
          <input id="swal-nome" class="swal2-input" style="width: 100%; margin-bottom: 15px;" value="${item.nome_completo || ''}">
          
          <label style="font-weight: bold; display: block; margin-bottom: 5px;">Tamanho da Camisa:</label>
          <select id="swal-camisa" class="swal2-select" style="width: 100%; margin-bottom: 15px;">
            <option value="P" ${item.tamanho_camisa === 'P' ? 'selected' : ''}>P</option>
            <option value="M" ${item.tamanho_camisa === 'M' ? 'selected' : ''}>M</option>
            <option value="G" ${item.tamanho_camisa === 'G' ? 'selected' : ''}>G</option>
            <option value="GG" ${item.tamanho_camisa === 'GG' ? 'selected' : ''}>GG</option>
          </select>

          <label style="font-weight: bold; display: block; margin-bottom: 5px;">Status do Pagamento:</label>
          <select id="swal-status" class="swal2-select" style="width: 100%;">
            <option value="PENDENTE" ${item.status_pagamento !== 'PAGO' ? 'selected' : ''}>PENDENTE</option>
            <option value="PAGO" ${item.status_pagamento === 'PAGO' ? 'selected' : ''}>PAGO</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Salvar Alterações',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#15803d',
      preConfirm: () => {
        return {
          nome_completo: document.getElementById('swal-nome').value,
          tamanho_camisa: document.getElementById('swal-camisa').value,
          status_pagamento: document.getElementById('swal-status').value
        }
      }
    })

    if (formValues) {
      const { error } = await supabase
        .from('inscricoes')
        .update(formValues)
        .eq('id', item.id)

      if (error) {
        Swal.fire('Erro!', 'Não foi possível atualizar o registro.', 'error')
        return
      }

      Swal.fire({
        icon: 'success',
        title: 'Registro atualizado!',
        showConfirmButton: false,
        timer: 1500
      })
      carregar()
    }
  }

  // ❌ Nova Função: Excluir Linha (Com confirmação segura)
  async function excluirLinha(id, nome) {
    const resultado = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você irá deletar permanentemente a inscrição de: ${nome}. Esta ação não pode ser desfeita!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    })

    if (resultado.isConfirmed) {
      const { error } = await supabase
        .from('inscricoes')
        .delete()
        .eq('id', id)

      if (error) {
        Swal.fire('Erro!', 'Não foi possível excluir o registro.', 'error')
        return
      }

      Swal.fire('Deletado!', 'A inscrição foi removida com sucesso.', 'success')
      carregar()
    }
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

  // ==========================================
  // ⚙️ LÓGICA DE FILTRAGEM E BUSCA (PROCESSAMENTO)
  // ==========================================
  const dadosFiltrados = dados.filter(item => {
    const texto = busca.toLowerCase()
    const bateTexto = 
      item.nome_completo?.toLowerCase().includes(texto) || 
      item.telefone?.includes(texto) ||
      item.codigo_inscricao?.toLowerCase().includes(texto)
    
    if (filtroStatus === 'TODOS') return bateTexto
    if (filtroStatus === 'PAGO') return bateTexto && item.status_pagamento === 'PAGO'
    if (filtroStatus === 'PENDENTE') return bateTexto && item.status_pagamento !== 'PAGO'
    
    return bateTexto
  })

  // ==========================================
  // ⚙️ LÓGICA DA PAGINAÇÃO SOBRE OS FILTRADOS
  // ==========================================
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina)
  const indiceUltimoItem = paginaAtual * itensPorPagina
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina
  const dadosPaginados = dadosFiltrados.slice(indicePrimeiroItem, indiceUltimoItem)

  const gerenciarMudancaBusca = (e) => {
    setBusca(e.target.value)
    setPaginaAtual(1)
  }

  const gerenciarMudancaFiltro = (status) => {
    setFiltroStatus(status)
    setPaginaAtual(1)
  }

  if (loading) return <div className="container"><div className="card"><h2>Carregando...</h2></div></div>
  if (!user) return <div className="container"><div className="card"><h2>Redirecionando...</h2></div></div>
  if (!EMAIL_ADMINS.includes(user.email)) {
    return (
      <div className="container">
        <div className="card">
          <h2>Acesso negado</h2>
          <p>Usuário logado: {user.email}</p>
          <button onClick={sair}>Sair</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px' }}>
      <div className="card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '24px' }}>
        
        {/* Cabeçalho do Admin */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img
              src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/80'}
              alt="Perfil"
              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #15803d' }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>Painel Administrativo</h2>
              <small style={{ color: '#64748b', fontSize: '13px' }}>{user.email}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportarExcel} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}>
              📊 Exportar Excel
            </button>
            <button onClick={sair} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
              Sair
            </button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', borderRadius: '10px', background: '#f8fafc', borderLeft: '5px solid #3b82f6' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#1e293b' }}>{dados.length}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Total Geral</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '10px', background: '#f0fdf4', borderLeft: '5px solid #16a34a' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#14532d' }}>{dados.filter(i => i.status_pagamento === 'PAGO').length}</h3>
            <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>Confirmados (PAGO)</p>
          </div>
          <div style={{ padding: '20px', borderRadius: '10px', background: '#fef2f2', borderLeft: '5px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#7f1d1d' }}>{dados.filter(i => i.status_pagamento !== 'PAGO').length}</h3>
            <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>Pendentes</p>
          </div>
        </div>

        {/* BARRA DE FERRAMENTAS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
          <div style={{ flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nome, WhatsApp ou número de inscrição..."
              value={busca}
              onChange={gerenciarMudancaBusca}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
            {['TODOS', 'PAGO', 'PENDENTE'].map((status) => (
              <button
                key={status}
                onClick={() => gerenciarMudancaFiltro(status)}
                style={{
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '13px',
                  background: filtroStatus === status ? '#fff' : 'transparent',
                  color: filtroStatus === status ? '#1e293b' : '#64748b',
                  boxShadow: filtroStatus === status ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {status === 'TODOS' ? 'Todos' : status === 'PAGO' ? 'Pagos' : 'Pendentes'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
            <span>Exibir:</span>
            <select
              value={itensPorPagina}
              onChange={(e) => { setItensPorPagina(Number(e.target.value)); setPaginaAtual(1); }}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Inscrição</th>
                <th style={{ padding: '12px 16px' }}>Nome</th>
                <th style={{ padding: '12px 16px' }}>Nascimento</th>
                <th style={{ padding: '12px 16px' }}>Camisa</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Comprovante</th>
                {/* 🛠️ Aumentado o espaço das Ações para caber os botões adicionados */}
                <th style={{ padding: '12px 16px', textAlign: 'center', width: '260px' }}>Ações de Controle</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: '14px', color: '#334155' }}>
              {dadosPaginados.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '14px 16px' }}>
                    {item.codigo_inscricao ? (
                      <code style={{ background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', color: '#0f172a', fontWeight: 'bold', fontSize: '12px' }}>
                        #{item.codigo_inscricao}
                      </code>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>S/ Cód</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '500' }}>{item.nome_completo}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.data_nascimento?.split('-').reverse().join('/')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>{item.tamanho_camisa}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={item.status_pagamento === 'PAGO' ? 'status-pago' : 'status-pendente'}>
                      {item.status_pagamento}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.comprovante_url ? (
                      <a href={item.comprovante_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                        🔍 Ver arquivo
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Não enviado</span>
                    )}
                  </td>
                  
                  {/* 🛠️ COLUNA DE AÇÕES COMBINADA (Aprovar, Editar, Excluir) */}
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                      
                      {item.status_pagamento !== 'PAGO' ? (
                        <button onClick={() => aprovar(item)} style={{ background: '#15803d', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }} title="Aprovar Pagamento">
                          Aprovar
                        </button>
                      ) : (
                        <span style={{ color: '#16a34a', fontSize: '11px', fontWeight: 'bold', padding: '6px 4px' }}>🟢 Pago</span>
                      )}

                      <button onClick={() => alterarLinha(item)} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }} title="Editar Dados">
                        ✏️ Alterar
                      </button>

                      <button onClick={() => excluirLinha(item.id, item.nome_completo)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }} title="Excluir Registro">
                        🗑️ Excluir
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
              
              {dadosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '15px' }}>
                    Nenhum atleta encontrado para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO NUMÉRICA */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Exibindo registros de {indicePrimeiroItem + 1} a {Math.min(indiceUltimoItem, dadosFiltrados.length)} de um total de {dadosFiltrados.length}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button 
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                style={{ border: '1px solid #cbd5e1', background: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', opacity: paginaAtual === 1 ? 0.4 : 1, fontSize: '13px' }}
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPaginaAtual(num)}
                  style={{
                    border: '1px solid',
                    borderColor: paginaAtual === num ? '#15803d' : '#cbd5e1',
                    background: paginaAtual === num ? '#15803d' : '#fff',
                    color: paginaAtual === num ? '#fff' : '#1e293b',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    transition: 'all 0.15s'
                  }}
                >
                  {num}
                </button>
              ))}

              <button 
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                style={{ border: '1px solid #cbd5e1', background: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', opacity: paginaAtual === totalPaginas ? 0.4 : 1, fontSize: '13px' }}
              >
                Próximo
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}