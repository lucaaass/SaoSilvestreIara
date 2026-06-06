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

return ( <nav className="nav">


  <h2 className="logo">
    São Silvestre
  </h2>

  <button
    className="menu-btn"
    onClick={() =>
      setMenuAberto(!menuAberto)
    }
  >
    {menuAberto ? '✕' : '☰'}
  </button>

  <div
    className={`nav-links ${
      menuAberto ? 'active' : ''
    }`}
  >

    <Link
      to="/"
      onClick={() =>
        setMenuAberto(false)
      }
    >
      Home
    </Link>

    <Link
      to="/inscricao"
      onClick={() =>
        setMenuAberto(false)
      }
    >
      Inscrição
    </Link>

    {user && (

      <Link
        to="/admin"
        onClick={() =>
          setMenuAberto(false)
        }
      >
        Admin
      </Link>

    )}

    {!user && (

      <Link
        to="/login"
        className="mobile-login"
        onClick={() =>
          setMenuAberto(false)
        }
      >
        Entrar
      </Link>

    )}

  </div>

  <div className="nav-user">

    {user ? (

      <div className="user-box">

        <img
          src={
            user.user_metadata?.avatar_url
          }
          alt="Perfil"
          className="avatar-img"
        />

      </div>

    ) : (

      <Link
        to="/login"
        className="login-link"
      >
        Entrar Admin
      </Link>

    )}

  </div>

</nav>


)
}
