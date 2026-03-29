import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFluxoRegistro } from './useFluxoRegistro'
import { RegistroEtapaRenderer } from './componentes/RegistroEtapaRenderer'
import { PERGUNTAS_REGISTRO } from './config/perguntasRegistro'
import styles from './pagina-registro.module.scss'

export const PaginaRegistro = () => {
  const navegar = useNavigate()
  const {
    form,
    atualizar,
    atualizarComAutoAvanco,
    etapaAtual,
    registroConcluido,
    avancar,
    voltar,
    registrarOutro,
    handleSubmit,
    aguardando,
    erro,
  } = useFluxoRegistro()

  const etapa = PERGUNTAS_REGISTRO[etapaAtual]
  const estaNaConclusao = etapa.tipo === 'conclusao'
  const estaNaObservacao = etapa.id === 'observacao'
  const usaAutoAvanco = ['forma-uso', 'intencao', 'intensidade'].includes(etapa.id)

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Registrar</span>
        <h1 className={styles.titulo}>Registrar momento</h1>
        <p className={styles.subtitulo}>Um check-in curto, guiado em poucas decisões.</p>
      </header>

      <form className={styles.formulario} onSubmit={handleSubmit} noValidate>
        {!estaNaConclusao && (
          <div className={styles.progresso} aria-label="Progresso do registro">
            {PERGUNTAS_REGISTRO.slice(0, -1).map((_, indice) => (
              <span
                key={indice}
                className={styles.progresso__item + (indice <= etapaAtual ? ' ' + styles['progresso__item--ativo'] : '')}
              />
            ))}
          </div>
        )}

        <section className={styles.etapa + (estaNaConclusao ? ' ' + styles['etapa--conclusao'] : '')}>
          {!estaNaConclusao && (
            <>
              <h2 className={styles.etapa__titulo}>{etapa.titulo}</h2>
              <p className={styles.etapa__descricao}>{etapa.descricao}</p>
            </>
          )}

          <RegistroEtapaRenderer
            pergunta={etapa}
            form={form}
            atualizar={atualizar}
            atualizarComAutoAvanco={atualizarComAutoAvanco}
            registroConcluido={registroConcluido}
          />
        </section>

        {erro && (
          <p className={styles.mensagemErro}>{erro}</p>
        )}

        <div className={styles.acoes}>
          {estaNaConclusao ? (
            <>
              <button type="button" className={styles.botaoPrimario} onClick={() => navegar('/')}>
                Ir para o início
              </button>
              <button type="button" className={styles.botaoSecundario} onClick={registrarOutro}>
                Registrar outro momento
              </button>
            </>
          ) : etapaAtual > 0 ? (
            <button type="button" className={styles.botaoSecundario} onClick={voltar}>
              <ChevronLeft size={18} />
              Voltar
            </button>
          ) : (
            <span />
          )}

          {!estaNaConclusao && !estaNaObservacao && !usaAutoAvanco ? (
            <button type="button" className={styles.botaoPrimario} onClick={avancar}>
              Continuar
              <ChevronRight size={18} />
            </button>
          ) : null}

          {!estaNaConclusao && estaNaObservacao ? (
            <button
              type="submit"
              className={styles.botaoPrimario}
              disabled={aguardando}
            >
              {aguardando ? 'Salvando...' : 'Concluir registro'}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
