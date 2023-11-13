'use client'
import React from 'react'
import './index.css'

export interface nodeTypes {
    name: string,
    type: string
}

interface SideBarProps {
    items?: nodeTypes[]
}

const SideBar: React.FC<SideBarProps> = ({ items = [] }) => {

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        console.log('start');

        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return <div className="node-select-side-bar">
        {
            items.map(i => <div onDragStart={(e) => onDragStart(e, i.type)} key={i.name} className='node-type'>{i.name}</div>)
        }
    </div>
}

export default SideBar