import { Download, FileUp, RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useApp, useArmazenamento, useConectividade } from '../../ganchos'
import { hidratarEstado } from '../../servicos/servicoDados'
import styles from './pagina-config.module.scss'

export const PaginaConfig = () => {
  const { estado, despacho } = useApp()
  const { offline } = useConectividade()
  const {
    carregando,
    salvarConfiguracoes,
    fazerBackupLocal,
    restaurarBackupLocal,
    exportarDados,
    importarDados,
    validarPersistencia,
    limparDados,
  } = useArmazenamento()

  const [mensagem, setMensagem] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const inputImportacaoRef = useRef<HTMLInputElement | null>(null)

  const definirTema = async (tema: 'escuro' | 'claro') => {
    limparFeedback()

    const novasConfiguracoes = {
      ...estado.configuracoes,
      tema,
      temaAuto: false,
    }

    await salvarConfiguracoes(novasConfiguracoes)
    despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { tema, temaAuto: false } })
    document.body.classList.toggle('tema-claro', tema === 'claro')
    setMensagem(`Tema ${tema} aplicado.`)
  }

  const definirTemaAutomatico = async () => {
    limparFeedback()

    const novasConfiguracoes = {
      ...estado.configuracoes,
      temaAuto: true,
    }

    await salvarConfiguracoes(novasConfiguracoes)
    despacho({ tipo: 'DEFINIR_CONFIGURACAO', payload: { temaAuto: true } })
    setMensagem('Tema automático ativado. O app seguirá a preferência do sistema.')
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
      setMensagem(sucesso)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao executar ação')
    }
  }

  const handleBackupManual = async () => {
    if (offline) {
      setMensagem('Você está offline. O backup manual foi enfileirado para quando houver conectividade.')
      return
    }

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

      await reidratarContexto()
    }, 'Importação concluída e estado reidratado.')
  }

  const handleValidar = async () => {
    await acaoComFeedback(async () => {
      const resultado = await validarPersistencia()

      if (!resultado.valido) {
        throw new Error(resultado.erros.join(' | '))
      }
    }, 'Persistência validada sem inconsistências.')
  }

  const handleLimpar = async () => {
    const confirmado = window.confirm('Tem certeza que deseja apagar todos os dados locais?')

    if (!confirmado) {
      return
    }

    await acaoComFeedback(async () => {
      await limparDados()
      await reidratarContexto()
    }, 'Todos os dados locais foram removidos.')
  }

  const temaEfetivo = useMemo(() => {
    if (!estado.configuracoes.temaAuto) {
      return estado.configuracoes.tema
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'escuro'
  }, [estado.configuracoes.tema, estado.configuracoes.temaAuto])

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Dados e segurança local</h1>
        <p className={styles.subtitulo}>Backup, restauração e validação da persistência neste dispositivo.</p>
      </header>

      <section className={styles.grade}>
        <button
          className={styles.acao + (estado.configuracoes.temaAuto ? ' ' + styles['acao--ativa'] : '')}
          onClick={() => void definirTemaAutomatico()}
          disabled={carregando}
        >
          <span>Tema automático</span>
        </button>

        <button
          className={styles.acao + (!estado.configuracoes.temaAuto && estado.configuracoes.tema === 'escuro' ? ' ' + styles['acao--ativa'] : '')}
          onClick={() => void definirTema('escuro')}
          disabled={carregando}
        >
          <span>Tema escuro</span>
        </button>

        <button
          className={styles.acao + (!estado.configuracoes.temaAuto && estado.configuracoes.tema === 'claro' ? ' ' + styles['acao--ativa'] : '')}
          onClick={() => void definirTema('claro')}
          disabled={carregando}
        >
          <span>Tema claro</span>
        </button>

        <p className={styles.temaResumo}>
          Tema em uso: <strong>{temaEfetivo === 'claro' ? 'Claro' : 'Escuro'}</strong>
          {estado.configuracoes.temaAuto ? ' (automático)' : ' (manual)'}
        </p>

        <button className={styles.acao} onClick={handleBackupManual} disabled={carregando}>
          <Save size={18} />
          <span>Gerar backup manual</span>
        </button>

        <button className={styles.acao} onClick={handleRestaurar} disabled={carregando}>
          <RefreshCw size={18} />
          <span>Restaurar backup</span>
        </button>

        <button className={styles.acao} onClick={handleExportar} disabled={carregando}>
          <Download size={18} />
          <span>Exportar arquivo (.json.gz)</span>
        </button>

        <button className={styles.acao} onClick={() => inputImportacaoRef.current?.click()} disabled={carregando}>
          <FileUp size={18} />
          <span>Importar arquivo</span>
        </button>

        <button className={styles.acao} onClick={handleValidar} disabled={carregando}>
          <ShieldCheck size={18} />
          <span>Validar persistência</span>
        </button>

        <button className={styles.acao + ' ' + styles['acao--perigo']} onClick={handleLimpar} disabled={carregando}>
          <Trash2 size={18} />
          <span>Limpar dados locais</span>
        </button>
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
