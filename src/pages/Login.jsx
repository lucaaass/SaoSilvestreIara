import { useEffect } from 'react'
import { supabase } from '../services/supabase'

export default function Login() {

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
    // Captura dinamicamente a URL de onde o site está rodando
    const URL_ATUAL = window.location.origin 

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Agora funciona tanto em localhost quanto na Vercel!
        redirectTo: `${URL_ATUAL}/admin` 
      }
    })

    if (error) {
      console.error('Erro no login:', error.message)
    } else {
      console.log('Redirecionando...', data)
    }
  }

  return (
    <div className="container">
      <div className="login-card">
        <h1>Corrida São Silvestre</h1>
        <button onClick={loginGoogle}>
          Entrar com Google
        </button>
      </div>
    </div>
  )
}