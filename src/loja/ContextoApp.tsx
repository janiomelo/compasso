import React, { useEffect, useReducer, createContext, ReactNode } from 'react'
import { EstadoApp, AcaoApp } from '../tipos'
import { useArmazenamento } from '../ganchos/useArmazenamento'
import { redutor, estadoInicial } from './redutor'

export interface ContextoAppType {
  estado: EstadoApp
  despacho: React.Dispatch<AcaoApp>
}

export const ContextoApp = createContext<ContextoAppType | undefined>(undefined)

export interface ProvedorAppProps {
  children: ReactNode
}

const estadoInicialBootstrap: EstadoApp = {
  ...estadoInicial,
  ui: {
    ...estadoInicial.ui,
    carregando: true,
  },
}

export const ProvedorApp: React.FC<ProvedorAppProps> = ({ children }) => {
  const [estado, despacho] = useReducer(redutor, estadoInicialBootstrap)
  const { carregarEstadoInicial } = useArmazenamento()

  useEffect(() => {
    let ativo = true

    const reidratarEstado = async () => {
      try {
        const estadoPersistido = await carregarEstadoInicial()

        if (!ativo) {
          return
        }

        despacho({ tipo: 'REIDRATAR_ESTADO', payload: estadoPersistido })
      } catch (erro) {
        console.error('Falha ao reidratar estado local do Compasso.', erro)

        if (!ativo) {
          return
        }

        despacho({ tipo: 'DEFINIR_CARREGANDO', payload: false })
      }
    }

    void reidratarEstado()

    return () => {
      ativo = false
    }
  }, [carregarEstadoInicial])

  return (
    <ContextoApp.Provider value={{ estado, despacho }}>
      {children}
    </ContextoApp.Provider>
  )
}
