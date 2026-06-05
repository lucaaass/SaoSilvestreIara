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

    const { data, error } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173/admin'
        }
      })

    console.log('DATA:', data)
    console.log('ERROR:', error)
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