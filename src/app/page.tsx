'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import ReactFlow, { Background, BackgroundVariant, ConnectionMode, ReactFlowInstance, ReactFlowProps, ReactFlowProvider, addEdge, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import SideBar, { nodeTypes } from "@/components/side-bar"

import { CircleNodeType, RenctangleNodeType } from "@/components/flow-node-type";

import './page.css'
import createHelperLine from "@/util/createHelper";

const flowNodeType = {
  circle: CircleNodeType,
  rectangle: RenctangleNodeType
}

const DefaultNodeSize = {
  width: 80,
  height: 80
}

const getKeyPoint = (position: any, width: any, height: any) => {
  return { topLeftPoint: { x: position.x, y: position.y }, centerPointer: { x: position.x + (width / 2), y: position.y + (height / 2) }, rightBottomPointer: { x: position.x + (width), y: position.y + (height) } }
}


export default function Home() {

  const [nodeTypes, setNodeTypes] = useState<nodeTypes[]>([{ name: '圆形', type: 'circle' }, { name: '矩形', type: 'rectangle' }])

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const currentNodesIdsRef = useRef<string[] | null>(null)

  const onConnect = useCallback((params: any) => {
    const edgeProps = {
      type: 'step',
      style: {
        stroke: '#000',
        strokeWidth: '1.5px'
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 10,
        height: 10,
        color: '#000'
      }
    }
    setEdges((eds) => addEdge({ ...params, ...edgeProps }, eds))
  }, []);

  const nodesChange = (e: any) => {
    const ids = nodes.filter(node => e.find((i: { id: string }) => i.id === node.id)).map(i => i.id)
    currentNodesIdsRef.current = ids

    onNodesChange(e)
  }

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(

    (event: React.DragEvent) => {

      event.preventDefault();
      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowInstance) return

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: new Date().getTime().toString(),
        type,
        position,
        height: DefaultNodeSize.height,
        width: DefaultNodeSize.width,
      };

      setNodes((nds) => nds.concat(newNode as any));
    },
    [reactFlowInstance]
  );

  // const getXYHelperPointer = (p1,p2)=>{

  // }

  useEffect(() => {
    const svgPath = document.getElementById('path-svg')
    if (svgPath) {
      svgPath.parentNode?.removeChild(svgPath)
    }

    if (currentNodesIdsRef.current) {

      if (currentNodesIdsRef.current && currentNodesIdsRef.current.length === 1) {
        const currentId = currentNodesIdsRef.current[0]
        const currentNode = nodes.find(i => i.id === currentId)
        const otherNodes = nodes.filter(i => i.id !== currentId)


        const xNode = otherNodes.find(item => {
          const currentKeyPoint = getKeyPoint(currentNode?.position, currentNode?.width, currentNode?.height)
          const itemKeyPoint = getKeyPoint(item?.position, item?.width, item?.height)
          console.log(currentNode, currentKeyPoint.centerPointer.x - itemKeyPoint.centerPointer.x);

          return currentKeyPoint.centerPointer.x - itemKeyPoint.centerPointer.x < 10 && currentKeyPoint.centerPointer.x - itemKeyPoint.centerPointer.x > -10
        })

        const yNode = otherNodes.find(item => {
          const currentKeyPoint = getKeyPoint(currentNode?.position, currentNode?.width, currentNode?.height)
          const itemKeyPoint = getKeyPoint(item?.position, item?.width, item?.height)
          return currentKeyPoint.centerPointer.y - itemKeyPoint.centerPointer.y < 10 && currentKeyPoint.centerPointer.y - itemKeyPoint.centerPointer.y > -10
        })


        if (xNode && yNode) {

          const { centerPointer: centerPointer1 } = getKeyPoint(xNode?.position, xNode?.width, xNode?.height)
          const { centerPointer: centerPointer2 } = getKeyPoint(yNode?.position, yNode?.width, yNode?.height)
          const svg = createHelperLine({ x: centerPointer1.x, y: -100000 }, { x: centerPointer1.x, y: 100000 }, { x: -100000, y: centerPointer2.y }, { x: 100000, y: centerPointer2.y })
          const container = document.getElementsByClassName('react-flow__container')[0]
          container.appendChild(svg)
        } else if (xNode) {

          const { centerPointer } = getKeyPoint(xNode?.position, xNode?.width, xNode?.height)
          const svg = createHelperLine({ x: centerPointer.x, y: -100000 }, { x: centerPointer.x, y: 100000 }, { x: 0, y: 0 }, { x: 0, y: 0 })
          const container = document.getElementsByClassName('react-flow__container')[0]
          container.appendChild(svg)
        } else if (yNode) {

          const { centerPointer } = getKeyPoint(yNode?.position, yNode?.width, yNode?.height)
          const svg = createHelperLine({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: -100000, y: centerPointer.y }, { x: 100000, y: centerPointer.y })
          const container = document.getElementsByClassName('react-flow__container')[0]
          container.appendChild(svg)
        } else {

        }



      } else if (currentNodesIdsRef.current.length > 1) {

      }
    }


    // return () => {
    //   currentNodesIdsRef.current = null
    // }

  }, [nodes])

  return (
    <div className="app">
      <SideBar items={nodeTypes} />
      <main className="flow-contain">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper} >
            <ReactFlow
              nodeTypes={flowNodeType}
              nodes={nodes}
              edges={edges}
              onNodesChange={nodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              connectionMode={ConnectionMode.Loose}
            >
              <Background id="1" gap={10} color="#f1f1f1" variant={BackgroundVariant.Lines} />
              <Background id="2" gap={100} offset={1} color="#ccc" variant={BackgroundVariant.Lines} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </main>
    </div>

  )
}
