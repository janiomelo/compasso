import { Download, FileUp, RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useApp, useArmazenamento } from '../../ganchos'
import { hidratarEstado } from '../../servicos/servicoDados'
import styles from './pagina-config.module.scss'

export const PaginaConfig = () => {
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
  const inputImportacaoRef = useRef<HTMLInputElement | null>(null)

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

  return (
    <div className={styles.pagina}>
      <header className={styles.topo}>
        <span className={styles.eyebrow}>Configurações</span>
        <h1 className={styles.titulo}>Dados e segurança local</h1>
        <p className={styles.subtitulo}>Backup, restauração e validação da persistência neste dispositivo.</p>
      </header>

      <section className={styles.grade}>
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
