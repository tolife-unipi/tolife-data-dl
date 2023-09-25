import React from 'react';
import './Card.scss';

export default function Card({title, children, loading=false}: CardProps) {
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

interface CardProps {
	title: string,
	children: string | JSX.Element | JSX.Element[],
	loading: boolean
}