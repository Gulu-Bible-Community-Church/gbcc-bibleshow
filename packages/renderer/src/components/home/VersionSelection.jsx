import React from 'react';
import { LuChevronsUpDown } from "react-icons/lu";

const VersionSelection = ({ versions, selectedVersion, setSelectedVersion }) => {
  return (
    <div className="mb-6 max-w-md">
      <label 
        htmlFor="version-select" 
        className="block text-lg font-bold text-gray-800 mb-3">
        Select Bible Version
      </label>
      <div className="relative">
        <select
          id="version-select"
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
          className="w-full py-2.5 px-3 rounded-lg text-sm font-medium border border-gray-200 
            bg-white hover:border-gray-300 focus:border-blue-300 focus:ring-2 
            focus:ring-blue-100 outline-none appearance-none cursor-pointer pr-10"
        >
          {versions.map(version => (
            <option key={version.name} value={version.name}>
              {version.name}
            </option>
          ))}
        </select>
        <LuChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default VersionSelection;