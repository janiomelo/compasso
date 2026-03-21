import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFluxoRegistro } from './useFluxoRegistro'
import { EtapaMetodo, EtapaIntencao, EtapaIntensidade, EtapaNotas } from './componentes/EtapasRegistro'
import styles from './pagina-registro.module.scss'

const ETAPAS = [
  { titulo: 'Como foi?', descricao: 'Escolha o método que mais combina com este momento.' },
  { titulo: 'Qual era sua intenção?', descricao: 'Selecione a intenção dominante antes do momento.' },
  { titulo: 'Qual foi a intensidade?', descricao: 'Use a escala para registrar a percepção geral.' },
  { titulo: 'Quer adicionar uma observação?', descricao: 'Esta etapa é opcional e serve para contexto rápido.' },
] as const

export const PaginaRegistro = () => {
  const {
    form,
    atualizar,
    etapaAtual,
    intensidadeEscala,
    setIntensidadeEscala,
    avancar,
    voltar,
    handleSubmit,
    aguardando,
    sucesso,
    erro,
  } = useFluxoRegistro()

  const renderizarEtapa = () => {
    switch (etapaAtual) {
      case 0:
        return <EtapaMetodo form={form} atualizar={atualizar} />
      case 1:
        return <EtapaIntencao form={form} atualizar={atualizar} />
      case 2:
        return (
          <EtapaIntensidade
            form={form}
            atualizar={atualizar}
            intensidadeEscala={intensidadeEscala}
            setIntensidadeEscala={setIntensidadeEscala}
          />
        )
      default:
        return <EtapaNotas form={form} atualizar={atualizar} />
    }
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
