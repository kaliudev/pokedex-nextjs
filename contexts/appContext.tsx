import { AppContextType, Pokemon } from '@/@types'
import { createContext, ReactNode, useContext, useState } from 'react'

const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = () => useContext(AppContext) as AppContextType

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState<string | undefined>(undefined)
	const [activePokemon, setActivePokemon] = useState<string>('bulbasaur')
	const [colapsed, setColapsed] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	return (
		<AppContext.Provider
			value={{
				pokemons,
				setPokemons,
				loading,
				setLoading,
				search,
				setSearch,
				activePokemon,
				setActivePokemon,
				colapsed,
				setColapsed,
				isMobile,
				setIsMobile,
			}}
		>
			{children}
		</AppContext.Provider>
	)
}
