
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Network, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
}

const LandingPage = ({ onStartBuilding }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-kedro-black">
      <div className="w-full max-w-5xl text-center space-y-8">
        <div className="space-y-4">
          <div style={{transform: 'rotate(138deg)'}} className="mx-auto bg-kedro-yellow w-16 h-16 flex items-center justify-center">
            <div className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-kedro-white">Kedro Builder</h1>
          <p className="text-lg text-kedro-white max-w-2xl mx-auto">
            Create, visualize and export Kedro projects with an intuitive drag-and-drop
            interface. Design your data pipelines visually and generate all the
            necessary code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-kedro-darkgrey border-none text-center">
            <div className="flex justify-center mb-4">
              <Database className="h-10 w-10 text-kedro-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-kedro-white">Dataset Catalog</h3>
            <p className="text-sm text-gray-300">
              Define your datasets visually and generate catalog YAML configurations automatically.
            </p>
          </Card>

          <Card className="p-6 bg-kedro-darkgrey border-none text-center">
            <div className="flex justify-center mb-4">
              <Network className="h-10 w-10 text-kedro-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-kedro-white">Pipeline Builder</h3>
            <p className="text-sm text-gray-300">
              Create nodes and pipelines with a visual interface. Connect inputs and outputs with ease.
            </p>
          </Card>

          <Card className="p-6 bg-kedro-darkgrey border-none text-center">
            <div className="flex justify-center mb-4">
              <BarChart3 className="h-10 w-10 text-kedro-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-kedro-white">Interactive Visualization</h3>
            <p className="text-sm text-gray-300">
              See your pipeline structure visualized in real-time and export the complete project.
            </p>
          </Card>
        </div>

        <Button 
          onClick={onStartBuilding} 
          className="bg-kedro-yellow text-kedro-black hover:bg-amber-500 font-medium px-8 py-6 text-lg"
        >
          Start Building
        </Button>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-8 text-kedro-white">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-kedro-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-kedro-black font-bold">01</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-kedro-white">Project Setup</h3>
              <p className="text-sm text-gray-300">
                Define your Kedro project name and configuration options.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-kedro-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-kedro-black font-bold">02</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-kedro-white">Dataset Catalog</h3>
              <p className="text-sm text-gray-300">
                Add datasets to your project and configure their properties.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-kedro-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-kedro-black font-bold">03</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-kedro-white">Pipeline Builder</h3>
              <p className="text-sm text-gray-300">
                Create nodes that transform your data and connect them into pipelines.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-kedro-yellow rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-kedro-black font-bold">04</span>
              </div>
              <h3 className="text-lg font-medium mb-2 text-kedro-white">Visualization & Export</h3>
              <p className="text-sm text-gray-300">
                Visualize your project and export the code ready to run.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
