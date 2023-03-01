import { useAppContext } from '@/contexts/appContext'
import { FormEvent } from 'react'
import styles from './Search.module.css'
export const Search = () => {
	const { search, setSearch } = useAppContext()
	return (
		<div className={styles.search}>
			<input
				type="text"
				placeholder="Buscar..."
				value={search}
				onChange={(e: FormEvent<HTMLInputElement>) =>
					setSearch(e.currentTarget.value)
				}
			/>
		</div>
	)
}
