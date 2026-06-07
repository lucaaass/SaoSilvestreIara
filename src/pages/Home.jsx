import { Link } from 'react-router-dom'
import banner from '../assets/banner.jpg'
import logo from '../assets/Logo.png'

export default function Home() {
  return (
    <div className="home">
      
      {/* SECTION HERO */}
      <section className="hero">
        <img
          src={banner}
          alt="Corrida São Silvestre"
          className="hero-banner"
        />

        <div className="hero-content">
          <span className="badge-inscricoes">
            ⚡ Inscrições Abertas
          </span>

          <img
            src={logo}
            alt="Logo Oficial"
            className="hero-logo"
          />

          <h1>
            11ª Corrida de <br/><span>São Silvestre</span>
          </h1>

          <h2>
            Bairro do Iara • Atibaia / SP
          </h2>

          <p>
            Participe de uma experiência única para fechar o ano superando limites, 
            celebrando a saúde e apoiando uma causa nobre em nossa comunidade.
          </p>

          <Link to="/inscricao" className="btn-inscrever">
            <span className="btn-main-text">Garantir Minha Vaga</span>
            <span className="btn-sub-text">Inscreva-se</span>
          </Link>
        </div>
      </section>

      {/* SECTION INFO GRID */}
      <section className="info-grid">
        <div className="info-card">
          <div className="info-icon">📆</div>
          <h3>Data do Evento</h3>
          <p>15 / 11 / 2026</p>
        </div>

        <div className="info-card">
          <div className="info-icon">⏰</div>
          <h3>Horário da Largada</h3>
          <p>07h00 da Manhã</p>
        </div>

        <div className="info-card">
          <div className="info-icon">📍</div>
          <h3>Localização</h3>
          <p>Centro Comunitário do Iara</p>
        </div>

        <div className="info-card">
          <div className="info-icon">💰</div>
          <h3>Valor de Lote</h3>
          <p>R$ 60,00</p>
        </div>
      </section>

      {/* SECTION BENEFÍCIOS */}
      <section className="beneficios">
        <h2>O que está incluso na sua inscrição?</h2>
        <div className="divider-line"></div>

        <div className="beneficios-grid">
          <div className="beneficio">
            <span className="beneficio-icon">🏅</span>
            <span className="beneficio-title">Medalha de Participação</span>
            <p>Entregue para todos os atletas que concluírem o percurso.</p>
          </div>

          <div className="beneficio">
            <span className="beneficio-icon">👕</span>
            <span className="beneficio-title">Camiseta Oficial</span>
            <p>Tecido tecnológico ideal para alta performance em corrida.</p>
          </div>

          <div className="beneficio">
            <span className="beneficio-icon">❤️</span>
            <span className="beneficio-title">Causa Beneficente</span>
            <p>Parte do valor arrecadado é destinado a projetos sociais do Iara.</p>
          </div>
        </div>
      </section>

    </div>
  )
}