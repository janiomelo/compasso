import 'fake-indexeddb/auto'
import React from 'react'

// disponibiliza React globalmente para arquivos JSX/TSX de teste
;(globalThis as Record<string, unknown>).React = React
