import React, { useReducer, createContext, ReactNode } from 'react'
import { EstadoApp, AcaoApp } from '../tipos'
import { redutor, estadoInicial } from './redutor'

export interface ContextoAppType {
  estado: EstadoApp
  despacho: React.Dispatch<AcaoApp>
}

export const ContextoApp = createContext<ContextoAppType | undefined>(undefined)

export interface ProvedorAppProps {
  children: ReactNode
}

export const ProvedorApp: React.FC<ProvedorAppProps> = ({ children }) => {
  const [estado, despacho] = useReducer(redutor, estadoInicial)

  return (
    <ContextoApp.Provider value={{ estado, despacho }}>
      {children}
    </ContextoApp.Provider>
  )
}
