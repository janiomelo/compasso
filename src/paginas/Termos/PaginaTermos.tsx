import { PaginaTextoPublico } from '../../componentes/comum/PaginaTextoPublico'
import { ConteudoTermos } from './conteudo'

export const PaginaTermos = () => {
  return (
    <PaginaTextoPublico rotuloVoltar="Voltar">
      <ConteudoTermos />
    </PaginaTextoPublico>
  )
}
