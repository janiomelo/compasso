import {
  Compass,
  HeartHandshake,
  HelpCircle,
  Info,
  Moon,
  Sparkles,
  Target,
  Users,
  Wind,
} from 'lucide-react'
import type { EntradaRegistro } from '../../../tipos'
import {
  OPCOES_FORMA_USO,
  OPCOES_INTENCAO,
  type PerguntaRegistro,
} from '../config/perguntasRegistro'
import styles from '../pagina-registro.module.scss'

interface RegistroEtapaRendererProps {
  pergunta: PerguntaRegistro
  form: EntradaRegistro
  atualizar: <K extends keyof EntradaRegistro>(campo: K, valor: EntradaRegistro[K]) => void
  observacaoAberta: boolean
  abrirObservacao: () => void
  registroConcluido: EntradaRegistro | null
}

const ICONES_FORMA_USO = {
  vaporizado: Wind,
  fumado: Compass,
  comestivel: Sparkles,
  outro: Info,
} as const

const ICONES_INTENCAO = {
  paz: HeartHandshake,
  foco: Target,
  social: Users,
  descanso: Moon,
  criatividade: Sparkles,
  outro: HelpCircle,
} as const

const chaveResumoIntensidade = {
  leve: 'Leve',
  media: 'Média',
  alta: 'Alta',
} as const

const descricaoIntensidade = {
  leve: 'mais sutil',
  media: 'intermediária',
  alta: 'mais intensa',
} as const

const obterRotuloOpcao = (pergunta: PerguntaRegistro, valor: string): string => {
  return pergunta.opcoes?.find((opcao) => opcao.valor === valor)?.rotulo ?? valor
}

export const RegistroEtapaRenderer = ({
  pergunta,
  form,
  atualizar,
  observacaoAberta,
  abrirObservacao,
  registroConcluido,
}: RegistroEtapaRendererProps) => {
  if (pergunta.tipo === 'escolha-unica' && pergunta.id === 'forma-uso') {
    return (
      <div className={styles.opcoesGrid}>
        {pergunta.opcoes?.map((opcao) => {
          const Icone = ICONES_FORMA_USO[opcao.id as keyof typeof ICONES_FORMA_USO]
          const ativo = form.metodo === opcao.valor

          return (
            <button
              key={opcao.id}
              type="button"
              className={styles.opcao + (ativo ? ' ' + styles['opcao--ativa'] : '')}
              onClick={() => atualizar('metodo', opcao.valor as EntradaRegistro['metodo'])}
            >
              <span className={styles.opcao__icone}><Icone size={32} aria-hidden="true" /></span>
              <span className={styles.opcao__titulo}>{opcao.rotulo}</span>
            </button>
          )
        })}
      </div>
    )
  }

  if (pergunta.tipo === 'escolha-unica' && pergunta.id === 'intencao') {
    return (
      <div className={styles.listaOpcoes}>
        {pergunta.opcoes?.map((opcao) => {
          const Icone = ICONES_INTENCAO[opcao.id as keyof typeof ICONES_INTENCAO]
          const ativo = form.intencao === opcao.valor

          return (
            <button
              key={opcao.id}
              type="button"
              className={styles.opcaoLista + (ativo ? ' ' + styles['opcaoLista--ativa'] : '')}
              onClick={() => atualizar('intencao', opcao.valor as EntradaRegistro['intencao'])}
            >
              <span>{opcao.rotulo}</span>
              <span className={styles.opcaoLista__icone}><Icone size={21} aria-hidden="true" /></span>
            </button>
          )
        })}
      </div>
    )
  }

  if (pergunta.tipo === 'escolha-unica' && pergunta.id === 'intensidade') {
    return (
      <div className={styles.intensidade}>
        <div className={styles.intensidade__opcoes}>
          {pergunta.opcoes?.map((opcao) => {
            const ativo = form.intensidade === opcao.valor

            return (
              <button
                key={opcao.id}
                type="button"
                className={styles.intensidade__opcao + (ativo ? ' ' + styles['intensidade__opcao--ativa'] : '')}
                onClick={() => atualizar('intensidade', opcao.valor as EntradaRegistro['intensidade'])}
              >
                <strong>{opcao.rotulo}</strong>
                <span>{opcao.descricao ?? descricaoIntensidade[opcao.valor as keyof typeof descricaoIntensidade]}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (pergunta.tipo === 'texto-opcional') {
    return (
      <div className={styles.finalizacao}>
        {!observacaoAberta && !(form.notas ?? '').trim() && (
          <button type="button" className={styles.botaoSecundario} onClick={abrirObservacao}>
            Adicionar observação
          </button>
        )}

        {(observacaoAberta || (form.notas ?? '').trim().length > 0) && (
          <label className={styles.campoLabel}>
            Observação opcional
            <textarea
              className={styles.textarea}
              value={form.notas ?? ''}
              onChange={(evento) => atualizar('notas', evento.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Escreva algo, se quiser"
            />
            <span className={styles.contador}>{(form.notas ?? '').length}/500</span>
          </label>
        )}
      </div>
    )
  }

  if (pergunta.tipo === 'conclusao') {
    const formaUso = obterRotuloOpcao(
      {
        ...pergunta,
        opcoes: OPCOES_FORMA_USO,
      },
      registroConcluido?.metodo ?? 'outro',
    )

    const intencao = obterRotuloOpcao(
      {
        ...pergunta,
        opcoes: OPCOES_INTENCAO,
      },
      registroConcluido?.intencao ?? 'outro',
    )

    return (
      <div className={styles.resumoConclusao}>
        <p className={styles.resumoConclusao__sucesso}>Seu registro foi salvo com sucesso.</p>

        <dl className={styles.resumoConclusao__lista}>
          <div>
            <dt>Forma de uso</dt>
            <dd>{formaUso}</dd>
          </div>
          <div>
            <dt>Intenção</dt>
            <dd>{intencao}</dd>
          </div>
          <div>
            <dt>Intensidade</dt>
            <dd>{registroConcluido ? chaveResumoIntensidade[registroConcluido.intensidade] : '-'}</dd>
          </div>
          {registroConcluido?.notas && (
            <div>
              <dt>Observação</dt>
              <dd>{registroConcluido.notas}</dd>
            </div>
          )}
        </dl>
      </div>
    )
  }

  return null
}
