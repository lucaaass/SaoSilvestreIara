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

  // 🛠️ Função auxiliar profissional para aplicar máscara de telefone (Ex: (11) 99999-9999)
  function aplicarMascaraTelefone(valor) {
    const limpo = valor.replace(/\D/g, '')
    if (limpo.length <= 10) {
      return limpo.replace(/^(\d{2})(\d{4})(\d{0,4})$/, (_, ddd, parte1, parte2) => {
        return parte2 ? `(${ddd}) ${parte1}-${parte2}` : parte1 ? `(${ddd}) ${parte1}` : ddd ? `(${ddd})` : ''
      })
    }
    return limpo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)

    // 1. Validação do Nome Completo
    if (!form.nome.trim()) {
      exibirAlertaErro('Por favor, preencha seu nome completo.')
      setEnviando(false)
      return
    }

    // 2. Validação do WhatsApp (verifica apenas os números limpos)
    const telefoneLimpo = form.telefone.replace(/\D/g, '')
    if (telefoneLimpo.length < 10) {
      exibirAlertaErro('Digite um WhatsApp válido com DDD (Ex: 11999999999)')
      setEnviando(false)
      return
    }

    // 3. Validação da Data de Nascimento
    if (!form.nascimento) {
      exibirAlertaErro('Por favor, informe sua data de nascimento.')
      setEnviando(false)
      return
    }

    // 4. Validação do Tamanho da Camisa
    if (!form.camisa) {
      exibirAlertaErro('Por favor, selecione o tamanho da sua camisa.')
      setEnviando(false)
      return
    }

    // 5. Validação do Comprovante Anexo
    if (!arquivo) {
      exibirAlertaErro('Anexe o comprovante PIX para concluir sua inscrição.')
      setEnviando(false)
      return
    }

    // 🛠️ GERAÇÃO DO CÓDIGO DA INSCRIÇÃO (Padronizado e sem erros de referência)
    const agora = new Date()
    const codigoInscricao = `${agora.getFullYear().toString().slice(-2)}${(agora.getMonth() + 1).toString().padStart(2, '0')}${agora.getDate().toString().padStart(2, '0')}-${agora.getHours().toString().padStart(2, '0')}${agora.getMinutes().toString().padStart(2, '0')}`

    const nomeArquivo = `${Date.now()}-${arquivo.name}`

    // Upload do arquivo para o Storage
    const { error: uploadError } = await supabase.storage
      .from('comprovantes')
      .upload(nomeArquivo, arquivo)

    if (uploadError) {
      console.log(uploadError)
      exibirAlertaErro('Erro ao enviar o comprovante. Tente novamente.')
      setEnviando(false)
      return
    }

    const { data } = supabase.storage
      .from('comprovantes')
      .getPublicUrl(nomeArquivo)

    const comprovanteUrl = data.publicUrl

    // 💾 SALVANDO NO BANCO DE DADOS (Com a nova coluna inclusa!)
    const { error } = await supabase
      .from('inscricoes')
      .insert([
        {
          codigo_inscricao: codigoInscricao, // <--- Aqui salva o código gerado na tabela do Supabase
          nome_completo: form.nome.trim(),
          telefone: telefoneLimpo,
          data_nascimento: form.nascimento,
          tamanho_camisa: form.camisa,
          comprovante_url: comprovanteUrl,
          status_pagamento: 'PENDENTE'
        }
      ])

    if (error) {
      console.log(error)
      exibirAlertaErro('Erro ao salvar inscrição no banco de dados.')
      setEnviando(false)
      return
    }

    // 🎉 Pop-up premium de Sucesso com o resumo mapeado corretamente
    Swal.fire({
      icon: 'success',
      title: '<span style="color: #15803d; font-weight: 700;">Inscrição Recebida!</span>',
      html: `
        <div style="text-align: left; background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 15px; border: 1px solid #e2e8f0; font-family: sans-serif;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569;">
            <strong>Inscrição:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #0f172a; font-weight: bold;">#${codigoInscricao}</code>
          </p>
          <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Atleta:</strong> ${form.nome.trim()}</p>
          <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e293b;"><strong>Tamanho da Camisa:</strong> ${form.camisa}</p>
          <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Comprovante:</strong> 🟢 Enviado com sucesso</p>
        </div>
        <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5; text-align: center;">
          Nossa equipe analisará o seu comprovante PIX. Em breve, você receberá a confirmação definitiva diretamente no seu WhatsApp! 🎉
        </p>
      `,
      confirmButtonText: 'Entendido, obrigado!',
      confirmButtonColor: '#15803d',
      background: '#ffffff',
      allowOutsideClick: false
    })

    // Reseta todo o formulário de forma limpa
    setForm({
      nome: '',
      telefone: '',
      nascimento: '',
      camisa: ''
    })
    setArquivo(null)
    setEnviando(false)
  }

  // ⚡ Função centralizada para alertas de validação rápida (Evita repetição de código)
  function exibirAlertaErro(mensagem) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: message || mensagem, // Garante que a mensagem seja renderizada independentemente da chamada
      confirmButtonColor: '#d33',
      confirmButtonText: 'Corrigir'
    })
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
            <div className="pix-chave">02437729801</div>
            <button
              type="button"
              className="btn-copiar"
              onClick={() => {
                navigator.clipboard.writeText('02437729801')
                
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Chave PIX copiada!',
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true,
                })
              }}
            >
              📋 Copiar chave PIX
            </button>
          </div>

          <h2>R$ 60,00</h2>
        </div>

        <form onSubmit={enviar}>
          {/* Campo Nome */}
          <input
            type="text"
            placeholder="Nome completo"
            value={form.nome || ''}
            required
            disabled={enviando}
            onChange={(e) =>
              setForm({
                ...form,
                nome: e.target.value
              })
            }
          />

          {/* Campo Telefone com Máscara em tempo real */}
          <input
            type="tel"
            placeholder="WhatsApp (Ex: (11) 99999-9999)"
            value={form.telefone || ''}
            maxLength={15}
            required
            disabled={enviando}
            onChange={(e) =>
              setForm({
                ...form,
                telefone: aplicarMascaraTelefone(e.target.value)
              })
            }
          />

          {/* Campo Data de Nascimento com Alternância de Tipo */}
          <input
            type={form.nascimento ? "date" : "text"}
            placeholder="Data de nascimento (Ex: 01/02/2000)"
            value={form.nascimento || ''}
            required
            disabled={enviando}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!form.nascimento) e.target.type = "text";
            }}
            onChange={(e) =>
              setForm({
                ...form,
                nascimento: e.target.value
              })
            }
          />

          {/* Campo Seletor de Camisas */}
          <select
            value={form.camisa || ''}
            required
            disabled={enviando}
            onChange={(e) =>
              setForm({
                ...form,
                camisa: e.target.value
              })
            }
          >
            <option value="">Tamanho da camisa</option>
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
          </select>

          {/* Bloco Dinâmico do Comprovante */}
          {!arquivo ? (
            <label 
              className="upload-box" 
              style={{ 
                cursor: enviando ? 'not-allowed' : 'pointer', 
                display: 'block',
                opacity: enviando ? 0.6 : 1 
              }}
            >
              📎 Anexar comprovante
              <input
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                required
                disabled={enviando}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setArquivo(e.target.files[0])
                  }
                }}
              />
            </label>
          ) : (
            <div 
              className="arquivo-selecionado" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 15px', 
                border: '2px dashed #15803d', 
                borderRadius: '8px', 
                marginTop: '10px', 
                background: '#f0fdf4' 
              }}
            >
              <span style={{ color: '#166534', fontWeight: '500', fontSize: '14px' }}>
                📄 Comprovante: {arquivo.name}
              </span>
              <button
                type="button"
                disabled={enviando}
                onClick={() => setArquivo(null)}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  opacity: enviando ? 0.5 : 1
                }}
              >
                ❌ Remover
              </button>
            </div>
          )}

          {/* Botão de Envio com Bloqueio de Multi-clique e Estilo de Loading */}
          <button
            type="submit"
            className="btn-inscricao"
            disabled={enviando}
            style={{
              cursor: enviando ? 'not-allowed' : 'pointer',
              opacity: enviando ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {enviando ? '⏳ Enviando inscrição...' : '✅ Confirmar Inscrição'}
          </button>
        </form>
      </div>
    </div>
  )
}