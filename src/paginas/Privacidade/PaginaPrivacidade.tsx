import { PaginaTextoPublico } from '../../componentes/comum/PaginaTextoPublico'
import { ConteudoPrivacidade } from './conteudo'

export const PaginaPrivacidade = () => {
  return (
    <PaginaTextoPublico rotuloVoltar="Voltar">
      <ConteudoPrivacidade />
    </PaginaTextoPublico>
  )
}
