import { PaginaTextoPublico } from '../../componentes/comum/PaginaTextoPublico'
import { ConteudoSaibaMaisTelemetria } from './conteudo'

export const PaginaSaibaMaisTelemetria = () => {
  return (
    <PaginaTextoPublico rotuloVoltar="Voltar">
      <ConteudoSaibaMaisTelemetria />
    </PaginaTextoPublico>
  )
}
