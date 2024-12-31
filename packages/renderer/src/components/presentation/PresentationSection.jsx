import React, { useState, useEffect } from 'react';
import { BiPlus } from 'react-icons/bi';

const PresentationSection = ({onSelectPresentation}) => {
	const [presentations, setPresentations] = useState([]);
	const [newPresentationName, setNewPresentationName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	useEffect(() => {
		loadPresentations();
	}, []);

	//   console.log('Presentations, ', presentations)

	const loadPresentations = async () => {
		try {
			const loadedPresentations = await window.electronAPI.readPresentations();
			setPresentations(loadedPresentations);
		} catch (error) {
			console.error('Failed to load presentations:', error);
		}
	};

	const handleSelectPresentation = (presentation) => {
		console.log('Selected Presentation:', presentation);
		onSelectPresentation(presentation); // Call the parent callback
	};

	const handleCreatePresentation = async () => {
		if (!newPresentationName.trim()) return;

		const newPresentation = {
			id: Date.now(),
			name: newPresentationName,
			createdAt: new Date().toISOString()
		};

		try {
			const updatedPresentations = [...presentations, newPresentation];
			const success = await window.electronAPI.savePresentations(updatedPresentations);

			if (success) {
				setPresentations(updatedPresentations);
				setNewPresentationName('');
				setIsCreating(false);
			} else {
				alert('Failed to save presentation');
			}
		} catch (error) {
			console.error('Error creating presentation:', error);
			alert('Failed to create presentation');
		}
	};

	return (
		<div className="p-4 space-y-4">
			{!isCreating ? (
				<button
					onClick={() => setIsCreating(true)}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<BiPlus className="w-5 h-5" />
					New Presentation
				</button>
			) : (
				<div className="flex gap-2">
					<input
						type="text"
						value={newPresentationName}
						onChange={(e) => setNewPresentationName(e.target.value)}
						placeholder="Enter presentation name"
						className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
						onKeyDown={(e) => e.key === 'Enter' && handleCreatePresentation()}
					/>
					<button
						onClick={handleCreatePresentation}
						className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
					>
						Create
					</button>
					<button
						onClick={() => setIsCreating(false)}
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
					>
						Cancel
					</button>
				</div>
			)}

			<div className="space-y-2">
				{presentations.map(presentation => (
					<div
						key={presentation.id}
						className="p-4 border rounded-lg hover:bg-gray-50"
						onClick={() => handleSelectPresentation(presentation)}
					>
						<h3 className="font-medium">{presentation.name}</h3>
						<p className="text-sm text-gray-500">
							Created: {new Date(presentation.createdAt).toLocaleDateString()}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default PresentationSection;