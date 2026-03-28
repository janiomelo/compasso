import { PaginaTextoPublico } from '../../componentes/comum/PaginaTextoPublico'
import { ConteudoProjeto } from './conteudo'

export const PaginaProjeto = () => {
  return (
    <PaginaTextoPublico rotuloVoltar="Voltar">
      <ConteudoProjeto />
    </PaginaTextoPublico>
  )
}
