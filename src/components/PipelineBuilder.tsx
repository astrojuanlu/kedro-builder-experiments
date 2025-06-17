import { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Node, 
  Edge, 
  Connection,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Play, Database, Code, Loader2 } from 'lucide-react';
import DatasetNode from './nodes/DatasetNode';
import FunctionNode from './nodes/FunctionNode';
import Sidebar from './Sidebar';
import NodeConfigPanel from './NodeConfigPanel';
import { NodeData, DatasetNodeData, FunctionNodeData } from './NodeConfigPanel';
import { initialNodes, initialEdges } from '../data/initialElements';
import { generateKedroProject } from '@/lib/kedro-service';
import KedroProjectProgressV2 from './KedroProjectProgressV2';

interface PipelineBuilderProps {
  projectDetails: {
    name: string;
    directory: string;
  };
}

const nodeTypes = {
  dataset: DatasetNode,
  function: FunctionNode,
};

const PipelineBuilder = ({ projectDetails }: PipelineBuilderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const { toast } = useToast();

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<NodeData>);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    const name = event.dataTransfer.getData('node/name');
    
    if (!type || !name) return;

    // Get the position where the node was dropped
    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const position = { 
      x: event.clientX - reactFlowBounds.left - 75,
      y: event.clientY - reactFlowBounds.top - 25
    };

    // Create a new node with properly typed data
    if (type === 'dataset') {
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: name,
          type: 'pandas.CSVDataSet',
          filepath: '',
          description: '',
        } as DatasetNodeData
      };
      
      setNodes((nds) => nds.concat(newNode));
    } else if (type === 'function') {
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: name,
          function_name: '',
          inputs: [],
          outputs: [],
          code: '',
          description: '',
        } as FunctionNodeData
      };
      
      setNodes((nds) => nds.concat(newNode));
    }
  };

  const generateProject = async () => {
    setIsGenerating(true);
    setShowProgressModal(true);
    
    toast({
      title: "Project Compilation Started",
      description: `Compiling Kedro project '${projectDetails.name}' in ${projectDetails.directory}`,
      variant: "default",
    });

    try {
      const success = await generateKedroProject({
        projectName: projectDetails.name,
        directory: projectDetails.directory,
        nodes: nodes as Node<NodeData>[],
        edges: edges
      });
      
      if (success) {
        toast({
          title: "Success!",
          description: "Kedro project has been generated successfully.",
          variant: "default",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "There was an error generating the Kedro project. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Project generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the Kedro project. Check console for details.",
        variant: "destructive",
      });
    } finally {
      // We don't set isGenerating to false here because the progress component animation needs to complete
      // setIsGenerating(false);
    }
  };

  const handleCloseProgress = () => {
    setShowProgressModal(false);
    setIsGenerating(false);
  };

  // Utility to convert nodes and edges to Graphviz DOT format
  const nodesEdgesToDot = (nodes, edges) => {
    let dot = 'digraph pipeline {\n';
    nodes.forEach(node => {
      dot += `  "${node.id}" [label="${node.data?.label || node.id}"]\n`;
    });
    edges.forEach(edge => {
      dot += `  "${edge.source}" -> "${edge.target}"\n`;
    });
    dot += '}\n';
    return dot;
  };

  const downloadDotFile = (dotString, filename = 'pipeline.gv') => {
    const blob = new Blob([dotString], { type: 'text/vnd.graphviz' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-kedro-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-kedro-darkgrey p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-bold">
            Pipeline Builder: {projectDetails.name}
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-kedro-white text-black hover:bg-kedro-darkgrey"
              onClick={() => {
                const dot = nodesEdgesToDot(nodes, edges);
                const safeName = projectDetails.name.replace(/[^a-zA-Z0-9-_]/g, '_') || 'pipeline';
                downloadDotFile(dot, `${safeName}.gv`);
              }}
            >
              <Save className="w-4 h-4 mr-2 text-black" />
              Save to DOT
            </Button>
            <Button 
              className="bg-kedro-yellow text-kedro-black hover:bg-amber-500"
              onClick={generateProject}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Compile Project
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-1">
          <div className="flex-1" style={{ height: 'calc(100vh - 73px)' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={handlePaneClick}
              nodeTypes={nodeTypes}
              onDragOver={onDragOver}
              onDrop={onDrop}
              fitView
            >
              <Background />
              <Controls className="react-flow-controls-black" />
              <MiniMap />

              <Panel position="top-left">
                <div className="p-2 bg-kedro-darkgrey rounded-md shadow-md">
                  <div className="text-xs font-medium mb-2 text-kedro-white">Drag elements to canvas:</div>
                  <div className="flex space-x-2">
                    <div 
                      draggable
                      className="flex items-center p-2 bg-kedro-black border border-kedro-yellow rounded cursor-move"
                      onDragStart={(event) => {
                        event.dataTransfer.setData('application/reactflow', 'dataset');
                        event.dataTransfer.setData('node/name', 'New Dataset');
                      }}
                    >
                      <Database className="w-4 h-4 text-kedro-yellow mr-2" />
                      <span className="text-xs">Dataset</span>
                    </div>
                    <div 
                      draggable
                      className="flex items-center p-2 bg-kedro-black border border-kedro-white rounded cursor-move"
                      onDragStart={(event) => {
                        event.dataTransfer.setData('application/reactflow', 'function');
                        event.dataTransfer.setData('node/name', 'New Function');
                      }}
                    >
                      <Code className="w-4 h-4 text-kedro-white mr-2" />
                      <span className="text-xs">Function</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>
          
          {selectedNode && (
            <NodeConfigPanel 
              node={selectedNode}
              nodes={nodes as Node<NodeData>[]}
              updateNode={(updatedNode: Node<NodeData>) => {
                setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n));
              }}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>
      
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <KedroProjectProgressV2 
            isGenerating={isGenerating} 
            projectName={projectDetails.name}
            onClose={handleCloseProgress}
          />
        </div>
      )}
    </div>
  );
};

export default PipelineBuilder;
