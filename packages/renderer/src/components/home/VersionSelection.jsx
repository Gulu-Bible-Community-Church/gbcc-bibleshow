import React from 'react'
import { Check } from 'lucide-react';

const VersionSelection = ({versions, selectedVersion, setSelectedVersion}) => {
	return (
		<div className="version-section">
			<label className="version-label">Bible Version</label>
			<div className="version-grid">
				{versions.map(version => (
					<button
						key={version.name}
						onClick={() => setSelectedVersion(version.name)}
						className={`version-button ${selectedVersion === version.name ? 'active' : ''}`}
					>
						{version.name}
						
					</button>
				))}
			</div>
		</div>
	)
}

export default VersionSelection