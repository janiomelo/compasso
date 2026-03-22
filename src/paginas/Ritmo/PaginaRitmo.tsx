import { Activity, CalendarDays, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp, useEconomia, useRegistro, useRitmo } from '../../ganchos'
import {
  rotularMetodo,
  rotularIntencao,
  MAPA_INTENSIDADE,
  ROTULOS_TENDENCIA,
} from '../../utilitarios/apresentacao/rotulos'
import {
  calcularValorPercebido,
  compararEconomiaPorPeriodo,
  identificarPadroesUso,
} from '../../utilitarios/dados/calculos'
import { formatarDataHora, formatarMoeda, formatarNumero } from '../../utilitarios/dados/formatacao'
import styles from './pagina-ritmo.module.scss'

const DICAS = [
  'Combine uma pausa curta com hidratação para reduzir recaídas no fim do dia.',
  'Quando notar um gatilho social, mude de ambiente por dez minutos antes de decidir.',
  'Lembretes de respiração nos horários de pico ajudam a reduzir impulsos automáticos.',
  'Planeje uma atividade de substituição nos horários em que o padrão costuma ser mais intenso.',
  'Revise semanalmente suas intenções mais frequentes para ajustar a estratégia de pausa.',
]

const ROTULO_JANELA: Record<'madrugada' | 'manha' | 'tarde' | 'noite', string> = {
  madrugada: 'madrugada',
  manha: 'manhã',
  tarde: 'tarde',
  noite: 'noite',
}

export const PaginaRitmo = () => {
  const { estado } = useApp()
  const { frequencia7Dias, tendencia, estatisticas, percentualReducao } = useRitmo(7)
  const { registros, registrosRecentes } = useRegistro()
  const {
    totalAcumulado,
    taxaDiaria,
    economiaUltimaPausa,
    projecao30Dias,
    economiaPotencialPausaAtiva,
  } = useEconomia()
  const [indiceDica, setIndiceDica] = useState(0)

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
  const padroes = useMemo(() => identificarPadroesUso(registros), [registros])
  const valorPercebido = useMemo(() => calcularValorPercebido(registros, totalAcumulado), [registros, totalAcumulado])
  const comparativoEconomia = useMemo(() => compararEconomiaPorPeriodo(estado.historicoPausa, 30), [estado.historicoPausa])

  const insights = useMemo(() => {
    const lista: string[] = []

    if (padroes.metodoPredominante) {
      lista.push(`Método mais usado no período: ${rotularMetodo(padroes.metodoPredominante)}.`)
    }

    if (padroes.intencaoPredominante) {
      lista.push(`Intenção mais recorrente: ${rotularIntencao(padroes.intencaoPredominante)}.`)
    }

    if (padroes.janelaMaisComum) {
      lista.push(`A maioria dos registros acontece à ${ROTULO_JANELA[padroes.janelaMaisComum]}.`)
    }

    if (percentualReducao > 0) {
      lista.push(`Esta semana você registrou ${formatarNumero(percentualReducao, 1)}% menos do que na anterior.`)
    } else if (percentualReducao < 0) {
      lista.push(`Esta semana teve ${formatarNumero(Math.abs(percentualReducao), 1)}% mais registros do que a anterior — vale observar o que mudou.`)
    }

    if (valorPercebido >= 70) {
      lista.push('Consistência e ganhos de humor mostram evolução sólida.')
    } else if (valorPercebido >= 40) {
      lista.push('Há sinais positivos; estabilizar a rotina de pausas deve ampliar os resultados.')
    } else {
      lista.push('Priorize registrar humor antes e depois das pausas para acompanhar o progresso com mais nitidez.')
    }

    return lista.slice(0, 4)
  }, [padroes, percentualReducao, valorPercebido])

  const resumoPeriodo = useMemo(() => {
    const variacao = comparativoEconomia.variacaoPercentual
    const direcao = variacao >= 0 ? 'acima' : 'abaixo'
    const variacaoAbs = formatarNumero(Math.abs(variacao), 1)

    return [
      variacao !== 0
        ? `Economia dos últimos 30 dias ficou ${variacaoAbs}% ${direcao} do período anterior.`
        : 'Economia dos últimos 30 dias estável em relação ao período anterior.',
      `Taxa diária média de ${formatarMoeda(taxaDiaria)}, com projeção mensal de ${formatarMoeda(projecao30Dias)}.`,
      estatisticas.metodoMaisUsado
        ? `Método mais frequente no período: ${rotularMetodo(estatisticas.metodoMaisUsado)}.`
        : 'Ainda sem método predominante no período.',
      estatisticas.intencaoMaisComum
        ? `Intenção mais comum no período: ${rotularIntencao(estatisticas.intencaoMaisComum)}.`
        : 'Ainda sem intenção predominante no período.',
    ]
  }, [comparativoEconomia.variacaoPercentual, taxaDiaria, projecao30Dias, estatisticas])

  const irParaProximaDica = () => {
    setIndiceDica((indiceAtual) => (indiceAtual + 1) % DICAS.length)
  }

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

        <article className={styles.cartaoMetrica}>
          <div className={styles.cartaoMetrica__topo}><Lightbulb size={18} /> Valor percebido</div>
          <strong className={styles.cartaoMetrica__numero}>{formatarNumero(valorPercebido, 1)}</strong>
          <span className={styles.cartaoMetrica__texto}>escala de 0 a 100</span>
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
        <h2 className={styles.bloco__titulo}>O que as pausas rendem</h2>
        <div className={styles.gradeEconomia}>
          <article className={styles.itemEconomia}>
            <span>Total acumulado</span>
            <strong>{formatarMoeda(totalAcumulado, estado.configuracoes.moedaEconomia)}</strong>
          </article>
          <article className={styles.itemEconomia}>
            <span>Taxa diária</span>
            <strong>{formatarMoeda(taxaDiaria, estado.configuracoes.moedaEconomia)}</strong>
          </article>
          <article className={styles.itemEconomia}>
            <span>Projeção para 30 dias</span>
            <strong>{formatarMoeda(projecao30Dias, estado.configuracoes.moedaEconomia)}</strong>
          </article>
          <article className={styles.itemEconomia}>
            <span>Última pausa concluída</span>
            <strong>{formatarMoeda(economiaUltimaPausa, estado.configuracoes.moedaEconomia)}</strong>
          </article>
          <article className={styles.itemEconomia}>
            <span>Pausa em curso (potencial)</span>
            <strong>{formatarMoeda(economiaPotencialPausaAtiva, estado.configuracoes.moedaEconomia)}</strong>
          </article>
          <article className={styles.itemEconomia}>
            <span>Variação nos últimos 30 dias</span>
            <strong>
              {comparativoEconomia.variacaoPercentual >= 0 ? '+' : ''}
              {formatarNumero(comparativoEconomia.variacaoPercentual, 1)}%
            </strong>
          </article>
        </div>
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>O que o período revela</h2>
        {insights.length === 0 ? (
          <p className={styles.vazio}>Registre alguns momentos para que os padrões comecem a aparecer.</p>
        ) : (
          <ul className={styles.listaInsights}>
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>Dica desta semana</h2>
        <article className={styles.dica}>
          <p>{DICAS[indiceDica]}</p>
          <button className={styles.dica__botao} onClick={irParaProximaDica}>
            Outra dica
          </button>
        </article>
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>Resumo dos últimos 30 dias</h2>
        <ul className={styles.listaRelatorios}>
          {resumoPeriodo.map((linha) => (
            <li key={linha}>{linha}</li>
          ))}
        </ul>
      </section>

      <section className={styles.bloco}>
        <h2 className={styles.bloco__titulo}>Formas mais usadas</h2>
        {metodosMaisUsados.length === 0 ? (
          <p className={styles.vazio}>Ainda sem dados suficientes para montar um ranking de métodos.</p>
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
        <h2 className={styles.bloco__titulo}>Últimos registros</h2>
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
