import React from 'react'
import { HashRouter } from 'react-router-dom'
import Index from './pages'

export default function App() {
	return (
		<div>
			<HashRouter>
				<Index />
			</HashRouter>
		</div>
	)
}
