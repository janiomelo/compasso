// Componentes das Etapas de Registro — Pacote D
// Componentes puros e reutilizáveis para cada etapa do wizard

import type { FC } from 'react'
import {
  FlaskConical,
  Flower2,
  HeartHandshake,
  HelpCircle,
  Moon,
  Sparkles,
  Target,
  Users,
  Wind,
} from 'lucide-react'
import { INTENCOES, METODOS, INTENSIDADES } from '../../../utilitarios/constantes'
import type { EntradaRegistro } from '../../../tipos'
import styles from '../pagina-registro.module.scss'

interface EtapaBaseProps {
  form: EntradaRegistro
  atualizar: <K extends keyof EntradaRegistro>(campo: K, valor: EntradaRegistro[K]) => void
}

const ICONES_METODO = {
  vapor: Wind,
  flor: Flower2,
  extracao: FlaskConical,
  outro: HelpCircle,
} as const

const ICONES_INTENCAO = {
  paz: HeartHandshake,
  foco: Target,
  social: Users,
  descanso: Moon,
  criatividade: Sparkles,
  outro: HelpCircle,
} as const

/**
 * Etapa 0: Selecionar método
 */
export const EtapaMetodo: FC<EtapaBaseProps> = ({ form, atualizar }) => (
  <div className={styles.opcoesGrid}>
    {METODOS.map((metodo: typeof METODOS[number]) => {
      const IconeMetodo = ICONES_METODO[metodo.id as EntradaRegistro['metodo']]

      return (
        <button
          key={metodo.id}
          type="button"
          className={styles.opcao + (form.metodo === metodo.id ? ' ' + styles['opcao--ativa'] : '')}
          onClick={() => atualizar('metodo', metodo.id as EntradaRegistro['metodo'])}
        >
          <span className={styles.opcao__icone}><IconeMetodo size={32} aria-hidden="true" /></span>
          <span className={styles.opcao__titulo}>{metodo.nome}</span>
        </button>
      )
    })}
  </div>
)

/**
 * Etapa 1: Selecionar intenção
 */
export const EtapaIntencao: FC<EtapaBaseProps> = ({ form, atualizar }) => (
  <div className={styles.listaOpcoes}>
    {INTENCOES.map((intencao: typeof INTENCOES[number]) => {
      const IconeIntencao = ICONES_INTENCAO[intencao.id as EntradaRegistro['intencao']]

      return (
        <button
          key={intencao.id}
          type="button"
          className={styles.opcaoLista + (form.intencao === intencao.id ? ' ' + styles['opcaoLista--ativa'] : '')}
          onClick={() => atualizar('intencao', intencao.id as EntradaRegistro['intencao'])}
        >
          <span>{intencao.nome}</span>
          <span className={styles.opcaoLista__icone}><IconeIntencao size={21} aria-hidden="true" /></span>
        </button>
      )
    })}
  </div>
)

/**
 * Etapa 2: Selecionar intensidade
 */
const DESCRICAO_INTENSIDADE: Record<EntradaRegistro['intensidade'], string> = {
  leve: 'mais sutil',
  media: 'intermediaria',
  alta: 'mais intensa',
}

export const EtapaIntensidade: FC<EtapaBaseProps> = ({ form, atualizar }) => (
  <div className={styles.intensidade}>
    <div className={styles.intensidade__opcoes}>
      {INTENSIDADES.map((item: typeof INTENSIDADES[number]) => (
        <button
          key={item.id}
          type="button"
          className={styles.intensidade__opcao + (form.intensidade === item.id ? ' ' + styles['intensidade__opcao--ativa'] : '')}
          onClick={() => atualizar('intensidade', item.id as EntradaRegistro['intensidade'])}
        >
          <strong>{item.nome}</strong>
          <span>{DESCRICAO_INTENSIDADE[item.id as EntradaRegistro['intensidade']]}</span>
        </button>
      ))}
    </div>
  </div>
)

/**
 * Etapa 3: Adicionar observação (notas)
 */
export const EtapaNotas: FC<EtapaBaseProps> = ({ form, atualizar }) => (
  <div className={styles.finalizacao}>
    <div className={styles.resumoSelecao}>
      <span>{METODOS.find((item: typeof METODOS[number]) => item.id === form.metodo)?.nome}</span>
      <span>{INTENCOES.find((item: typeof INTENCOES[number]) => item.id === form.intencao)?.nome}</span>
      <span>{INTENSIDADES.find((item: typeof INTENSIDADES[number]) => item.id === form.intensidade)?.nome}</span>
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
