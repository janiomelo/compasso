import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useRegistro } from '../../ganchos'
import { INTENCOES, METODOS, INTENSIDADES } from '../../utilitarios/constantes'
import type { EntradaRegistro } from '../../tipos'
import styles from './pagina-registro.module.scss'

const ESTADO_INICIAL: EntradaRegistro = {
  metodo: 'vapor',
  intencao: 'foco',
  intensidade: 'media',
  humorAntes: undefined,
  humorDepois: undefined,
  notas: '',
}

const ETAPAS = [
  { titulo: 'Como foi?', descricao: 'Escolha o método que mais combina com este momento.' },
  { titulo: 'Qual era sua intenção?', descricao: 'Selecione a intenção dominante antes do momento.' },
  { titulo: 'Qual foi a intensidade?', descricao: 'Use a escala para registrar a percepção geral.' },
  { titulo: 'Quer adicionar uma observação?', descricao: 'Esta etapa é opcional e serve para contexto rápido.' },
] as const

const mapearIntensidade = (valor: number): EntradaRegistro['intensidade'] => {
  if (valor <= 3) {
    return 'leve'
  }

  if (valor <= 7) {
    return 'media'
  }

  return 'alta'
}

export const PaginaRegistro = () => {
  const { criar } = useRegistro()
  const [form, setForm] = useState<EntradaRegistro>(ESTADO_INICIAL)
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [intensidadeEscala, setIntensidadeEscala] = useState(5)
  const [aguardando, setAguardando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const atualizar = <K extends keyof EntradaRegistro>(campo: K, valor: EntradaRegistro[K]) => {
    setForm((anterior) => ({ ...anterior, [campo]: valor }))
    setSucesso(false)
    setErro(null)
  }

  const handleSubmit = async (evento: FormEvent) => {
    evento.preventDefault()
    setAguardando(true)
    setErro(null)

    try {
      await criar(form)
      setSucesso(true)
      setForm(ESTADO_INICIAL)
      setEtapaAtual(0)
      setIntensidadeEscala(5)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar registro')
    } finally {
      setAguardando(false)
    }
  }

  const avancar = () => setEtapaAtual((anterior) => Math.min(anterior + 1, ETAPAS.length - 1))
  const voltar = () => setEtapaAtual((anterior) => Math.max(anterior - 1, 0))

  const renderizarEtapa = () => {
    if (etapaAtual === 0) {
      return (
        <div className={styles.opcoesGrid}>
          {METODOS.map((metodo) => (
            <button
              key={metodo.id}
              type="button"
              className={styles.opcao + (form.metodo === metodo.id ? ' ' + styles['opcao--ativa'] : '')}
              onClick={() => atualizar('metodo', metodo.id as EntradaRegistro['metodo'])}
            >
              <span className={styles.opcao__icone}>{metodo.icone}</span>
              <span className={styles.opcao__titulo}>{metodo.nome}</span>
            </button>
          ))}
        </div>
      )
    }

    if (etapaAtual === 1) {
      return (
        <div className={styles.listaOpcoes}>
          {INTENCOES.map((intencao) => (
            <button
              key={intencao.id}
              type="button"
              className={styles.opcaoLista + (form.intencao === intencao.id ? ' ' + styles['opcaoLista--ativa'] : '')}
              onClick={() => atualizar('intencao', intencao.id as EntradaRegistro['intencao'])}
            >
              <span>{intencao.nome}</span>
              <span className={styles.opcaoLista__icone}>{intencao.icone}</span>
            </button>
          ))}
        </div>
      )
    }

    if (etapaAtual === 2) {
      return (
        <div className={styles.intensidade}>
          <div className={styles.intensidade__rotulos}>
            <span>Leve</span>
            <strong>{intensidadeEscala}</strong>
            <span>Intensa</span>
          </div>

          <input
            className={styles.intensidade__slider}
            type="range"
            min={1}
            max={10}
            step={1}
            value={intensidadeEscala}
            onChange={(evento) => {
              const valor = Number(evento.target.value)
              setIntensidadeEscala(valor)
              atualizar('intensidade', mapearIntensidade(valor))
            }}
          />

          <div className={styles.intensidade__escala}>
            {Array.from({ length: 10 }, (_, indice) => (
              <span key={indice + 1}>{indice + 1}</span>
            ))}
          </div>

          <div className={styles.intensidade__chipLinha}>
            {INTENSIDADES.map((item) => (
              <span
                key={item.id}
                className={styles.intensidade__chip + (form.intensidade === item.id ? ' ' + styles['intensidade__chip--ativa'] : '')}
              >
                {item.nome}
              </span>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className={styles.finalizacao}>
        <div className={styles.resumoSelecao}>
          <span>{METODOS.find((item) => item.id === form.metodo)?.nome}</span>
          <span>{INTENCOES.find((item) => item.id === form.intencao)?.nome}</span>
          <span>{INTENSIDADES.find((item) => item.id === form.intensidade)?.nome}</span>
        </div>

        <label className={styles.campoLabel}>
          Observação opcional
          <textarea
            className={styles.textarea}
            value={form.notas ?? ''}
            onChange={(e) => atualizar('notas', e.target.value)}
            maxLength={500}
            rows={5}
            placeholder="Adicione qualquer contexto que queira lembrar depois."
          />
          <span className={styles.contador}>{(form.notas ?? '').length}/500</span>
        </label>
      </div>
    )
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Registrar</span>
        <h1 className={styles.titulo}>Registrar momento</h1>
        <p className={styles.subtitulo}>Um check-in curto, guiado em poucas decisões.</p>
      </header>

      <form className={styles.formulario} onSubmit={handleSubmit} noValidate>
        <div className={styles.progresso} aria-label="Progresso do registro">
          {ETAPAS.map((_, indice) => (
            <span
              key={indice}
              className={styles.progresso__item + (indice <= etapaAtual ? ' ' + styles['progresso__item--ativo'] : '')}
            />
          ))}
        </div>

        <section className={styles.etapa}>
          <h2 className={styles.etapa__titulo}>{ETAPAS[etapaAtual].titulo}</h2>
          <p className={styles.etapa__descricao}>{ETAPAS[etapaAtual].descricao}</p>
          {renderizarEtapa()}
        </section>

        {sucesso && (
          <p className={styles.mensagemSucesso}>✓ Registro salvo com sucesso.</p>
        )}
        {erro && (
          <p className={styles.mensagemErro}>{erro}</p>
        )}

        <div className={styles.acoes}>
          {etapaAtual > 0 ? (
            <button type="button" className={styles.botaoSecundario} onClick={voltar}>
              <ChevronLeft size={18} />
              Voltar
            </button>
          ) : (
            <span />
          )}

          {etapaAtual < ETAPAS.length - 1 ? (
            <button type="button" className={styles.botaoPrimario} onClick={avancar}>
              Continuar
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              className={styles.botaoPrimario}
              disabled={aguardando}
            >
              {aguardando ? 'Salvando...' : 'Salvar registro'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
