'use client'

import { useRef } from 'react'
import { Handle, NodeResizer, Position } from 'reactflow'
import './index.css'

type NodeProps = {
    data: object,
    isConnectable: boolean,
    selected: boolean
}

const resizeEl = (el: any) => {
    const containerWidth = el.parentNode.offsetWidth;
    const containerHeight = el.parentNode.offsetHeight;

    el.setAttribute("width", containerWidth);
    el.setAttribute("height", containerHeight);
}

const CircleNodeType = (nodeProps: NodeProps) => {
    const { data, isConnectable, selected } = nodeProps

    const svgRef = useRef()
    if (svgRef.current) {
        resizeEl(svgRef.current)
    }
    return <>
        <NodeResizer isVisible={selected} minWidth={80} minHeight={80} />

        <div className="flow-node">
            <Handle className='node-handle' id='1' type='source' position={Position.Left} />
            <Handle className='node-handle' id='2' type='source' position={Position.Right} />
            <Handle className='node-handle' id='3' type='source' position={Position.Top} />
            <Handle className='node-handle' id='4' type='source' position={Position.Bottom} />
            <svg width="80" height="80" ref={svgRef as any}>
                <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#fff" stroke="black" strokeWidth="1.5" />
            </svg>
        </div>
    </>

}

const RenctangleNodeType = ({ data, isConnectable, selected }: NodeProps) => {
    const svgRef = useRef()
    if (svgRef.current) {
        resizeEl(svgRef.current)
    }
    return <>
        <NodeResizer isVisible={selected} minWidth={80} minHeight={80} />

        <div className="flow-node">
            <Handle className='node-handle' id='1' type='source' position={Position.Left} />
            <Handle className='node-handle' id='2' type='source' position={Position.Right} />
            <Handle className='node-handle' id='3' type='source' position={Position.Top} />
            <Handle className='node-handle' id='4' type='source' position={Position.Bottom} />
            <svg width="80" height="80" ref={svgRef as any}>
                <rect x="0" y="0" width="100%" height="100%" fill="white" stroke="black" strokeWidth="1.5" />
            </svg>
        </div>
    </>

}

export { CircleNodeType, RenctangleNodeType }