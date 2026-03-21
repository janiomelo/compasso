import { useContext } from 'react'
import { ContextoApp, ContextoAppType } from '../loja/ContextoApp'

export const useApp = (): ContextoAppType => {
  const contexto = useContext(ContextoApp)
  
  if (!contexto) {
    throw new Error(
      'useApp deve ser usado dentro de um ProvedorApp. ' +
      'Certifique-se de que ProvedorApp envolve seu componente.'
    )
  }
  
  return contexto
}
