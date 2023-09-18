import './Card.scss'

export default function Card({title, children, loading=false}) {
	return (
		<section className={'Card' + (loading ? ' loader':'')}>
			{title && (
				<h2 className='Card-title'>{title}</h2>
			)}
			<div className='Card-content'>
				{children}
			</div>
		</section>
	);
}