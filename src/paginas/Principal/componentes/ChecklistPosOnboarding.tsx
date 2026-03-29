import { ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp, useArmazenamento } from '../../../ganchos'
import { useTelemetria } from '../../../ganchos/useTelemetria'
import styles from './checklist-pos-onboarding.module.scss'

interface ItemChecklist {
  id: 'dados-locais' | 'telemetria' | 'protecao-senha' | 'primeiro-registro'
  titulo: string
  descricao: string
  intencaoCTA: string
  rota: string
}

const ITENS_CHECKLIST: ItemChecklist[] = [
  {
    id: 'dados-locais',
    titulo: 'Entender seus dados',
    descricao: 'Saiba como seus registros ficam protegidos localmente.',
    intencaoCTA: 'Ler mais',
    rota: '/como-funciona',
  },
  {
    id: 'telemetria',
    titulo: 'Telemetria anônima',
    descricao: 'A telemetria começa ativada e pode ser desativada a qualquer momento.',
    intencaoCTA: 'Revisar',
    rota: '/config',
  },
  {
    id: 'protecao-senha',
    titulo: 'Proteger com senha',
    descricao: 'Criptografe seus dados locais com uma senha pessoal.',
    intencaoCTA: 'Abrir',
    rota: '/config/dados-locais-seguranca',
  },
  {
    id: 'primeiro-registro',
    titulo: 'Fazer primeiro registro',
    descricao: 'Comece a usar o app registrando seu primeiro momento.',
    intencaoCTA: 'Registrar',
    rota: '/registro',
  },
]

export const ChecklistPosOnboarding = () => {
  const navegar = useNavigate()
  const { estado, despacho } = useApp()
  const { salvarConfiguracoes, carregando } = useArmazenamento()
  const { rastrearEvento } = useTelemetria()
  const [estaAberto, setEstaAberto] = useState(false)

  const posOnboarding = estado.configuracoes.onboarding?.posOnboarding
  const jaFoiConcluido = !!posOnboarding?.concluidoEm

  if (jaFoiConcluido) {
    return null
  }

  const marcarItemConcluido = useCallback(
    async (itemId: ItemChecklist['id']) => {
      if (!posOnboarding || !estado.configuracoes.onboarding) return

      const onboardingAtual = estado.configuracoes.onboarding

      const checklist = posOnboarding.checklist.map((item) =>
        item.id === itemId && !item.concluidoEm
          ? { ...item, concluidoEm: Date.now() }
          : item
      )

      const todosConcluidos = checklist.every((item) => item.concluidoEm)

      const posOnboardingAtualizado = {
        ...posOnboarding,
        checklist,
        concluidoEm: todosConcluidos ? (posOnboarding.concluidoEm ?? Date.now()) : posOnboarding.concluidoEm,
      }

      const novasConfiguracoes = {
        ...estado.configuracoes,
        onboarding: {
          ...onboardingAtual,
          posOnboarding: posOnboardingAtualizado,
        },
      }

      await salvarConfiguracoes(novasConfiguracoes)
      despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          onboarding: {
            ...onboardingAtual,
            posOnboarding: posOnboardingAtualizado,
          },
        },
      })

      if (todosConcluidos && !posOnboarding.concluidoEm) {
        rastrearEvento('conclusao_checklist_pos_onboarding', {
          itens_concluidos: checklist.length,
        })
      }
    },
    [estado.configuracoes, salvarConfiguracoes, despacho, posOnboarding, rastrearEvento],
  )

  useEffect(() => {
    if (!posOnboarding || !estado.configuracoes.onboarding) {
      return
    }

    const agora = Date.now()
    const onboardingAtual = estado.configuracoes.onboarding
    let houveMudanca = false

    const checklistSincronizado = posOnboarding.checklist.map((item) => {
      if (item.concluidoEm) {
        return item
      }

      if (item.id === 'telemetria' && estado.configuracoes.telemetria?.consentido !== null) {
        houveMudanca = true
        return {
          ...item,
          concluidoEm: estado.configuracoes.telemetria?.atualizadoEm || posOnboarding.intiniado || agora,
        }
      }

      if (item.id === 'protecao-senha' && estado.configuracoes.protecaoAtiva) {
        houveMudanca = true
        return {
          ...item,
          concluidoEm: posOnboarding.intiniado || agora,
        }
      }

      if (item.id === 'primeiro-registro' && estado.registros.length > 0) {
        houveMudanca = true
        return {
          ...item,
          concluidoEm: posOnboarding.intiniado || agora,
        }
      }

      return item
    })

    const todosConcluidos = checklistSincronizado.every((item) => item.concluidoEm)
    const concluidoEmChecklist = todosConcluidos ? (posOnboarding.concluidoEm ?? agora) : posOnboarding.concluidoEm

    if (!houveMudanca && concluidoEmChecklist === posOnboarding.concluidoEm) {
      return
    }

    const posOnboardingAtualizado = {
      ...posOnboarding,
      checklist: checklistSincronizado,
      concluidoEm: concluidoEmChecklist,
    }

    const novasConfiguracoes = {
      ...estado.configuracoes,
      onboarding: {
        ...onboardingAtual,
        posOnboarding: posOnboardingAtualizado,
      },
    }

    void salvarConfiguracoes(novasConfiguracoes).then(() => {
      despacho({
        tipo: 'DEFINIR_CONFIGURACAO',
        payload: {
          onboarding: {
            ...onboardingAtual,
            posOnboarding: posOnboardingAtualizado,
          },
        },
      })

      if (todosConcluidos && !posOnboarding.concluidoEm) {
        rastrearEvento('conclusao_checklist_pos_onboarding', {
          itens_concluidos: checklistSincronizado.length,
        })
      }
    })
  }, [
    despacho,
    estado.configuracoes,
    estado.registros.length,
    posOnboarding,
    rastrearEvento,
    salvarConfiguracoes,
  ])

  const aoAcionarItem = useCallback(
    async (item: ItemChecklist) => {
      if (item.id === 'dados-locais') {
        await marcarItemConcluido(item.id)
      }

      navegar(item.rota)
    },
    [marcarItemConcluido, navegar],
  )

  if (!posOnboarding || jaFoiConcluido) {
    return null
  }

  const itemsConcluidos = posOnboarding.checklist.filter((i) => i.concluidoEm).length
  const totalItens = posOnboarding.checklist.length

  return (
    <section className={styles.checklist}>
      <div className={styles.topo}>
        <div className={styles.topoTexto}>
          <h2 className={styles.titulo}>Próximos passos</h2>
          <p className={styles.progresso}>
            {itemsConcluidos} de {totalItens} concluídos
          </p>
        </div>
        <button
          type="button"
          className={styles.botaoRecolher + (estaAberto ? ' ' + styles.botaoRecolherAberto : '')}
          onClick={() => setEstaAberto((aberto) => !aberto)}
          aria-expanded={estaAberto}
          aria-label={estaAberto ? 'Recolher próximos passos' : 'Expandir próximos passos'}
        >
          <ChevronDown size={20} className={styles.iconeRecolher} />
        </button>
      </div>

      {estaAberto && (
        <div className={styles.painelItens}>
          {ITENS_CHECKLIST.map((item) => {
            const concluido = posOnboarding.checklist.find(
              (c) => c.id === item.id
            )?.concluidoEm

            return (
              <div key={item.id} className={styles.itemWrapper}>
                <div className={styles.item}>
                  <span className={styles.icone}>
                    {concluido ? (
                      <CheckCircle2
                        size={20}
                        className={styles.iconeConcluido}
                      />
                    ) : (
                      <Circle size={20} />
                    )}
                  </span>
                  <div className={styles.conteudo}>
                    <h3 className={styles.itemTitulo}>{item.titulo}</h3>
                    <p className={styles.itemDescricao}>{item.descricao}</p>
                  </div>
                </div>

                <Link
                  to={item.rota}
                  className={styles.botaoCTA}
                  onClick={(evento) => {
                    evento.preventDefault()
                    void aoAcionarItem(item)
                  }}
                  aria-disabled={carregando}
                >
                  {item.intencaoCTA}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
