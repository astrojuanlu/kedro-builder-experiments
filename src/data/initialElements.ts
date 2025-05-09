
import { Node, Edge } from '@xyflow/react';
import { DatasetNodeData, FunctionNodeData } from '../components/NodeConfigPanel';

export const initialNodes: Node[] = [
  {
    id: 'dataset-1',
    type: 'dataset',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Raw Data',
      type: 'pandas.CSVDataSet',
      filepath: 'data/01_raw/data.csv',
      description: 'Raw input data'
    } as DatasetNodeData
  },
  {
    id: 'function-1',
    type: 'function',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Process Data',
      function_name: 'process_data',
      inputs: ['dataset-1'],
      outputs: ['dataset-2'],
      code: 'def process_data(data):\n    # Process the data\n    return data',
      description: 'Process the raw data'
    } as FunctionNodeData
  },
  {
    id: 'dataset-2',
    type: 'dataset',
    position: { x: 250, y: 400 },
    data: { 
      label: 'Processed Data',
      type: 'pandas.ParquetDataSet',
      filepath: 'data/02_intermediate/processed_data.parquet',
      description: 'Processed data'
    } as DatasetNodeData
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'edge-1',
    source: 'dataset-1',
    target: 'function-1',
    animated: true,
  },
  {
    id: 'edge-2',
    source: 'function-1',
    target: 'dataset-2',
    animated: true,
  }
];
