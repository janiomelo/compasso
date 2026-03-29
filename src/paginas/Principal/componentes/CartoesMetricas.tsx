// Cartões de Métricas — Pacote D
// Componentes dos 3 cartões: Último registro, 7 dias, Economia

import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, TrendingUp, Wallet } from 'lucide-react'
import type { FC } from 'react'
import {
  rotularMetodo,
  rotularIntencao,
  rotularIntensidade,
  ROTULOS_TENDENCIA,
} from '../../../utilitarios/apresentacao/rotulos'
import { formatarDataHora, formatarMoeda } from '../../../utilitarios/dados/formatacao'
import { useRegistro, useRitmo, useEconomia } from '../../../ganchos'
import styles from '../pagina-principal.module.scss'

/**
 * Cartão de Último Registro
 */
export const CartaoUltimoRegistro: FC = () => {
  const { registrosRecentes } = useRegistro()
  const recentes = registrosRecentes(1)
  const ultimoRegistro = recentes[0]

  return (
    <article className={styles.cartao}>
      <div className={styles.cartao__topo}>
        <span className={styles.cartao__icone}><Clock3 size={16} /></span>
        <span className={styles.cartao__rotulo}>Último registro</span>
      </div>
      {ultimoRegistro ? (
        <>
          <strong className={styles.cartao__titulo}>{rotularMetodo(ultimoRegistro.metodo)}</strong>
          <p className={styles.cartao__texto}>{rotularIntencao(ultimoRegistro.intencao)} · intensidade {rotularIntensidade(ultimoRegistro.intensidade)}</p>
          <span className={styles.cartao__meta}>{formatarDataHora(ultimoRegistro.timestamp)}</span>
        </>
      ) : (
        <>
          <strong className={styles.cartao__titulo}>Sem registros</strong>
          <p className={styles.cartao__texto}>Comece registrando um momento para montar sua leitura recente.</p>
        </>
      )}
    </article>
  )
}

/**
 * Cartão de Últimos 7 Dias
 */
export const CartaoSeteDias: FC = () => {
  const { estatisticas } = useRitmo(7)

  return (
    <article className={styles.cartao}>
      <div className={styles.cartao__topo}>
        <span className={styles.cartao__icone}><TrendingUp size={16} /></span>
        <span className={styles.cartao__rotulo}>Últimos 7 dias</span>
      </div>
      <strong className={styles.cartao__numero}>{estatisticas.totalRegistros}</strong>
      <p className={styles.cartao__texto}>momento{estatisticas.totalRegistros !== 1 ? 's' : ''} registrados</p>
      <Link to="/ritmo" className={styles.linkInline}>
        Ver histórico completo <ArrowRight size={15} />
      </Link>
    </article>
  )
}

/**
 * Cartão de Economia Acumulada
 */
export const CartaoEconomia: FC = () => {
  const { totalAcumulado, possuiHistoricoEconomia, economiaConfigurada } = useEconomia()
  const { tendencia } = useRitmo(7)

  return (
    <article className={styles.cartao}>
      <div className={styles.cartao__topo}>
        <span className={styles.cartao__icone}><Wallet size={16} /></span>
        <span className={styles.cartao__rotulo}>Economia acumulada</span>
      </div>
      {!economiaConfigurada ? (
        <>
          <strong className={styles.cartao__titulo}>Economia não configurada</strong>
          <p className={styles.cartao__texto}>Adicione um valor diário de uso nas configurações.</p>
        </>
      ) : possuiHistoricoEconomia ? (
        <>
          <strong className={styles.cartao__numero}>{formatarMoeda(totalAcumulado)}</strong>
          <p className={styles.cartao__texto}>tendência atual: {ROTULOS_TENDENCIA[tendencia].replace(/^[↑↓→]\s/, '').toLowerCase()}</p>
        </>
      ) : (
        <>
          <strong className={styles.cartao__titulo}>Economia não iniciada</strong>
          <p className={styles.cartao__texto}>Conclua uma pausa para acompanhar estimativas.</p>
          <Link to="/pausa" className={styles.linkInline}>
            Iniciar pausa <ArrowRight size={15} />
          </Link>
        </>
      )}
    </article>
  )
}
