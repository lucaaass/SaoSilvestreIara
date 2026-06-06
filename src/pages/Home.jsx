import { Link } from 'react-router-dom'
import banner from '../assets/banner.jpg'
import logo from '../assets/Logo.png'

export default function Home() {
  return (
    <div className="home" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* SECTION HERO */}
      <section className="hero" style={{ padding: '80px 20px', gap: '50px' }}>
        <img
          src={banner}
          alt="Corrida São Silvestre"
          className="hero-banner"
          style={{ transition: 'transform 0.3s ease' }}
        />

        <div className="hero-content" style={{ textAlign: 'left', maxWidth: '550px' }}>
          <span style={{ 
            background: '#ffd600', 
            color: '#000', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '15px'
          }}>
            ⚡ Inscrições Abertas
          </span>

          <img
            src={logo}
            alt="Logo Oficial"
            className="hero-logo"
            style={{ display: 'block', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          />

          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '10px' }}>
            11ª Corrida de <br/><span style={{ color: '#ffd600' }}>São Silvestre</span>
          </h1>

          <h2 style={{ fontSize: '1.4rem', color: '#e2e8f0', fontWeight: '400', marginBottom: '20px' }}>
            Bairro do Iara • Atibaia / SP
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Participe de uma experiência única para fechar o ano superando limites, 
            celebrando a saúde e apoiando uma causa nobre em nossa comunidade.
          </p>
<Link
  to="/inscricao"
  className="btn-inscrever"
  style={{ 
    boxShadow: '0 10px 25px rgba(255, 214, 0, 0.3)', 
    transform: 'translateY(0)',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    display: 'inline-flex',       // Mudado para flex para alinhar as linhas verticalmente
    flexDirection: 'column',      // Coloca uma linha embaixo da outra
    alignItems: 'center',         // Centraliza o texto horizontalmente
    justifyContent: 'center',     // Centraliza o texto verticalmente
    padding: '12px 35px',         // Ajuste sutil no padding para acomodar as duas linhas
    lineHeight: '1.2'             // Evita que as linhas fiquem muito afastadas
  }}
  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
>
  <span style={{ fontSize: '18px', fontWeight: 'bold', display: 'block' }}>
    Garantir Minha Vaga
  </span>
  <span style={{ fontSize: '13px', fontWeight: 'normal', opacity: '0.85', marginTop: '2px' }}>
    Inscreva-se
  </span>
</Link>
        </div>
      </section>

      {/* SECTION INFO GRID */}
      <section className="info-grid" style={{ marginTop: '-40px', position: 'relative', zIndex: '10' }}>
        <div className="info-card" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📆</div>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#ffd600', letterSpacing: '1px', marginBottom: '5px' }}>Data do Evento</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>15 / 11 / 2026</p>
        </div>

        <div className="info-card" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏰</div>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#ffd600', letterSpacing: '1px', marginBottom: '5px' }}>Horário da Largada</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>07h00 da Manhã</p>
        </div>

        <div className="info-card" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📍</div>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#ffd600', letterSpacing: '1px', marginBottom: '5px' }}>Localização</h3>
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Centro Comunitário do Iara</p>
        </div>

        <div className="info-card" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#ffd600', letterSpacing: '1px', marginBottom: '5px' }}>Valor de Lote</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>R$ 60,00</p>
        </div>
      </section>

      {/* SECTION BENEFÍCIOS */}
      <section className="beneficios" style={{ padding: '80px 20px', background: '#ffffff', color: '#1e293b' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '10px' }}>
          O que está incluso na sua inscrição?
        </h2>
        <div style={{ width: '60px', height: '4px', background: '#1b7a2f', margin: '0 auto 45px auto', borderRadius: '2px' }}></div>

        <div className="beneficios-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="beneficio" style={{ 
            padding: '30px 20px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>🏅</span>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>Medalha de Participação</span>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Entregue para todos os atletas que concluírem o percurso.</p>
          </div>

          <div className="beneficio" style={{ 
            padding: '30px 20px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>👕</span>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>Camiseta Oficial</span>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Tecido tecnológico ideal para alta performance em corrida.</p>
          </div>

          <div className="beneficio" style={{ 
            padding: '30px 20px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>❤️</span>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>Causa Beneficente</span>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Parte do valor arrecadado é destinado a projetos sociais do Iara.</p>
          </div>
        </div>
      </section>

    </div>
  )
}