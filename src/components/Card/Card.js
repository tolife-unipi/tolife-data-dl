import './Card.scss'

export default function Card({title, children}) {
	return (
		<section className='Card'>
			{title && (
				<h2 className='Card-title'>{title}</h2>
			)}
			<div className='Card-content'>
				{children}
			</div>
		</section>
	);
}