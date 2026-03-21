import { ArrowRight, Clock3, PauseCircle, Sparkles, TrendingUp, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePausa, useRegistro, useEconomia, useRitmo } from '../../ganchos'
import { INTENCOES, METODOS } from '../../utilitarios/constantes'
import { formatarDataHora, formatarMoeda, formatarDuracao } from '../../utilitarios/dados/formatacao'
import styles from './pagina-principal.module.scss'

const ROTULOS_TENDENCIA = {
  aumentando: '↑ Aumentando',
  diminuindo: '↓ Diminuindo',
  estavel: '→ Estável',
} as const

export const PaginaPrincipal = () => {
  const { pausaAtiva, progresso } = usePausa()
  const { registrosHoje, registrosRecentes } = useRegistro()
  const { totalAcumulado } = useEconomia()
  const { tendencia, estatisticas } = useRitmo(7)
  const recentes = registrosRecentes(4)
  const ultimoRegistro = recentes[0]

  const rotularMetodo = (valor: string) => METODOS.find((item) => item.id === valor)?.nome ?? valor
  const rotularIntencao = (valor: string) => INTENCOES.find((item) => item.id === valor)?.nome ?? valor

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Início</span>
        <h1 className={styles.titulo}>Seu compasso recente</h1>
        <p className={styles.subtitulo}>Uma leitura rápida do momento, com foco em decisão e continuidade.</p>
      </header>

      <section className={styles.hero}>
        <div className={styles.hero__conteudo}>
          <div className={styles.hero__icone}>
            <PauseCircle size={22} strokeWidth={2.2} />
          </div>
          {pausaAtiva && progresso ? (
            <>
              <div className={styles.hero__texto}>
                <span className={styles.hero__kicker}>Pausa ativa</span>
                <h2 className={styles.hero__titulo}>Você já percorreu {Math.round(progresso.percentualConclusao)}% da pausa.</h2>
                <p className={styles.hero__descricao}>
                  {formatarDuracao(progresso.decorridoMs)} já passaram e faltam {formatarDuracao(progresso.restanteMs)} para completar a meta.
                </p>
              </div>

              <div className={styles.hero__progresso}>
                <div
                  className={styles.hero__barra}
                  style={{ width: `${progresso.percentualConclusao}%` }}
                  role="progressbar"
                  aria-valuenow={progresso.percentualConclusao}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              <div className={styles.hero__metricas}>
                <span>{formatarDuracao(pausaAtiva.duracaoPlanjada)} de meta</span>
                <span>{formatarMoeda(pausaAtiva.valorEconomia)} em economia prevista</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.hero__texto}>
                <span className={styles.hero__kicker}>Sem pausa ativa</span>
                <h2 className={styles.hero__titulo}>Nenhuma pausa ativa</h2>
                <p className={styles.hero__descricao}>
                  Se quiser observar melhor o seu ritmo, uma pausa curta já cria contraste suficiente para perceber padrões.
                </p>
              </div>
              <div className={styles.hero__metricas}>
                <span>{registrosHoje.length} registro{registrosHoje.length !== 1 ? 's' : ''} hoje</span>
                <span>{formatarMoeda(totalAcumulado)} já acumulados</span>
              </div>
            </>
          )}

          <div className={styles.hero__acoes}>
            <Link to={pausaAtiva ? '/pausa' : '/pausa'} className={styles.botaoPrimario}>
              {pausaAtiva ? 'Abrir pausa' : 'Iniciar pausa'}
            </Link>
            <Link to="/registro" className={styles.botaoSecundario}>
              Registrar momento
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.grade}>
        <article className={styles.cartao}>
          <div className={styles.cartao__topo}>
            <span className={styles.cartao__icone}><Clock3 size={16} /></span>
            <span className={styles.cartao__rotulo}>Último registro</span>
          </div>
          {ultimoRegistro ? (
            <>
              <strong className={styles.cartao__titulo}>{rotularMetodo(ultimoRegistro.metodo)}</strong>
              <p className={styles.cartao__texto}>{rotularIntencao(ultimoRegistro.intencao)} · intensidade {ultimoRegistro.intensidade}</p>
              <span className={styles.cartao__meta}>{formatarDataHora(ultimoRegistro.timestamp)}</span>
            </>
          ) : (
            <>
              <strong className={styles.cartao__titulo}>Nenhum registro ainda</strong>
              <p className={styles.cartao__texto}>Comece registrando um momento para montar sua leitura recente.</p>
            </>
          )}
        </article>

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

        <article className={styles.cartao}>
          <div className={styles.cartao__topo}>
            <span className={styles.cartao__icone}><Wallet size={16} /></span>
            <span className={styles.cartao__rotulo}>Economia acumulada</span>
          </div>
          <strong className={styles.cartao__numero}>{formatarMoeda(totalAcumulado)}</strong>
          <p className={styles.cartao__texto}>tendência atual: {ROTULOS_TENDENCIA[tendencia].replace(/^[↑↓→]\s/, '').toLowerCase()}</p>
        </article>
      </section>

      <Link to="/registro" className={styles.ctaRegistro}>
        <div>
          <span className={styles.ctaRegistro__eyebrow}>Registrar momento</span>
          <strong className={styles.ctaRegistro__titulo}>Registre como você está agora</strong>
        </div>
        <span className={styles.ctaRegistro__icone}><Sparkles size={20} /></span>
      </Link>

      <section className={styles.secao}>
        <div className={styles.secao__topo}>
          <h2 className={styles.secao__titulo}>Registros recentes</h2>
          <Link to="/ritmo" className={styles.linkInline}>Abrir ritmo <ArrowRight size={15} /></Link>
        </div>
        {recentes.length === 0 ? (
          <p className={styles.vazio}>Nenhum registro ainda. Adicione seu primeiro momento.</p>
        ) : (
          <ul className={styles.listaRegistros}>
            {recentes.map((registro) => (
              <li key={registro.id} className={styles.itemRegistro}>
                <div>
                  <div className={styles.itemRegistro__titulo}>{rotularMetodo(registro.metodo)} <span>· {rotularIntencao(registro.intencao)}</span></div>
                  <div className={styles.itemRegistro__subtitulo}>{formatarDataHora(registro.timestamp)}</div>
                </div>
                <span className={styles.itemRegistro__intensidade}>{registro.intensidade}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
