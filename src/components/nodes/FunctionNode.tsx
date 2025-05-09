
import { Handle, Position } from '@xyflow/react';
import { Code } from 'lucide-react';
import { FunctionNodeData } from '../NodeConfigPanel';

interface FunctionNodeProps {
  data: FunctionNodeData;
}

const FunctionNode = ({ data }: FunctionNodeProps) => {
  return (
    <div className="kedro-function-node bg-kedro-black border-2 border-kedro-white rounded-md py-4 px-5 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center">
        <Code className="kedro-node-icon text-kedro-white mr-3" size={24} />
        <div className="kedro-node-label">
          <div className="text-kedro-white font-semibold">{data.label}</div>
          {data.function_name && (
            <div className="text-xs text-gray-400 mt-1">
              {data.function_name}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default FunctionNode;
