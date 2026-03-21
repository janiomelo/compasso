import { Activity, CalendarDays, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { useRegistro, useRitmo } from '../../ganchos'
import { rotularMetodo, rotularIntencao, MAPA_INTENSIDADE, ROTULOS_TENDENCIA } from '../../utilitarios/apresentacao/rotulos'
import { formatarDataHora } from '../../utilitarios/dados/formatacao'
import styles from './pagina-ritmo.module.scss'

export const PaginaRitmo = () => {
  const { frequencia7Dias, tendencia, estatisticas } = useRitmo(7)
  const { registros, registrosRecentes } = useRegistro()

  const intensidadeMedia = useMemo(() => {
    if (registros.length === 0) {
      return 0
    }

    const soma = registros.reduce((total, registro) => total + MAPA_INTENSIDADE[registro.intensidade], 0)
    return Number((soma / registros.length).toFixed(1))
  }, [registros])

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
  const recentes = registrosRecentes(5)

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Ritmo</span>
        <h1 className={styles.titulo}>Ritmo recente</h1>
        <p className={styles.subtitulo}>Leitura semanal, método mais frequente e os últimos registros num só lugar.</p>
      </header>

      <section className={styles.metricas}>
        <article className={styles.cartaoMetrica}>
          <div className={styles.cartaoMetrica__topo}><CalendarDays size={18} /> Últimos 7 dias</div>
          <strong className={styles.cartaoMetrica__numero}>{estatisticas.totalRegistros}</strong>
          <span className={styles.cartaoMetrica__texto}>momento{estatisticas.totalRegistros !== 1 ? 's' : ''}</span>
        </article>

        <article className={styles.cartaoMetrica}>
          <div className={styles.cartaoMetrica__topo}><Activity size={18} /> Média semanal</div>
          <strong className={styles.cartaoMetrica__numero}>{(estatisticas.registrosPorDia * 7).toFixed(1)}</strong>
          <span className={styles.cartaoMetrica__texto}>por semana</span>
        </article>

        <article className={styles.cartaoMetrica}>
          <div className={styles.cartaoMetrica__topo}>
            {tendencia === 'diminuindo' ? <TrendingDown size={18} /> : <TrendingUp size={18} />} Tendência
          </div>
          <strong className={styles.cartaoMetrica__numero}>{ROTULOS_TENDENCIA[tendencia]}</strong>
          <span className={styles.cartaoMetrica__texto}>intensidade média {intensidadeMedia.toFixed(1)} / 10</span>
        </article>
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
        <h2 className={styles.bloco__titulo}>Métodos mais frequentes</h2>
        {metodosMaisUsados.length === 0 ? (
          <p className={styles.vazio}>Sem dados suficientes ainda para montar frequência de métodos.</p>
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
        <h2 className={styles.bloco__titulo}>Registros recentes</h2>
        {recentes.length === 0 ? (
          <p className={styles.vazio}>Quando você registrar os primeiros momentos, eles aparecerão aqui.</p>
        ) : (
          <ul className={styles.listaRegistros}>
            {recentes.map((registro) => (
              <li key={registro.id} className={styles.itemRegistro}>
                <div className={styles.itemRegistro__topo}>
                  <strong>{rotularMetodo(registro.metodo)}</strong>
                  <span>{rotularIntencao(registro.intencao)}</span>
                </div>
                <span className={styles.itemRegistro__data}>{formatarDataHora(registro.timestamp)}</span>
                <div className={styles.itemRegistro__trilho}>
                  <div
                    className={styles.itemRegistro__valor}
                    style={{ width: `${MAPA_INTENSIDADE[registro.intensidade] * 10}%` }}
                  />
                </div>
                <span className={styles.itemRegistro__rodape}>{MAPA_INTENSIDADE[registro.intensidade]}/10</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}