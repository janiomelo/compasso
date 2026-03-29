import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Circle, Database, Lock, Radio } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../../ganchos'
import styles from '../pagina-principal.module.scss'

const CHAVE_ENTENDA_VISTOS = 'compasso_entenda_vistos'

type EstadoVistos = {
  dadosLocais?: boolean
  telemetria?: boolean
  protecaoSenha?: boolean
}

type ItemEntenda = {
  id: string
  titulo: string
  acaoPendente: string
  acaoConcluida: string
  rota: string
  estadoNavegacao?: { origem: 'home' }
  concluido: boolean
  icone: LucideIcon
  aoVisitar: () => void
}

const obterChaveVistos = (escopo: number) => `${CHAVE_ENTENDA_VISTOS}:${escopo}`

const lerVistos = (escopo: number): EstadoVistos => {
  try {
    const bruto = localStorage.getItem(obterChaveVistos(escopo))
    if (!bruto) {
      return {}
    }

    const valor = JSON.parse(bruto) as EstadoVistos
    return valor ?? {}
  } catch {
    return {}
  }
}

const salvarVistos = (escopo: number, estado: EstadoVistos) => {
  try {
    localStorage.setItem(obterChaveVistos(escopo), JSON.stringify(estado))
  } catch {
    // Sem persistencia local, mantemos apenas estado em memoria.
  }
}

export const SecaoEntendaCompasso = () => {
  const { estado } = useApp()
  const [versaoVistos, setVersaoVistos] = useState(0)
  const escopoVistos = estado.configuracoes.onboarding?.concluidoEm ?? estado.metadados.criadoEm
  const vistos = useMemo(() => lerVistos(escopoVistos), [escopoVistos, versaoVistos])

  const onboardingConcluidoEm = estado.configuracoes.onboarding?.concluidoEm
  const telemetriaAtualizadaEm = estado.configuracoes.telemetria?.atualizadoEm ?? 0

  const telemetriaRevisadaPorConfiguracao = Boolean(onboardingConcluidoEm)
    && telemetriaAtualizadaEm > (onboardingConcluidoEm ?? 0)
  const telemetriaRevisada = telemetriaRevisadaPorConfiguracao || !!vistos.telemetria
  const telemetriaAtivadaPorPadrao = estado.configuracoes.telemetria?.consentido === true && !telemetriaRevisada
  const telemetriaAtiva = estado.configuracoes.telemetria?.consentido === true
  const protecaoConfigurada = estado.configuracoes.protecaoAtiva
  const protecaoRevisada = protecaoConfigurada || !!vistos.protecaoSenha
  const primeiroRegistroConcluido = estado.registros.length > 0

  const marcarVisto = (chave: keyof EstadoVistos) => {
    const proximo: EstadoVistos = {
      ...vistos,
      [chave]: true,
    }

    salvarVistos(escopoVistos, proximo)
    setVersaoVistos((atual) => atual + 1)
  }

  const itens = useMemo<ItemEntenda[]>(() => [
    {
      id: 'dadosLocais',
      titulo: 'Como seus dados ficam salvos',
      acaoPendente: 'Ver',
      acaoConcluida: 'Lido',
      rota: '/config/dados-locais-seguranca',
      estadoNavegacao: { origem: 'home' as const },
      concluido: !!vistos.dadosLocais,
      icone: Database,
      aoVisitar: () => marcarVisto('dadosLocais'),
    },
    {
      id: 'telemetria',
      titulo: 'Telemetria anônima',
      acaoPendente: telemetriaAtivadaPorPadrao ? 'Ativada por padrão' : 'Revisar',
      acaoConcluida: telemetriaAtiva ? 'Ativada' : 'Desativada',
      rota: '/config',
      concluido: telemetriaRevisada,
      icone: Radio,
      aoVisitar: () => marcarVisto('telemetria'),
    },
    {
      id: 'protecaoSenha',
      titulo: 'Proteção por senha',
      acaoPendente: 'Revisar',
      acaoConcluida: protecaoConfigurada ? 'Configurada' : 'Revisada',
      rota: '/config',
      concluido: protecaoRevisada,
      icone: Lock,
      aoVisitar: () => marcarVisto('protecaoSenha'),
    },
    {
      id: 'primeiroRegistro',
      titulo: 'Registrar primeiro momento',
      acaoPendente: 'Registrar',
      acaoConcluida: 'Concluído',
      rota: '/registro',
      concluido: primeiroRegistroConcluido,
      icone: BookOpen,
      aoVisitar: () => undefined,
    },
  ], [vistos, telemetriaRevisada, telemetriaAtivadaPorPadrao, telemetriaAtiva, protecaoConfigurada, protecaoRevisada, primeiroRegistroConcluido])

  const totalItens = itens.length
  const itensConcluidos = itens.filter((item) => item.concluido).length
  const haPendencias = itensConcluidos < totalItens
  const [estaExpandido, setEstaExpandido] = useState(haPendencias)
  const resumoFechado = `${itensConcluidos} de ${totalItens} concluídos · revisar dados, telemetria, proteção e registro`

  useEffect(() => {
    setEstaExpandido(haPendencias)
  }, [haPendencias])

  const mostrarLista = haPendencias || estaExpandido

  return (
    <section className={styles.entendaCompasso} aria-label="Entenda o Compasso">
      {haPendencias ? (
        <div className={styles.entendaCompasso__topo}>
          <div>
            <h2 className={styles.entendaCompasso__titulo}>Entenda o Compasso</h2>
            <p className={styles.entendaCompasso__resumo}>{itensConcluidos} de {totalItens} concluídos</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.entendaCompasso__resumoBotao}
          onClick={() => setEstaExpandido((valorAtual) => !valorAtual)}
          aria-expanded={estaExpandido}
        >
          <span className={styles.entendaCompasso__resumoConteudo}>
            <span className={styles.entendaCompasso__resumoTitulo}>Entenda o Compasso</span>
            <span className={styles.entendaCompasso__resumoLinhaSecundaria}>{resumoFechado}</span>
          </span>

          <span className={styles.entendaCompasso__resumoAcao}>
            <span>{estaExpandido ? 'Recolher' : 'Expandir'}</span>
            {estaExpandido ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          </span>
        </button>
      )}

      {mostrarLista && <div className={styles.entendaCompasso__lista}>
        {itens.map((item) => {
          const Icone = item.icone
          const rotuloAcao = item.concluido ? item.acaoConcluida : item.acaoPendente

          return (
            <Link
              key={item.id}
              to={item.rota}
              state={item.estadoNavegacao}
              onClick={item.aoVisitar}
              className={styles.entendaCompasso__item + (item.concluido ? ' ' + styles['entendaCompasso__item--concluido'] : '')}
            >
              <span className={styles.entendaCompasso__check}>
                {item.concluido ? (
                  <CheckCircle2 size={18} aria-hidden="true" />
                ) : (
                  <Circle size={18} aria-hidden="true" />
                )}
              </span>

              <span className={styles.entendaCompasso__icone}><Icone size={16} /></span>

              <strong>{item.titulo}</strong>
              <span className={styles.entendaCompasso__acao + (rotuloAcao === 'Ativada por padrão' ? ' ' + styles['entendaCompasso__acao--padrao'] : '')}>
                {rotuloAcao}
              </span>
            </Link>
          )
        })}
      </div>}
    </section>
  )
}