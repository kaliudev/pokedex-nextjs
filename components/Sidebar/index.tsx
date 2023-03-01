import { useAppContext } from '@/contexts/appContext'
import { PokemonList } from '../PokemonList'
import { Search } from '../Search'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
	const { colapsed, setColapsed, isMobile } = useAppContext()
	return (
		<>
			<button
				className={`${styles.colapse_menu} ${
					colapsed
						? styles.colapse_menu_colapsed
						: styles.colapse_menu_not_colapsed
				}`}
				onClick={() => setColapsed(!colapsed)}
			>
				{colapsed ? <span>&#8250;</span> : <span>&#8249;</span>}
			</button>
			<aside
				className={`${styles.sidebar} ${
					colapsed ? styles.colapsed : styles.not_colapsed
				}`}
			>
				<Search />
				<PokemonList />
			</aside>
		</>
	)
}
