import { PaginaTextoPublico } from '../../componentes/comum/PaginaTextoPublico'
import { ConteudoApoie } from './conteudo'

export const PaginaApoie = () => {
  return (
    <PaginaTextoPublico rotuloVoltar="Voltar">
      <ConteudoApoie />
    </PaginaTextoPublico>
  )
}
