import React from 'react'

const TabSelection = ({tabs, activeTab, setActiveTab}) => {
	return (
		<div className="flex mb-6 bg-blue-700 p-2 rounded-lg">
			{tabs.map(tab => (
				<button
					key={tab.id}
					onClick={() => setActiveTab(tab.id)}
					className={`flex items-center px-4 h-10 rounded-lg text-sm font-medium flex-1 transform transition-all duration-300 ease-out
              ${activeTab === tab.id
							? 'bg-white text-blue-700 scale-105 shadow-lg'
							: 'text-white hover:bg-white/10 hover:scale-95'}`}
				>
					<tab.icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${activeTab === tab.id ? 'rotate-12' : ''}`} />
					<span className="transition-colors duration-300">{tab.label}</span>
				</button>
			))}
		</div>
	)
}

export default TabSelection