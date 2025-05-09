import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FolderOpen } from 'lucide-react';

interface ProjectSetupModalProps {
  onCreateProject: (details: { name: string; directory: string }) => void;
  onCancel: () => void;
}

const ProjectSetupModal = ({ onCreateProject, onCancel }: ProjectSetupModalProps) => {
  const [projectName, setProjectName] = useState('');
  const [directory, setDirectory] = useState('/tmp/kedro-projects');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Project name is required",
        description: "Please enter a name for your Kedro project.",
        variant: "destructive"
      });
      return;
    }

    if (!directory.trim()) {
      toast({
        title: "Directory is required",
        description: "Please specify a save directory for your Kedro project.",
        variant: "destructive"
      });
      return;
    }

    onCreateProject({
      name: projectName,
      directory
    });

    toast({
      title: "Project created",
      description: `Project "${projectName}" has been set up successfully.`
    });
  };

  const handleDirectorySelect = () => {
    // Generate a predefined directory with a timestamp to ensure uniqueness
    const newDir = `/projects/kedro-project-${new Date().getTime().toString().slice(-6)}`;
    setDirectory(newDir);
    
    toast({
      title: "Directory Selected",
      description: `Directory set to: ${newDir}`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-kedro-black">
      <Card className="w-full max-w-md bg-kedro-darkgrey border-none shadow-xl">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCancel} 
              className="text-black hover:text-kedro-yellow"
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </Button>
            <h2 className="text-2xl font-bold text-kedro-white">Project Configuration</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-kedro-white">Kedro Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-kedro-project"
                className="bg-kedro-black border-kedro-darkgrey text-kedro-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400">
                Use lowercase letters, numbers, and hyphens. No spaces.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="save-directory" className="text-kedro-white">Save Directory</Label>
              <div className="flex gap-2">
                <Input
                  id="save-directory"
                  value={directory}
                  onChange={(e) => setDirectory(e.target.value)}
                  placeholder="/path/to/directory"
                  className="bg-kedro-black border-kedro-darkgrey text-kedro-white placeholder:text-gray-500 flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleDirectorySelect}
                  className="hover:text-black"
                >
                  <FolderOpen className="h-4 w-4 mr-2 text-black" />
                  Browse
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                The location where the Kedro project will be generated.
              </p>
            </div>
            
            <div className="pt-4 flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1 border-kedro-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-kedro-yellow text-kedro-black hover:bg-amber-500"
              >
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ProjectSetupModal;
