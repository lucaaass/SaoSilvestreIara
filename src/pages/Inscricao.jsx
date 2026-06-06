import { useState } from 'react'
import { supabase } from '../services/supabase'
import Swal from 'sweetalert2'

export default function Inscricao() {

  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    nascimento: '',
    camisa: ''
  })

  const [arquivo, setArquivo] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {

    e.preventDefault()

    setEnviando(true)

    if (form.telefone.length < 10) {
      alert('Digite um WhatsApp válido')
      setEnviando(false)
      return
    }

    if (!arquivo) {
      alert('Anexe o comprovante PIX')
      setEnviando(false)
      return
    }

    const nomeArquivo =
      `${Date.now()}-${arquivo.name}`

    const { error: uploadError } =
      await supabase.storage
        .from('comprovantes')
        .upload(nomeArquivo, arquivo)

    if (uploadError) {
      console.log(uploadError)
      alert('Erro ao enviar comprovante')
      setEnviando(false)
      return
    }

    const { data } =
      supabase.storage
        .from('comprovantes')
        .getPublicUrl(nomeArquivo)

    const comprovanteUrl =
      data.publicUrl

    const { error } =
      await supabase
        .from('inscricoes')
        .insert([
          {
            nome_completo: form.nome,
            telefone: form.telefone,
            data_nascimento: form.nascimento,
            tamanho_camisa: form.camisa,
            comprovante_url: comprovanteUrl,
            status_pagamento: 'PENDENTE'
          }
        ])

    if (error) {
      console.log(error)
      alert('Erro ao salvar inscrição')
      setEnviando(false)
      return
    }

 Swal.fire({
  title: 'Inscrição Enviada!',
  text: 'Em breve você receberá uma mensagem no WhatsApp confirmando o pagamento da sua inscrição.',
  icon: 'success',
  confirmButtonText: 'Entendido',
  confirmButtonColor: '#15803d', // Tom de verde combinando com a São Silvestre
  background: '#ffffff',
  customClass: {
    popup: 'card-profissional'
  }
})
    setForm({
      nome: '',
      telefone: '',
      nascimento: '',
      camisa: ''
    })

    setArquivo(null)
    setEnviando(false)
  }

  return (
    <div className="container">

      <div className="inscricao-card">

        <h1>🏃 Corrida São Silvestre</h1>

        <p className="subtitulo">
          Preencha seus dados e envie o comprovante do PIX.
        </p>

        <div className="pix-box">

          <h3>Pagamento PIX</h3>

          <p>Chave PIX (CPF)</p>

          <div className="pix-copy-box">

            <div className="pix-chave">
              02437729801
            </div>

            <button
              type="button"
              className="btn-copiar"
              onClick={() => {
                navigator.clipboard.writeText(
                  '02437729801'
                )

                alert(
                  'Chave PIX copiada!'
                )
              }}
            >
              📋 Copiar chave PIX
            </button>

          </div>

          <h2>R$ 60,00</h2>

        </div>

        <form onSubmit={enviar}>

          <input
            placeholder="Nome completo"
            value={form.nome}
            onChange={(e) =>
              setForm({
                ...form,
                nome: e.target.value
              })
            }
          />

          <input
            type="tel"
             placeholder="WhatsApp (Ex: 11999999999)"
            value={form.telefone}
            maxLength={11}
            onChange={(e) =>
              setForm({
                ...form,
                telefone: e.target.value.replace(/\D/g, '')
              })
            }
          />

          <input
            type="date"
            value={form.nascimento}
            onChange={(e) =>
              setForm({
                ...form,
                nascimento: e.target.value
              })
            }
          />

          <select
            value={form.camisa}
            onChange={(e) =>
              setForm({
                ...form,
                camisa: e.target.value
              })
            }
          >
            <option value="">
              Tamanho da camisa
            </option>

            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>

          </select>

          <label className="upload-box">

            📎 Anexar comprovante

<input
  type="file"
  accept="image/*,.pdf"
  /* Se houver arquivo, a chave é fixa. Se for nulo, a chave muda e força o React a resetar o input! */
  key={arquivo ? 'com-foto' : 'sem-foto'} 
  onChange={(e) =>
    setArquivo(
      e.target.files[0]
    )
  }
/>

          </label>

       
{arquivo && (
  <div className="arquivo-selecionado" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
    <span>✅ {arquivo.name}</span>
    <button
      type="button"
      onClick={() => setArquivo(null)}
      style={{
        background: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '2px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      ❌ Remover
    </button>
  </div>
)}

          <button
            type="submit"
            className="btn-inscricao"
            disabled={enviando}
          >
            {enviando
              ? '⏳ Enviando inscrição...'
              : '✅ Confirmar Inscrição'}
          </button>

        </form>

      </div>

    </div>
  )
}