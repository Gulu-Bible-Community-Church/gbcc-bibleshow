import React from 'react'

const SinglePresentation = ({selectedPresentation}) => {
	console.log(selectedPresentation)
  return (
	<div className='w-full max-w-lg mx-auto p-4'>
		<h1 className='text-3xl font-bold mb-4'>{selectedPresentation.name}</h1>
	</div>
  )
}

export default SinglePresentation