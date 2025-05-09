import { useState, useEffect, useRef } from 'react';
import { X, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Node } from '@xyflow/react';

// Define the data types for our nodes with index signatures to satisfy Record<string, unknown>
export interface DatasetNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  filepath: string;
  description: string;
}

export interface FunctionNodeData extends Record<string, unknown> {
  label: string;
  function_name: string;
  inputs: string[];
  outputs: string[];
  code: string;
  description: string;
}

// Union type for node data
export type NodeData = DatasetNodeData | FunctionNodeData;

interface NodeConfigPanelProps {
  node: Node<NodeData>;
  nodes: Node<NodeData>[];
  updateNode: (node: Node<NodeData>) => void;
  onClose: () => void;
}

const datasetTypes = [
  'pandas.CSVDataSet',
  'pandas.ParquetDataSet',
  'pandas.ExcelDataSet',
  'spark.SparkDataSet',
  'pickle.PickleDataSet',
  'kedro.io.MemoryDataSet',
];

const NodeConfigPanel = ({ node, nodes, updateNode, onClose }: NodeConfigPanelProps) => {
  const [localNode, setLocalNode] = useState<Node<NodeData>>(node);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalNode(node);
  }, [node]);

  const handleChange = (key: string, value: string | string[]) => {
    setLocalNode(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    updateNode(localNode);
  };

  const availableInputs = nodes
    .filter(n => n.id !== node.id) // Don't include self
    .map(n => ({
      id: n.id,
      label: n.data.label as string
    }));

  const isDatasetNode = node.type === 'dataset';
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filepath = e.target.files[0].name;
      handleChange('filepath', filepath);
    }
  };

  return (
    <div className="w-80 bg-kedro-darkgrey border-l border-gray-700 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Configure {isDatasetNode ? 'Dataset' : 'Function'}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-black">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={localNode.data.label as string}
            onChange={(e) => handleChange('label', e.target.value)}
            className="bg-kedro-black border-gray-700"
          />
        </div>

        {isDatasetNode ? (
          <>
            <div>
              <Label>Dataset Type</Label>
              <Select 
                value={(localNode.data as DatasetNodeData).type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger className="bg-kedro-black border-gray-700">
                  <SelectValue placeholder="Select dataset type" />
                </SelectTrigger>
                <SelectContent>
                  {datasetTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filepath</Label>
              <div className="flex gap-2">
                <Input
                  value={(localNode.data as DatasetNodeData).filepath}
                  onChange={(e) => handleChange('filepath', e.target.value)}
                  placeholder="data/01_raw/data.csv"
                  className="bg-kedro-black border-gray-700 flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-black" 
                  onClick={handleFileSelect}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Browse
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Function Name</Label>
              <Input
                value={(localNode.data as FunctionNodeData).function_name}
                onChange={(e) => handleChange('function_name', e.target.value)}
                placeholder="process_data"
                className="bg-kedro-black border-gray-700"
              />
            </div>

            <div>
              <Label>Python Code</Label>
              <Textarea
                value={(localNode.data as FunctionNodeData).code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="def process_data(data):\n    # Process the data\n    return data"
                className="bg-kedro-black border-gray-700 h-60 font-mono"
              />
            </div>
          </>
        )}

        <div>
          <Label>Description</Label>
          <Textarea
            value={localNode.data.description as string}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description of this node..."
            className="bg-kedro-black border-gray-700"
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-black"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-kedro-yellow text-kedro-black hover:bg-amber-500"
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
