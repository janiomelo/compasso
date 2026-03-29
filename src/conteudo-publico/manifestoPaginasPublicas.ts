export type FrequenciaSitemap = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type IdentificadorPaginaPublica =
  | 'privacidade'
  | 'como-funciona'
  | 'projeto'
  | 'termos'
  | 'apoie'
  | 'telemetria'

export type RotaPaginaPublica =
  | '/privacidade'
  | '/como-funciona'
  | '/projeto'
  | '/termos'
  | '/apoie'
  | '/telemetria'

type OrigemConteudoAtual = {
  arquivo: string
  exportacao: string
}

export type ManifestoPaginaPublica = {
  id: IdentificadorPaginaPublica
  rota: RotaPaginaPublica
  titulo: string
  descricao: string
  canonical: string
  prioridade: number
  frequencia: FrequenciaSitemap
  indexavel: boolean
  imagemSocial: string
  altImagemSocial: string
  origemConteudoAtual: OrigemConteudoAtual
}

export const URL_BASE_PUBLICA = 'https://compasso.digital'
const IMAGEM_SOCIAL_PADRAO = '/brand/compasso-social-preview.svg'
const ALT_IMAGEM_SOCIAL_PADRAO = 'Marca do Compasso em composição institucional'

export const MANIFESTO_PAGINAS_PUBLICAS: ManifestoPaginaPublica[] = [
  {
    id: 'privacidade',
    rota: '/privacidade',
    titulo: 'Política de Privacidade — Compasso',
    descricao:
      'Entenda como o Compasso trata dados locais, exportação, segurança e limites de uso com linguagem clara e direta.',
    canonical: `${URL_BASE_PUBLICA}/privacidade`,
    prioridade: 0.9,
    frequencia: 'monthly',
    indexavel: true,
    imagemSocial: IMAGEM_SOCIAL_PADRAO,
    altImagemSocial: ALT_IMAGEM_SOCIAL_PADRAO,
    origemConteudoAtual: {
      arquivo: 'src/paginas/Privacidade/conteudo.tsx',
      exportacao: 'ConteudoPrivacidade',
    },
  },
  {
    id: 'como-funciona',
    rota: '/como-funciona',
    titulo: 'Dados locais e segurança — Compasso',
    descricao:
      'Veja como o Compasso funciona no dispositivo, como exportação e backup operam e quais são os limites de segurança do ambiente local.',
    canonical: `${URL_BASE_PUBLICA}/como-funciona`,
    prioridade: 0.8,
    frequencia: 'monthly',
    indexavel: true,
    imagemSocial: IMAGEM_SOCIAL_PADRAO,
    altImagemSocial: ALT_IMAGEM_SOCIAL_PADRAO,
    origemConteudoAtual: {
      arquivo: 'src/paginas/ComoFunciona/conteudo.tsx',
      exportacao: 'ConteudoComoFunciona',
    },
  },
  {
    id: 'projeto',
    rota: '/projeto',
    titulo: 'Sobre e transparência — Compasso',
    descricao:
      'Conheça a proposta do Compasso, o que o projeto é, o que não é e quais valores orientam sua evolução.',
    canonical: `${URL_BASE_PUBLICA}/projeto`,
    prioridade: 0.8,
    frequencia: 'monthly',
    indexavel: true,
    imagemSocial: IMAGEM_SOCIAL_PADRAO,
    altImagemSocial: ALT_IMAGEM_SOCIAL_PADRAO,
    origemConteudoAtual: {
      arquivo: 'src/paginas/Projeto/conteudo.tsx',
      exportacao: 'ConteudoProjeto',
    },
  },
  {
    id: 'termos',
    rota: '/termos',
    titulo: 'Termos de Uso — Compasso',
    descricao:
      'Consulte os limites de uso do Compasso, responsabilidades da pessoa usuária e condições atuais de funcionamento do produto.',
    canonical: `${URL_BASE_PUBLICA}/termos`,
    prioridade: 0.8,
    frequencia: 'monthly',
    indexavel: true,
    imagemSocial: IMAGEM_SOCIAL_PADRAO,
    altImagemSocial: ALT_IMAGEM_SOCIAL_PADRAO,
    origemConteudoAtual: {
      arquivo: 'src/paginas/Termos/conteudo.tsx',
      exportacao: 'ConteudoTermos',
    },
  },
  {
    id: 'apoie',
    rota: '/apoie',
    titulo: 'Apoiar o Compasso',
    descricao:
      'Saiba como apoiar o Compasso de forma voluntária e transparente, sem contrapartidas ou promessas indevidas.',
    canonical: `${URL_BASE_PUBLICA}/apoie`,
    prioridade: 0.7,
    frequencia: 'monthly',
    indexavel: true,
    imagemSocial: IMAGEM_SOCIAL_PADRAO,
    altImagemSocial: ALT_IMAGEM_SOCIAL_PADRAO,
    origemConteudoAtual: {
      arquivo: 'src/paginas/Apoie/conteudo.tsx',
      exportacao: 'ConteudoApoie',
    },
  },
  {
    id: 'telemetria',
    rota: '/telemetria',
    titulo: 'Saiba mais sobre telemetria — Compasso',
    descricao:
      'Entenda quais eventos anônimos o Compasso coleta, o que não é coletado e como desativar a telemetria a qualquer momento.',
    canonical: `${URL_BASE_PUBLICA}/telemetria`,
    prioridade: 0.7,
    frequencia: 'monthly',
    indexavel: true,
    imagemSocial: IMAGEM_SOCIAL_PADRAO,
    altImagemSocial: ALT_IMAGEM_SOCIAL_PADRAO,
    origemConteudoAtual: {
      arquivo: 'src/paginas/SaibaMaisTelemetria/conteudo.tsx',
      exportacao: 'ConteudoSaibaMaisTelemetria',
    },
  },
]

export const obterPaginaPublicaPorRota = (rota: string) =>
  MANIFESTO_PAGINAS_PUBLICAS.find((pagina) => pagina.rota === rota)

export const ROTAS_PUBLICAS_SITEMAP = MANIFESTO_PAGINAS_PUBLICAS.map((pagina) => pagina.rota)