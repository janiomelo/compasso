import type { EntradaRegistro } from '../../../tipos'

export type TipoEtapaRegistro = 'escolha-unica' | 'texto-opcional' | 'conclusao'

export interface OpcaoPerguntaRegistro {
  id: string
  rotulo: string
  valor: string
  descricao?: string
}

export interface PerguntaRegistro {
  id: string
  tipo: TipoEtapaRegistro
  titulo: string
  descricao: string
  campo?: keyof EntradaRegistro
  obrigatoria: boolean
  opcoes?: OpcaoPerguntaRegistro[]
}

export const OPCOES_FORMA_USO: OpcaoPerguntaRegistro[] = [
  { id: 'vaporizado', rotulo: 'Vaporizado', valor: 'vaporizado' },
  { id: 'fumado', rotulo: 'Fumado', valor: 'fumado' },
  { id: 'comestivel', rotulo: 'Comestível', valor: 'comestivel' },
  { id: 'outro', rotulo: 'Outro', valor: 'outro' },
]

export const OPCOES_INTENCAO: OpcaoPerguntaRegistro[] = [
  { id: 'paz', rotulo: 'Paz', valor: 'paz' },
  { id: 'foco', rotulo: 'Foco', valor: 'foco' },
  { id: 'social', rotulo: 'Social', valor: 'social' },
  { id: 'descanso', rotulo: 'Relaxar', valor: 'descanso' },
  { id: 'criatividade', rotulo: 'Criatividade', valor: 'criatividade' },
  { id: 'outro', rotulo: 'Outro', valor: 'outro' },
]

export const OPCOES_INTENSIDADE: OpcaoPerguntaRegistro[] = [
  { id: 'leve', rotulo: 'Leve', valor: 'leve', descricao: 'mais sutil' },
  { id: 'media', rotulo: 'Média', valor: 'media', descricao: 'intermediária' },
  { id: 'alta', rotulo: 'Alta', valor: 'alta', descricao: 'mais intensa' },
]

export const PERGUNTAS_REGISTRO: PerguntaRegistro[] = [
  {
    id: 'forma-uso',
    tipo: 'escolha-unica',
    titulo: 'Qual foi a forma de uso?',
    descricao: 'Escolha a forma de uso que melhor descreve este momento.',
    campo: 'metodo',
    obrigatoria: true,
    opcoes: OPCOES_FORMA_USO,
  },
  {
    id: 'intencao',
    tipo: 'escolha-unica',
    titulo: 'Qual era sua intenção?',
    descricao: 'Escolha a intenção principal deste registro.',
    campo: 'intencao',
    obrigatoria: true,
    opcoes: OPCOES_INTENCAO,
  },
  {
    id: 'intensidade',
    tipo: 'escolha-unica',
    titulo: 'Qual foi a intensidade?',
    descricao: 'Escolha entre Leve, Média ou Alta para registrar rápido.',
    campo: 'intensidade',
    obrigatoria: true,
    opcoes: OPCOES_INTENSIDADE,
  },
  {
    id: 'observacao',
    tipo: 'texto-opcional',
    titulo: 'Algo a mais para guardar deste momento?',
    descricao: 'Opcional. Você pode seguir direto ou abrir um campo curto de observação.',
    campo: 'notas',
    obrigatoria: false,
  },
  {
    id: 'conclusao',
    tipo: 'conclusao',
    titulo: 'Registro concluído',
    descricao: 'Seu registro foi salvo com sucesso.',
    obrigatoria: false,
  },
]
