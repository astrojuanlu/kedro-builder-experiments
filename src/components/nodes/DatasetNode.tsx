
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';
import { DatasetNodeData } from '../NodeConfigPanel';

interface DatasetNodeProps {
  data: DatasetNodeData;
}

const DatasetNode = ({ data }: DatasetNodeProps) => {
  return (
    <div className="kedro-dataset-node group bg-kedro-black border-2 border-kedro-yellow rounded-lg py-4 px-5 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center">
        <Database className="kedro-node-icon text-kedro-yellow mr-3" size={24} />
        <div className="kedro-node-label">
          <div className="text-kedro-white font-semibold">{data.label}</div>
          {data.type && (
            <div className="text-xs text-gray-400 mt-1">
              {data.type}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default DatasetNode;
