import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { MANIFESTO_PAGINAS_PUBLICAS } from '../../../src/conteudo-publico/manifestoPaginasPublicas'
import { gerarArtefatosPublicos } from '../../../scripts/gerar-paginas-publicas.mjs'

const diretoriosTemporarios: string[] = []

const criarDiretorioTemporario = async () => {
  const diretorio = await mkdtemp(path.join(os.tmpdir(), 'compasso-publico-'))
  diretoriosTemporarios.push(diretorio)
  return diretorio
}

describe('Geração das páginas públicas estáticas', () => {
  afterEach(async () => {
    await Promise.all(
      diretoriosTemporarios.splice(0).map((diretorio) => rm(diretorio, { recursive: true, force: true })),
    )
  })

  it('deve gerar um HTML por rota pública do manifesto e um sitemap consistente', async () => {
    const diretorioPublico = await criarDiretorioTemporario()

    await gerarArtefatosPublicos({ diretorioPublico })

    const sitemap = await readFile(path.join(diretorioPublico, 'sitemap.xml'), 'utf8')

    expect(sitemap.includes('<loc>https://compasso.digital/</loc>')).toBe(true)
    expect(sitemap.includes('/sobre')).toBe(false)

    for (const pagina of MANIFESTO_PAGINAS_PUBLICAS) {
      const caminhoHtml = path.join(diretorioPublico, pagina.rota.slice(1), 'index.html')
      const html = await readFile(caminhoHtml, 'utf8')

      expect(html.includes(`<title>${pagina.titulo}</title>`)).toBe(true)
      expect(html.includes(`content="${pagina.descricao}"`)).toBe(true)
      expect(html.includes(`href="${pagina.canonical}"`)).toBe(true)
      expect(sitemap.includes(`<loc>${pagina.canonical}</loc>`)).toBe(true)
    }
  })
})