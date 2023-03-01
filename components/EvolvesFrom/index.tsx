import { EvolvesFrom as EvolvesFromType } from '@/@types/evolution'
import { useAppContext } from '@/contexts/appContext'
import { getEvolvesFrom } from '@/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './EvolvesFrom.module.css'
export const EvolvesFrom = ({
	url,
	name,
	divRef,
}: {
	url?: string
	name: string
	divRef: React.RefObject<HTMLDivElement>
}) => {
	const { setActivePokemon } = useAppContext()
	const [evolvesFrom, setEvolvesFrom] = useState<EvolvesFromType[]>([
		{
			from_name: name,
			chain_url: '',
			from_id: 0,
			from_sprite: '/images/no-image.png',
			item: '',
			min_level: 0,
			trigger: '',
			held_item: '',
		},
	])
	useEffect(() => {
		async function loadData() {
			const data = await getEvolvesFrom(name, url)
			setEvolvesFrom(data)
		}
		loadData()
	}, [name, url])
	if (evolvesFrom[0]) {
		return (
			<div className={styles.pokemon_evolves_from}>
				<div className={styles.pokemon_info}>
					<button
						onClick={() => {
							setActivePokemon(evolvesFrom[0].from_name)
							divRef.current?.scrollTo({
								behavior: 'smooth',
								top: -500,
							})
						}}
					>
						<Image
							src={evolvesFrom[0].from_sprite}
							alt={evolvesFrom[0].from_name}
							width={200}
							height={200}
							placeholder="blur"
							blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOMrAcAATcA2mMRmZgAAAAASUVORK5CYII="
						/>
					</button>
					<div className={styles.pokemon_info_text}>
						<p>
							<strong>Evolve trigger:</strong>
							{`${evolvesFrom[0].trigger.replace('-', ' ')}`}
						</p>
						{evolvesFrom[0].trigger === 'level-up' ? (
							<p>
								<strong>Level up:</strong>
								{` ${evolvesFrom[0].from_name} to`}
								<strong>lvl {evolvesFrom[0].min_level}</strong>
							</p>
						) : evolvesFrom[0].trigger === 'trade' ? (
							<p>
								<strong>Trade:</strong>
								{`${evolvesFrom[0].from_name} with ${evolvesFrom[0].held_item}`}
								<Image
									src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolvesFrom[0].held_item}.png`}
									alt={evolvesFrom[0].from_name}
									width={30}
									height={30}
								/>
							</p>
						) : evolvesFrom[0].trigger === 'use-item' ? (
							<p>
								<strong>Use:</strong>
								{`${evolvesFrom[0].item.replace('-', ' ')}`}
								<Image
									src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolvesFrom[0].item}.png`}
									alt={evolvesFrom[0].item}
									width={30}
									height={30}
								/>
								{` in ${evolvesFrom[0].from_name}`}
							</p>
						) : evolvesFrom[0].trigger === 'spin' ? (
							<p>{`Spin around holding Sweet`}</p>
						) : evolvesFrom[0].trigger === 'tower-of-darkness' ? (
							<p>{`Train in the Tower of Darkness`}</p>
						) : evolvesFrom[0].trigger === 'tower-of-waters' ? (
							<p>{`Train in the Tower of Waters`}</p>
						) : evolvesFrom[0].trigger === 'three-critical-hits' ? (
							<p>{`Land three critical hits in a battle`}</p>
						) : evolvesFrom[0].trigger === 'take-damage' ? (
							<p>{`Go somewhere after taking damage`}</p>
						) : evolvesFrom[0].trigger === 'other' ? (
							<p>{`Other`}</p>
						) : evolvesFrom[0].trigger === 'agile-style-move' ? (
							<p>{`Use Psyshield Bash 20 times in Agile Style`}</p>
						) : evolvesFrom[0].trigger === 'strong-style-move' ? (
							<p>{`Use Barb Barrage 20 times in Strong Style`}</p>
						) : evolvesFrom[0].trigger === 'recoil-damage' ? (
							<p>{`Receive 294 recoil damage in battle`}</p>
						) : null}
					</div>
				</div>
			</div>
		)
	} else {
		return null
	}
}
