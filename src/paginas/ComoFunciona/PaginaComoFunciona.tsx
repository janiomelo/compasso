import { PaginaTextoPublico } from '../../componentes/comum/PaginaTextoPublico'
import { ConteudoComoFunciona } from './conteudo'

export const PaginaComoFunciona = () => {
  return (
    <PaginaTextoPublico rotuloVoltar="Voltar">
      <ConteudoComoFunciona />
    </PaginaTextoPublico>
  )
}
