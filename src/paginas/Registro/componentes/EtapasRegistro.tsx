// Componentes das Etapas de Registro — Pacote D
// Componentes puros e reutilizáveis para cada etapa do wizard

import type { FC } from 'react'
import { INTENCOES, METODOS, INTENSIDADES } from '../../../utilitarios/constantes'
import type { EntradaRegistro } from '../../../tipos'
import styles from '../pagina-registro.module.scss'

interface EtapaBaseProps {
  form: EntradaRegistro
  atualizar: <K extends keyof EntradaRegistro>(campo: K, valor: EntradaRegistro[K]) => void
}

/**
 * Etapa 0: Selecionar método
 */
export const EtapaMetodo: FC<EtapaBaseProps> = ({ form, atualizar }) => (
  <div className={styles.opcoesGrid}>
    {METODOS.map((metodo: typeof METODOS[number]) => (
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

/**
 * Etapa 1: Selecionar intenção
 */
export const EtapaIntencao: FC<EtapaBaseProps> = ({ form, atualizar }) => (
  <div className={styles.listaOpcoes}>
    {INTENCOES.map((intencao: typeof INTENCOES[number]) => (
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

/**
 * Etapa 2: Selecionar intensidade
 */
interface EtapaIntensidadeProps extends EtapaBaseProps {
  intensidadeEscala: number
  setIntensidadeEscala: (valor: number) => void
}

const mapearIntensidade = (valor: number): EntradaRegistro['intensidade'] => {
  if (valor <= 3) return 'leve'
  if (valor <= 7) return 'media'
  return 'alta'
}

export const EtapaIntensidade: FC<EtapaIntensidadeProps> = ({
  form,
  atualizar,
  intensidadeEscala,
  setIntensidadeEscala,
}) => (
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
      {INTENSIDADES.map((item: typeof INTENSIDADES[number]) => (
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
