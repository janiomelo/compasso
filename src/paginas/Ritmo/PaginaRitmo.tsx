import {
  Activity,
  CalendarDays,
  HeartHandshake,
  HelpCircle,
  Lightbulb,
  Moon,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useMemo } from 'react'
import { useEconomia, useRegistro, useRitmo } from '../../ganchos'
import {
  rotularMetodo,
  rotularIntencao,
  rotularIntensidade,
} from '../../utilitarios/apresentacao/rotulos'
import { calcularValorPercebido } from '../../utilitarios/dados/calculos'
import { formatarNumero } from '../../utilitarios/dados/formatacao'
import styles from './pagina-ritmo.module.scss'

const ROTULOS_TENDENCIA_CURTOS = {
  aumentando: 'Em alta',
  diminuindo: 'Em queda',
  estavel: 'Estável',
} as const

const ICONES_INTENCAO = {
  paz: HeartHandshake,
  foco: Target,
  social: Users,
  descanso: Moon,
  criatividade: Sparkles,
  outro: HelpCircle,
} as const

export const PaginaRitmo = () => {
  const { frequencia7Dias, tendencia, estatisticas } = useRitmo(7)
  const { registros } = useRegistro()
  const { totalAcumulado } = useEconomia()

  const totalRegistrosUltimos7Dias = estatisticas.totalRegistros
  const exibicaoSimplificada = totalRegistrosUltimos7Dias < 3

  const intensidadePredominante = useMemo(() => {
    if (registros.length === 0) {
      return null
    }

    const mapa = registros.reduce<Record<string, number>>((acumulado, registro) => {
      acumulado[registro.intensidade] = (acumulado[registro.intensidade] ?? 0) + 1
      return acumulado
    }, {})

    const intensidade = Object.entries(mapa).sort((a, b) => b[1] - a[1])[0]?.[0]
    return intensidade ?? null
  }, [registros])

  const diasDeHistorico = useMemo(() => {
    if (registros.length === 0) {
      return 0
    }

    const primeiroRegistro = registros.reduce(
      (menor, registro) => Math.min(menor, registro.timestamp),
      registros[0].timestamp,
    )

    const diaMs = 24 * 60 * 60 * 1000
    const diferencaDias = Math.floor((Date.now() - primeiroRegistro) / diaMs)
    return diferencaDias + 1
  }, [registros])

  const mostrarTendencia = !exibicaoSimplificada && diasDeHistorico >= 7
  const mostrarValorPercebido = totalAcumulado > 0
  const rotuloIntensidadePredominante = intensidadePredominante
    ? rotularIntensidade(intensidadePredominante)
    : 'Sem intensidade definida'

  const diasSemana = useMemo(() => {
    const hoje = new Date()

    return Array.from({ length: 7 }, (_, indice) => {
      const data = new Date(hoje)
      data.setHours(0, 0, 0, 0)
      data.setDate(hoje.getDate() - (6 - indice))
      const chave = data.toISOString().split('T')[0]

      return {
        chave,
        diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        diaMes: data.getDate(),
        quantidade: frequencia7Dias[chave] ?? 0,
        hoje: indice === 6,
      }
    })
  }, [frequencia7Dias])

  const metodosMaisUsados = useMemo(() => {
    const mapa = registros.reduce<Record<string, number>>((acumulado, registro) => {
      acumulado[registro.metodo] = (acumulado[registro.metodo] ?? 0) + 1
      return acumulado
    }, {})

    return Object.entries(mapa)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [registros])

  const maiorFrequenciaMetodo = metodosMaisUsados[0]?.[1] ?? 1
  const valorPercebido = useMemo(() => calcularValorPercebido(registros, totalAcumulado), [registros, totalAcumulado])

  const intencoesAgrupadas = useMemo(() => {
    const mapa = registros.reduce<Record<string, number>>((acumulado, registro) => {
      acumulado[registro.intencao] = (acumulado[registro.intencao] ?? 0) + 1
      return acumulado
    }, {})

    return Object.entries(mapa)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [registros])

  const maiorFrequenciaIntencao = intencoesAgrupadas[0]?.[1] ?? 1

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Ritmo</span>
        <h1 className={styles.titulo}>Como está seu ritmo</h1>
        <p className={styles.subtitulo}>Frequência, pausas e padrões reunidos para você entender a semana e ajustar o que vier a seguir.</p>
      </header>

      <section className={styles.metricas}>
        <article className={styles.cartaoMetrica}>
          <div className={styles.cartaoMetrica__topo}><CalendarDays size={18} /> Últimos 7 dias</div>
          <strong className={styles.cartaoMetrica__numero}>{estatisticas.totalRegistros}</strong>
          <span className={styles.cartaoMetrica__texto}>momento{estatisticas.totalRegistros !== 1 ? 's' : ''}</span>
        </article>

        <article className={styles.cartaoMetrica}>
          <div className={styles.cartaoMetrica__topo}><Activity size={18} /> {exibicaoSimplificada ? 'Leitura simples' : 'Média semanal'}</div>
          {exibicaoSimplificada ? (
            <>
              <strong className={styles.cartaoMetrica__numero + ' ' + styles['cartaoMetrica__numero--texto']}>
                Base inicial
              </strong>
              <span className={styles.cartaoMetrica__texto}>Adicione mais registros para abrir a leitura detalhada.</span>
            </>
          ) : (
            <>
              <strong className={styles.cartaoMetrica__numero + ' ' + styles['cartaoMetrica__numero--medio']}>
                {(estatisticas.registrosPorDia * 7).toFixed(1)}
              </strong>
              <span className={styles.cartaoMetrica__texto}>intensidade mais comum {rotuloIntensidadePredominante}</span>
            </>
          )}
        </article>

        {mostrarTendencia ? (
          <article className={styles.cartaoMetrica}>
            <div className={styles.cartaoMetrica__topo}>
              {tendencia === 'diminuindo' ? <TrendingDown size={18} /> : <TrendingUp size={18} />} Tendência
            </div>
            <strong className={styles.cartaoMetrica__numero + ' ' + styles['cartaoMetrica__numero--texto']}>
              {ROTULOS_TENDENCIA_CURTOS[tendencia]}
            </strong>
            <span className={styles.cartaoMetrica__texto}>com base nos últimos 7 dias</span>
          </article>
        ) : null}

        {mostrarValorPercebido ? (
          <article className={styles.cartaoMetrica}>
            <div className={styles.cartaoMetrica__topo}><Lightbulb size={18} /> Valor percebido</div>
            <strong className={styles.cartaoMetrica__numero}>{formatarNumero(valorPercebido, 1)}</strong>
            <span className={styles.cartaoMetrica__texto}>escala de 0 a 100</span>
          </article>
        ) : null}
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>Esta semana</h2>
        <div className={styles.semana}>
          {diasSemana.map((dia) => (
            <article key={dia.chave} className={styles.dia + (dia.hoje ? ' ' + styles['dia--hoje'] : '')}>
              <span className={styles.dia__semana}>{dia.diaSemana}</span>
              <strong className={styles.dia__numero}>{dia.diaMes}</strong>
              <span className={styles.dia__quantidade}>{dia.quantidade}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>Formas mais usadas</h2>
        {metodosMaisUsados.length === 0 ? (
          <p className={styles.vazio}>Ainda sem dados suficientes para montar um ranking de formas de uso.</p>
        ) : (
          <div className={styles.barras}>
            {metodosMaisUsados.map(([metodo, quantidade]) => (
              <div key={metodo} className={styles.barraLinha}>
                <div className={styles.barraLinha__rotulo}>
                  <span>{rotularMetodo(metodo)}</span>
                  <span>{quantidade} vez{quantidade !== 1 ? 'es' : ''}</span>
                </div>
                <div className={styles.barraLinha__trilho}>
                  <div
                    className={styles.barraLinha__valor}
                    style={{ width: `${(quantidade / maiorFrequenciaMetodo) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>Intenções que mais aparecem</h2>
        {intencoesAgrupadas.length === 0 ? (
          <p className={styles.vazio}>Quando você registrar os primeiros momentos, as intenções mais frequentes aparecem aqui.</p>
        ) : (
          <div className={styles.gradeIntencoes}>
            {intencoesAgrupadas.map(([intencao, quantidade]) => {
              const Icone = ICONES_INTENCAO[intencao as keyof typeof ICONES_INTENCAO] ?? HelpCircle
              const percentual = (quantidade / maiorFrequenciaIntencao) * 100

              return (
                <article key={intencao} className={styles.cartaoIntencao}>
                  <div className={styles.cartaoIntencao__topo}>
                    <span className={styles.cartaoIntencao__icone}>
                      <Icone size={18} aria-hidden="true" />
                    </span>
                    <span className={styles.cartaoIntencao__quantidade}>
                      {quantidade} momento{quantidade !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <strong className={styles.cartaoIntencao__titulo}>{rotularIntencao(intencao)}</strong>

                  <div className={styles.cartaoIntencao__trilho}>
                    <div
                      className={styles.cartaoIntencao__valor}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>

                  <span className={styles.cartaoIntencao__apoio}>
                    {Math.round((quantidade / registros.length) * 100)}% dos registros visíveis
                  </span>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
