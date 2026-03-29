import {
  CheckCircle2,
  ChevronLeft,
  Database,
  Download,
  FileUp,
  HardDriveDownload,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp, useArmazenamento } from '../../ganchos'
import { hidratarEstado, obterResumoDadosLocais } from '../../servicos/servicoDados'
import { formatarDataHora, formatarNumero } from '../../utilitarios/dados/formatacao'
import styles from './pagina-dados-locais-seguranca.module.scss'

const CHAVES_EVENTOS = {
  exportacao: 'compasso.evento.exportacao',
  restauracao: 'compasso.evento.restauracao',
  importacao: 'compasso.evento.importacao',
  validacao: 'compasso.evento.validacao',
} as const

type ResumoLocal = {
  totalRegistros: number
  totalPausas: number
  totalPreferenciasSalvas: number
  tamanhoAproximadoBytes: number
  ultimoBackupManualEm: number | null
  ultimoBackupAutomaticoEm: number | null
}

type HistoricoOperacoes = {
  exportacao: number | null
  restauracao: number | null
  importacao: number | null
  validacao: number | null
}

const lerEvento = (chave: string): number | null => {
  const valor = window.localStorage.getItem(chave)
  if (!valor) {
    return null
  }

  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : null
}

const registrarEvento = (chave: string) => {
  window.localStorage.setItem(chave, String(Date.now()))
}

const formatarTamanho = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${formatarNumero(bytes / 1024, 1)} KB`
  }

  return `${formatarNumero(bytes / (1024 * 1024), 2)} MB`
}

const formatarEvento = (timestamp: number | null) => {
  return timestamp ? formatarDataHora(timestamp) : 'Ainda não registrado'
}

export const PaginaDadosLocaisSeguranca = () => {
  const localizacao = useLocation()
  const { despacho } = useApp()
  const {
    carregando,
    fazerBackupLocal,
    restaurarBackupLocal,
    exportarDados,
    importarDados,
    validarPersistencia,
    limparDados,
  } = useArmazenamento()

  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [resumo, setResumo] = useState<ResumoLocal | null>(null)
  const [historico, setHistorico] = useState<HistoricoOperacoes>({
    exportacao: null,
    restauracao: null,
    importacao: null,
    validacao: null,
  })
  const [validacaoAtual, setValidacaoAtual] = useState<'pendente' | 'ok' | 'inconsistente'>('pendente')
  const inputImportacaoRef = useRef<HTMLInputElement | null>(null)
  const origem = (localizacao.state as { origem?: string } | null)?.origem
  const voltarParaInicio = origem === 'home'
  const destinoVoltar = voltarParaInicio ? '/' : '/config'
  const rotuloVoltar = voltarParaInicio ? 'Voltar para Início' : 'Voltar para Configurações'

  const armazenamentoAtivo = typeof window !== 'undefined' && 'indexedDB' in window

  const sincronizarResumo = async () => {
    const diagnostico = await obterResumoDadosLocais()
    setResumo(diagnostico)
  }

  const sincronizarHistorico = () => {
    setHistorico({
      exportacao: lerEvento(CHAVES_EVENTOS.exportacao),
      restauracao: lerEvento(CHAVES_EVENTOS.restauracao),
      importacao: lerEvento(CHAVES_EVENTOS.importacao),
      validacao: lerEvento(CHAVES_EVENTOS.validacao),
    })
  }

  const limparFeedback = () => {
    setMensagem(null)
    setErro(null)
  }

  const reidratarContexto = async () => {
    const estadoAtualizado = await hidratarEstado()
    despacho({ tipo: 'REIDRATAR_ESTADO', payload: estadoAtualizado })
  }

  const acaoComFeedback = async (acao: () => Promise<void>, sucesso: string) => {
    limparFeedback()

    try {
      await acao()
      await sincronizarResumo()
      sincronizarHistorico()
      setMensagem(sucesso)
    } catch (causa) {
      setErro(causa instanceof Error ? causa.message : 'Falha ao executar ação')
    }
  }

  useEffect(() => {
    void sincronizarResumo()
    sincronizarHistorico()
  }, [])

  const handleBackupManual = async () => {
    await acaoComFeedback(async () => {
      await fazerBackupLocal({ origem: 'manual' })
    }, 'Backup manual salvo com sucesso.')
  }

  const handleRestaurar = async () => {
    await acaoComFeedback(async () => {
      const restaurado = await restaurarBackupLocal({ origemPreferencial: 'manual' })

      if (!restaurado) {
        throw new Error('Nenhum backup encontrado para restauração')
      }

      registrarEvento(CHAVES_EVENTOS.restauracao)
      await reidratarContexto()
    }, 'Backup restaurado com sucesso.')
  }

  const handleExportar = async () => {
    await acaoComFeedback(async () => {
      const { blob, nomeArquivo } = await exportarDados()
      const url = URL.createObjectURL(blob)
      const ancora = document.createElement('a')

      ancora.href = url
      ancora.download = nomeArquivo
      document.body.appendChild(ancora)
      ancora.click()
      ancora.remove()
      URL.revokeObjectURL(url)

      registrarEvento(CHAVES_EVENTOS.exportacao)
    }, 'Exportação concluída com sucesso.')
  }

  const handleImportarArquivo = async (arquivo?: File) => {
    if (!arquivo) {
      return
    }

    await acaoComFeedback(async () => {
      const resultado = await importarDados(arquivo)

      if (!resultado.sucesso) {
        throw new Error(resultado.erros[0] ?? 'Falha ao importar dados')
      }

      registrarEvento(CHAVES_EVENTOS.importacao)
      await reidratarContexto()
    }, 'Importação concluída e estado reidratado.')
  }

  const handleValidar = async () => {
    await acaoComFeedback(async () => {
      const resultado = await validarPersistencia()

      registrarEvento(CHAVES_EVENTOS.validacao)

      if (!resultado.valido) {
        setValidacaoAtual('inconsistente')
        throw new Error(resultado.erros.join(' | '))
      }

      setValidacaoAtual('ok')
    }, 'Persistência validada sem inconsistências.')
  }

  const handleLimpar = async () => {
    const confirmado = window.confirm('Tem certeza que deseja apagar todos os dados locais deste navegador?')

    if (!confirmado) {
      return
    }

    await acaoComFeedback(async () => {
      await limparDados()
      setValidacaoAtual('pendente')
      await reidratarContexto()
    }, 'Todos os dados locais foram removidos.')
  }

  return (
    <div className={styles.pagina}>
      <Link to={destinoVoltar} className={styles.voltar}>
        <ChevronLeft size={16} />
        <span>{rotuloVoltar}</span>
      </Link>

      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Dados locais e segurança</h1>
        <p className={styles.subtitulo}>
          Uma visão prática do que está salvo aqui, do que você pode fazer com esses dados e dos
          limites honestos do armazenamento local com proteção por senha opcional.
        </p>
      </header>

      <section className={styles.gradeEstado}>
        <article className={styles.cartaoStatus}>
          <span>Última importação</span>
          <strong>{formatarEvento(historico.importacao)}</strong>
        </article>

        <article className={styles.cartaoStatus}>
          <span>Armazenamento local</span>
          <strong>{armazenamentoAtivo ? 'Ativo' : 'Indisponível'}</strong>
        </article>

        <article className={styles.cartaoStatus}>
          <span>Última exportação</span>
          <strong>{formatarEvento(historico.exportacao)}</strong>
        </article>

        <article className={styles.cartaoStatus}>
          <span>Última restauração</span>
          <strong>{formatarEvento(historico.restauracao)}</strong>
        </article>

        <article className={styles.cartaoStatus}>
          <span>Última validação</span>
          <strong>{formatarEvento(historico.validacao)}</strong>
        </article>

        <article
          className={
            styles.cartaoStatus +
            ' ' +
            (validacaoAtual === 'ok'
              ? styles['cartaoStatus--ok']
              : validacaoAtual === 'inconsistente'
                ? styles['cartaoStatus--erro']
                : '')
          }
        >
          <span>Estado da persistência</span>
          <strong>
            {validacaoAtual === 'ok'
              ? 'Verificada'
              : validacaoAtual === 'inconsistente'
                ? 'Com inconsistências'
                : 'Pendente'}
          </strong>
        </article>
      </section>

      <section className={styles.gradeResumo}>
        <article className={styles.cartao}>
          <div className={styles.cartaoTopo}>
            <Database size={18} />
            <h2>Seus dados neste dispositivo</h2>
          </div>

          <dl className={styles.listaMetricas}>
            <div>
              <dt>Registros</dt>
              <dd>{resumo ? formatarNumero(resumo.totalRegistros) : '...'}</dd>
            </div>
            <div>
              <dt>Pausas</dt>
              <dd>{resumo ? formatarNumero(resumo.totalPausas) : '...'}</dd>
            </div>
            <div>
              <dt>Preferências salvas</dt>
              <dd>{resumo ? formatarNumero(resumo.totalPreferenciasSalvas) : '...'}</dd>
            </div>
            <div>
              <dt>Tamanho aproximado</dt>
              <dd>{resumo ? formatarTamanho(resumo.tamanhoAproximadoBytes) : '...'}</dd>
            </div>
            <div>
              <dt>Último backup manual</dt>
              <dd>{formatarEvento(resumo?.ultimoBackupManualEm ?? null)}</dd>
            </div>
            <div>
              <dt>Último backup automático</dt>
              <dd>{formatarEvento(resumo?.ultimoBackupAutomaticoEm ?? null)}</dd>
            </div>
          </dl>
        </article>

        <article className={styles.cartao}>
          <div className={styles.cartaoTopo}>
            <HardDriveDownload size={18} />
            <h2>O que essas ações fazem</h2>
          </div>

          <ul className={styles.listaExplicacao}>
            <li>Exportar cria um arquivo sob seu controle fora do app.</li>
            <li>Se a proteção estiver ativa, a exportação pode gerar pacote criptografado.</li>
            <li>Importar substitui o conjunto atual pelos dados do arquivo escolhido.</li>
            <li>Restaurar aplica o backup local mais recente disponível.</li>
            <li>Apagar remove os dados deste navegador e deste dispositivo.</li>
          </ul>
        </article>
      </section>

      <section className={styles.painelAcoes}>
        <h2>Ações</h2>

        <div className={styles.gradeAcoes}>
          <button className={styles.acao} onClick={handleBackupManual} disabled={carregando}>
            <CheckCircle2 size={18} />
            <span>Gerar backup manual</span>
          </button>

          <button className={styles.acao} onClick={handleExportar} disabled={carregando}>
            <Download size={18} />
            <span>Exportar arquivo</span>
          </button>

          <button
            className={styles.acao}
            onClick={() => inputImportacaoRef.current?.click()}
            disabled={carregando}
          >
            <FileUp size={18} />
            <span>Importar arquivo</span>
          </button>

          <button className={styles.acao} onClick={handleRestaurar} disabled={carregando}>
            <RefreshCw size={18} />
            <span>Restaurar backup</span>
          </button>

          <button className={styles.acao} onClick={handleValidar} disabled={carregando}>
            <ShieldCheck size={18} />
            <span>Validar persistência</span>
          </button>

          <button className={styles.acao + ' ' + styles['acao--perigo']} onClick={handleLimpar} disabled={carregando}>
            <Trash2 size={18} />
            <span>Limpar dados locais</span>
          </button>
        </div>
      </section>

      <section className={styles.gradeResumo}>
        <article className={styles.cartaoAviso}>
          <div className={styles.cartaoTopo}>
            <ShieldAlert size={18} />
            <h2>Limites e avisos</h2>
          </div>

          <ul className={styles.listaExplicacao}>
            <li>Os dados locais dependem deste navegador e deste dispositivo.</li>
            <li>A proteção por senha ajuda no acesso local, mas não substitui segurança do dispositivo.</li>
            <li>Arquivos exportados precisam ser guardados com cuidado.</li>
            <li>Limpar dados é irreversível se não houver backup disponível.</li>
          </ul>
        </article>
      </section>

      <input
        ref={inputImportacaoRef}
        type="file"
        accept=".gz,.json,.json.gz"
        className={styles.inputOculto}
        onChange={(evento) => {
          const arquivo = evento.target.files?.[0]
          void handleImportarArquivo(arquivo)
          evento.currentTarget.value = ''
        }}
      />

      {mensagem && <p className={styles.mensagemSucesso}>{mensagem}</p>}
      {erro && <p className={styles.mensagemErro}>{erro}</p>}
    </div>
  )
}