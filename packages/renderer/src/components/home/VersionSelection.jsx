import React from 'react'
// import { Check } from 'lucide-react';

const VersionSelection = ({ versions, selectedVersion, setSelectedVersion }) => {
	return (
		<div className="mb-6">
			<label className="text-sm font-medium text-gray-800 mb-2 block">
				Bible Version
			</label>
			<div className="grid grid-cols-1 gap-2">
				{versions.map(version => (
					<button
						key={version.name}
						onClick={() => setSelectedVersion(version.name)}
						className={`py-2 px-4 rounded-lg text-sm border transition-all duration-200 flex items-center justify-center
						${selectedVersion === version.name
								? 'bg-blue-100 text-blue-700 border-blue-200'
								: 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
					>
						{version.name}
					</button>
				))}
			</div>
		</div>
	)
}

export default VersionSelection