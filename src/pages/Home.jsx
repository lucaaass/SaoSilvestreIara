import { Link } from 'react-router-dom'

import banner from '../assets/banner.jpg'
import logo from '../assets/Logo.png'

export default function Home() {

return ( <div className="home">


  <section className="hero">

    <img
      src={banner}
      alt="Corrida São Silvestre"
      className="hero-banner"
    />

    <div className="hero-content">

      <img
        src={logo}
        alt="Logo"
        className="hero-logo"
      />

      <h1>
        11ª Corrida de São Silvestre
      </h1>

      <h2>
        Bairro do Iara • Atibaia/SP
      </h2>

      <p>
        Uma experiência única para fechar o ano
        correndo, se divertindo e ajudando uma causa.
      </p>

      <Link
        to="/inscricao"
        className="btn-inscrever"
      >
        Inscreva-se Agora
      </Link>

    </div>

  </section>

  <section className="info-grid">

    <div className="info-card">
      <h3>📅 Data</h3>
      <p>15/11/2026</p>
    </div>

    <div className="info-card">
      <h3>⏰ Horário</h3>
      <p>07:00</p>
    </div>

    <div className="info-card">
      <h3>📍 Local</h3>
      <p>Centro Comunitário do Iara</p>
    </div>

    <div className="info-card">
      <h3>💰 Inscrição</h3>
      <p>R$ 60,00</p>
    </div>

  </section>

  <section className="beneficios">

    <h2>
      Sua inscrição inclui
    </h2>

    <div className="beneficios-grid">

      <div className="beneficio">
        🏅 Medalha de participação
      </div>

      <div className="beneficio">
        👕 Camiseta oficial
      </div>

      <div className="beneficio">
        ❤️ Corrida beneficente
      </div>

    </div>

  </section>

</div>


)
}
