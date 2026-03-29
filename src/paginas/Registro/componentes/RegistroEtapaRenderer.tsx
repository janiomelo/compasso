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
  atualizarComAutoAvanco: <K extends keyof EntradaRegistro>(campo: K, valor: EntradaRegistro[K]) => void
  observacaoAberta: boolean
  abrirObservacao: () => void
  fecharObservacao: () => void
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
  atualizarComAutoAvanco,
  observacaoAberta,
  abrirObservacao,
  fecharObservacao,
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
              aria-pressed={ativo}
              onClick={() => atualizarComAutoAvanco('metodo', opcao.valor as EntradaRegistro['metodo'])}
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
              aria-pressed={ativo}
              onClick={() => atualizarComAutoAvanco('intencao', opcao.valor as EntradaRegistro['intencao'])}
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
                aria-pressed={ativo}
                onClick={() => atualizarComAutoAvanco('intensidade', opcao.valor as EntradaRegistro['intensidade'])}
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
        <div className={styles.finalizacao__topo}>
          <div className={styles.finalizacao__texto}>
            <strong>Observação opcional</strong>
            <span>Se quiser, adicione um detalhe rápido antes de concluir.</span>
          </div>

          {!observacaoAberta ? (
            <button type="button" className={styles.botaoSecundario} onClick={abrirObservacao}>
              Adicionar observação
            </button>
          ) : (
            <button type="button" className={styles.botaoSecundario} onClick={fecharObservacao}>
              Fechar observação
            </button>
          )}
        </div>

        {observacaoAberta && (
          <label className={styles.campoLabel}>
            Observação opcional
            <textarea
              className={styles.textarea}
              value={form.notas ?? ''}
              onChange={(evento) => atualizar('notas', evento.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Escreva algo, se quiser"
              autoFocus
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

    const intensidadeResumo =
      registroConcluido?.intensidade
        ? chaveResumoIntensidade[registroConcluido.intensidade]
        : '-'

    return (
      <div className={styles.resumoConclusao}>
        <span className={styles.resumoConclusao__eyebrow}>Registro criado</span>
        <h2 className={styles.resumoConclusao__titulo}>Seu momento foi registrado</h2>
        <p className={styles.resumoConclusao__descricao}>
          {formaUso} · {intencao} · Intensidade {intensidadeResumo}
        </p>

        <div className={styles.resumoConclusao__chips}>
          <span className={styles.resumoConclusao__chip}>
            <Wind size={16} aria-hidden="true" />
            {formaUso}
          </span>
          <span className={styles.resumoConclusao__chip}>
            <Target size={16} aria-hidden="true" />
            {intencao}
          </span>
          <span className={styles.resumoConclusao__chip}>
            <Sparkles size={16} aria-hidden="true" />
            Intensidade {intensidadeResumo}
          </span>
        </div>

        {registroConcluido?.notas && (
          <div className={styles.resumoConclusao__observacao}>
            <span className={styles.resumoConclusao__observacaoIcone}>
              <Info size={16} aria-hidden="true" />
            </span>
            <p>{registroConcluido.notas}</p>
          </div>
        )}
      </div>
    )
  }

  return null
}
