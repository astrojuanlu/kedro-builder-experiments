
import { Database, Code, BarChart3 } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-16 bg-kedro-darkgrey border-r border-gray-700 flex flex-col items-center py-6">
      <div style={{transform: 'rotate(138deg)'}} className="w-8 h-8 bg-kedro-yellow mb-8"></div>
      
      <div className="flex-1 space-y-6">
        <div className="flex flex-col items-center">
          <button className="w-10 h-10 flex items-center justify-center text-kedro-yellow hover:bg-kedro-black rounded transition">
            <Database className="w-5 h-5" />
          </button>
          <span className="text-xs mt-1">Datasets</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button className="w-10 h-10 flex items-center justify-center text-kedro-white hover:bg-kedro-black rounded transition">
            <Code className="w-5 h-5" />
          </button>
          <span className="text-xs mt-1">Functions</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button className="w-10 h-10 flex items-center justify-center text-kedro-white hover:bg-kedro-black rounded transition">
            <BarChart3 className="w-5 h-5" />
          </button>
          <span className="text-xs mt-1">Preview</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
