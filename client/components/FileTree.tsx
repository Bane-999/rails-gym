import React, { useState } from 'react';
import { FileNode } from '../types';
import { Folder, FileCode, ChevronRight, ChevronDown } from 'lucide-react';

interface FileTreeProps {
    files: FileNode[];
    activePath: string;
    onSelect: (path: string) => void;
}

const FileTreeNode: React.FC<{ 
    node: FileNode; 
    currentPath: string; 
    activePath: string; 
    onSelect: (path: string) => void;
    depth: number;
}> = ({ node, currentPath, activePath, onSelect, depth }) => {
    // Construct full path for this node
    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
    const isActive = !node.isFolder && activePath === fullPath;
    
    // Auto-expand state (simplified: always open for now, or toggleable)
    const [isOpen, setIsOpen] = useState(true);

    const handleClick = () => {
        if (node.isFolder) {
            setIsOpen(!isOpen);
        } else {
            onSelect(fullPath);
        }
    };

    return (
        <div>
            <div 
                onClick={handleClick}
                className={`flex items-center gap-1 py-1 px-2 text-sm select-none cursor-pointer transition-colors
                ${isActive ? 'bg-slate-800 text-white border-l-2 border-red-500' : 'text-slate-400 border-l-2 border-transparent'}
                ${!isActive ? 'hover:text-slate-200 hover:bg-slate-800/30' : ''}
                `}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
                <span className="opacity-70 flex-shrink-0 w-4">
                    {node.isFolder ? (
                        isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    ) : null}
                </span>
                <span className="opacity-80 flex-shrink-0">
                    {node.isFolder ? (
                        <Folder className="w-3.5 h-3.5 fill-slate-500 text-slate-500" />
                    ) : (
                        <FileCode className={`w-3.5 h-3.5 ${node.name.endsWith('_spec.rb') ? 'text-green-600' : 'text-red-400'}`} />
                    )}
                </span>
                <span className="truncate ml-1">{node.name}</span>
            </div>
            
            {node.isFolder && isOpen && node.children && (
                <div>
                    {node.children.map((child, idx) => (
                        <FileTreeNode 
                            key={idx} 
                            node={child} 
                            currentPath={fullPath} 
                            activePath={activePath} 
                            onSelect={onSelect}
                            depth={depth + 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTree: React.FC<FileTreeProps> = ({ files, activePath, onSelect }) => {
    return (
        <div className="h-full bg-slate-900 border-r border-slate-700 flex flex-col">
            <div className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                <span>Explorer</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
                {files.map((file, idx) => (
                    <FileTreeNode 
                        key={idx} 
                        node={file} 
                        currentPath="" 
                        activePath={activePath} 
                        onSelect={onSelect}
                        depth={0} 
                    />
                ))}
            </div>
        </div>
    );
};

export default FileTree;
