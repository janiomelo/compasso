import { useState } from 'react'
import { useRegistro } from '../../ganchos'
import { INTENCOES, METODOS, INTENSIDADES } from '../../utilitarios/constantes'
import type { EntradaRegistro } from '../../tipos'
import styles from './pagina-registro.module.scss'

const ESTADO_INICIAL: EntradaRegistro = {
  metodo: 'vapor',
  intencao: 'foco',
  intensidade: 'leve',
  humorAntes: undefined,
  humorDepois: undefined,
  notas: '',
}

export const PaginaRegistro = () => {
  const { criar } = useRegistro()
  const [form, setForm] = useState<EntradaRegistro>(ESTADO_INICIAL)
  const [aguardando, setAguardando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const atualizar = <K extends keyof EntradaRegistro>(campo: K, valor: EntradaRegistro[K]) => {
    setForm((anterior) => ({ ...anterior, [campo]: valor }))
    setSucesso(false)
    setErro(null)
  }

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault()
    setAguardando(true)
    setErro(null)

    try {
      await criar(form)
      setSucesso(true)
      setForm(ESTADO_INICIAL)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao salvar registro')
    } finally {
      setAguardando(false)
    }
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <h1 className={styles.titulo}>Registrar Momento</h1>
        <p className={styles.subtitulo}>Capture este momento com intenção.</p>
      </header>

      <form className={styles.formulario} onSubmit={handleSubmit} noValidate>

        {/* Método */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legenda}>Método</legend>
          <div className={styles.opcoes}>
            {METODOS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={
                  styles.chip +
                  (form.metodo === m.id ? ' ' + styles['chip--ativo'] : '')
                }
                onClick={() => atualizar('metodo', m.id as EntradaRegistro['metodo'])}
              >
                {m.icone} {m.nome}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Intenção */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legenda}>Intenção</legend>
          <div className={styles.opcoes}>
            {INTENCOES.map((i) => (
              <button
                key={i.id}
                type="button"
                className={
                  styles.chip +
                  (form.intencao === i.id ? ' ' + styles['chip--ativo'] : '')
                }
                onClick={() => atualizar('intencao', i.id as EntradaRegistro['intencao'])}
              >
                {i.icone} {i.nome}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Intensidade */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legenda}>Intensidade</legend>
          <div className={styles.opcoes}>
            {INTENSIDADES.map((n) => (
              <button
                key={n.id}
                type="button"
                className={
                  styles.chip +
                  (form.intensidade === n.id ? ' ' + styles['chip--ativo'] : '')
                }
                onClick={() => atualizar('intensidade', n.id as EntradaRegistro['intensidade'])}
              >
                {n.nome}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Humor */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legenda}>Humor (opcional)</legend>
          <div className={styles.humoresGrid}>
            <label className={styles.campoLabel}>
              Antes
              <input
                className={styles.campoNumero}
                type="number"
                min={1}
                max={10}
                value={form.humorAntes ?? ''}
                onChange={(e) =>
                  atualizar('humorAntes', e.target.value ? parseInt(e.target.value, 10) : undefined)
                }
                placeholder="1–10"
              />
            </label>
            <label className={styles.campoLabel}>
              Depois
              <input
                className={styles.campoNumero}
                type="number"
                min={1}
                max={10}
                value={form.humorDepois ?? ''}
                onChange={(e) =>
                  atualizar('humorDepois', e.target.value ? parseInt(e.target.value, 10) : undefined)
                }
                placeholder="1–10"
              />
            </label>
          </div>
        </fieldset>

        {/* Notas */}
        <label className={styles.campoLabel}>
          Notas (opcional)
          <textarea
            className={styles.textarea}
            value={form.notas ?? ''}
            onChange={(e) => atualizar('notas', e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="O que você está sentindo ou pensando agora?"
          />
          <span className={styles.contador}>{(form.notas ?? '').length}/500</span>
        </label>

        {sucesso && (
          <p className={styles.mensagemSucesso}>✓ Registro salvo com sucesso.</p>
        )}
        {erro && (
          <p className={styles.mensagemErro}>{erro}</p>
        )}

        <button
          type="submit"
          className={styles.botaoSalvar}
          disabled={aguardando}
        >
          {aguardando ? 'Salvando...' : 'Salvar registro'}
        </button>
      </form>
    </div>
  )
}
