import { expect, test, type Page } from '@playwright/test'

const concluirOnboarding = async (pagina: Page) => {
  await expect(pagina.getByText('Bem-vindo ao Compasso')).toBeVisible()

  await pagina.getByRole('button', { name: 'Começar' }).click()
  await expect(pagina.getByText('Antes de continuar')).toBeVisible()

  await pagina.getByLabel('Confirmo que tenho 18 anos ou mais').click()
  await pagina.getByRole('button', { name: 'Continuar' }).click()

  await expect(pagina.getByText('Aceite e entrada')).toBeVisible()
  await pagina.getByLabel('Li e aceito os Termos de Uso e a Política de Privacidade').click()
  await pagina.getByRole('button', { name: 'Entrar no Compasso' }).click()

  await expect(pagina.getByText('Seu compasso recente')).toBeVisible()
}

const registrarMomento = async (
  pagina: Page,
  dados: { metodo: string; intencao: string; intensidade: RegExp },
) => {
  await pagina
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Registrar', exact: true })
    .click()
  await expect(pagina.getByRole('heading', { name: 'Registrar momento' })).toBeVisible()

  await pagina.getByRole('button', { name: dados.metodo }).click()
  await pagina.getByRole('button', { name: dados.intencao }).click()
  await pagina.getByRole('button', { name: dados.intensidade }).click()

  await expect(pagina.getByText('Algo a mais para guardar deste momento?')).toBeVisible()
  await pagina.getByRole('button', { name: 'Concluir registro' }).click()
  await expect(pagina.getByText('Seu momento foi registrado')).toBeVisible()

  await pagina.getByRole('button', { name: 'Ir para o início' }).click()
  await expect(pagina.getByText('Seu compasso recente')).toBeVisible()
}

const ativarProtecao = async (pagina: Page, senha: string) => {
  await pagina.getByRole('link', { name: 'Abrir configurações' }).click()
  await expect(pagina.getByRole('heading', { name: 'Configurações' })).toBeVisible()

  await pagina.getByLabel('Nova senha').fill(senha)
  await pagina.getByLabel('Confirmar senha').fill(senha)
  await pagina.getByRole('button', { name: 'Ativar proteção' }).click()

  await expect(pagina.getByText('Proteção ativada. Seus dados locais passam a ser protegidos.')).toBeVisible()
}

test.describe('E2E-01 - fluxo protegido com retorno ao app', () => {
  test('deve manter os dois momentos visíveis após sair e voltar e desbloquear', async ({ page, context }) => {
    const senha = 'SenhaFluxo123'

    await page.goto('/')
    await concluirOnboarding(page)

    await registrarMomento(page, {
      metodo: 'Vaporizado',
      intencao: 'Foco - concentrar',
      intensidade: /Média/i,
    })

    await ativarProtecao(page, senha)

    await registrarMomento(page, {
      metodo: 'Fumado',
      intencao: 'Paz - acalmar',
      intensidade: /Alta/i,
    })

    await page.close()

    const paginaRetorno = await context.newPage()
    await paginaRetorno.goto('/')

    await expect(paginaRetorno.getByText('Desbloquear Compasso')).toBeVisible()
    await paginaRetorno.getByLabel('Senha').fill(senha)
    await paginaRetorno.getByRole('button', { name: 'Desbloquear' }).click()

    await expect(paginaRetorno.getByText('Seu compasso recente')).toBeVisible()
    await expect(paginaRetorno.getByText('Registros recentes')).toBeVisible()
    await expect(paginaRetorno.getByText('Vaporizado').first()).toBeVisible()
    await expect(paginaRetorno.getByText('Fumado').first()).toBeVisible()
  })
})