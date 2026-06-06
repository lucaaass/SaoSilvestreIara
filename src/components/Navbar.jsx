import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    carregarUsuario()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      {/* Injeção de regras CSS específicas para a responsividade Mobile */}
      <style>{`
        @media (max-width: 768px) {
          .menu-btn-responsive {
            display: flex !important;
          }
          .nav-links-responsive {
            display: ${menuAberto ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background: #1e293b; /* Fundo escuro elegante para o menu mobile */
            padding: 20px;
            box-shadow: 0 10px 15px rgba(0,0,0,0.2);
            gap: 20px !important;
            border-bottom: 2px solid #ffd600;
          }
          .nav-links-responsive a {
            width: 100%;
            text-align: center;
            padding: 10px 0;
            font-size: 16px !important;
          }
          .nav-user-desktop {
            display: none !important;
          }
          .mobile-login-btn {
            display: block !important;
            width: 100%;
            text-align: center;
            background: #ffd600 !important;
            color: #000 !important;
            padding: 10px !important;
            border-radius: 6px;
            font-weight: bold;
          }
        }
      `}</style>

      <nav className="nav" style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: '#0f172a', /* Cor de fundo padrão da navbar */
        padding: '15px 20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ 
          maxWidth: '1240px', 
          width: '100%', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative'
        }}>
          
          {/* Logo Branding */}
          <h2 className="logo" style={{ 
            fontSize: '20px', 
            fontWeight: '800', 
            letterSpacing: '-0.5px',
            margin: 0,
            color: '#fff'
          }}>
            São Silvestre <span style={{ color: '#ffd600' }}>Iara</span>
          </h2>

          {/* Links de Navegação (Responsivo via CSS acima) */}
          <div className="nav-links-responsive" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px' 
          }}>
            <Link
              to="/"
              onClick={() => setMenuAberto(false)}
              style={{ fontSize: '14px', color: '#fff', textDecoration: 'none', fontWeight: '500' }}
            >
              Início
            </Link>

            <Link
              to="/inscricao"
              onClick={() => setMenuAberto(false)}
              style={{ fontSize: '14px', color: '#fff', textDecoration: 'none', fontWeight: '500' }}
            >
              Inscrição
            </Link>

            {user && (
              <Link
                to="/admin"
                onClick={() => setMenuAberto(false)}
                style={{ 
                  fontSize: '14px', 
                  color: '#fff',
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '6px 12px',
                  borderRadius: '6px'
                }}
              >
                Painel Geral
              </Link>
            )}

            {/* Link de login que SÓ aparece dentro do menu mobile se não estiver logado */}
            {!user && (
              <Link
                to="/login"
                className="mobile-login-btn"
                style={{ display: 'none', textDecoration: 'none' }}
                onClick={() => setMenuAberto(false)}
              >
                Entrar no Painel
              </Link>
            )}
          </div>

          {/* Bloco de Usuário Lado Direito (Desktop apenas) */}
          <div className="nav-user-desktop" style={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }}>ADMIN</span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#fff' }}>
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <img
                  src={user.user_metadata?.avatar_url || "https://via.placeholder.com/35"}
                  alt="Perfil"
                  style={{ width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #ffd600' }}
                />
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: '13px',
                  color: '#fff',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Área Restrita 🔐
              </Link>
            )}
          </div>

          {/* Botão Hambúrguer Visível apenas no Mobile */}
          <button
            className="menu-btn-responsive"
            onClick={() => setMenuAberto(!menuAberto)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'none', /* Escondido por padrão no desktop */
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '22px'
            }}
          >
            {menuAberto ? '✕' : '☰'}
          </button>

        </div>
      </nav>
    </>
  )
}