import 'fake-indexeddb/auto'
import React from 'react'
import { webcrypto } from 'node:crypto'

// disponibiliza React globalmente para arquivos JSX/TSX de teste
;(globalThis as Record<string, unknown>).React = React

// garante Web Crypto API (crypto.subtle) no ambiente de testes
if (!globalThis.crypto || !globalThis.crypto.subtle) {
	Object.defineProperty(globalThis, 'crypto', {
		value: webcrypto,
		configurable: true,
	})
}

// mock para window.matchMedia (usado em componentes que detectam tema do sistema)
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {}, // deprecated
		removeListener: () => {}, // deprecated
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => {},
	}),
})
