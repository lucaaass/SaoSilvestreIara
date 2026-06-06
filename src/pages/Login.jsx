import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function Login() {
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function verificar() {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      console.log('SESSION LOGIN:', session)
    }

    verificar()
  }, [])

  async function loginGoogle() {
    setCarregando(true)
    // Captura dinamicamente a URL de onde o site está rodando
    const URL_ATUAL = window.location.origin 

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redireciona dinamicamente tanto em localhost quanto em produção
        redirectTo: `${URL_ATUAL}/admin` 
      }
    })

    if (error) {
      console.error('Erro no login:', error.message)
      setCarregando(false)
    } else {
      console.log('Redirecionando...', data)
    }
  }

  return (
    <div className="container" style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card" style={{ 
        maxWidth: '420px', 
        width: '100%', 
        padding: '40px 30px', 
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
      }}>
        
        {/* Cabeçalho de Marca */}
        <h1 style={{ color: '#c62828', fontSize: '28px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>
          Corrida São Silvestre
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '35px', fontWeight: '500' }}>
          Painel de Controle e Administração
        </p>

        {/* Divisor estético sutil */}
        <div style={{ width: '40px', height: '3px', background: '#e2e8f0', margin: '0 auto 30px auto', borderRadius: '2px' }}></div>

        {/* Botão Oficial Padronizado do Google */}
        <button 
          onClick={loginGoogle} 
          disabled={carregando}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #cbd5e1',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: carregando ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            opacity: carregando ? 0.7 : 1
          }}
          onMouseEnter={(e) => { if (!carregando) { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#94a3b8'; } }}
          onMouseLeave={(e) => { if (!carregando) { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#cbd5e1'; } }}
        >
          {/* SVG Oficial do Ícone do Google */}
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block' }}>
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.257-3.133C18.41 1.944 15.603 1 12.24 1 6.162 1 1.25 5.925 1.25 12s4.912 11 10.99 11c6.35 0 10.57-4.475 10.57-10.762 0-.726-.075-1.285-.175-1.666H12.24z"/>
          </svg>
          
          <span style={{ fontWeight: '600' }}>
            {carregando ? 'Conectando...' : 'Entrar com o Google'}
          </span>
        </button>

        {/* Rodapé de Segurança */}
        <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '35px', lineHeight: '1.4' }}>
          Área restrita para organizadores cadastrados.<br />A autenticação é processada de forma segura pelo Google.
        </p>

      </div>
    </div>
  )
}