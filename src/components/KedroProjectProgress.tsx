import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Circle } from 'lucide-react';

interface StepStatus {
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  message?: string;
}

interface KedroProjectProgressProps {
  isGenerating: boolean;
  projectName: string;
  onClose: () => void;
}

const KedroProjectProgress = ({ isGenerating, projectName, onClose }: KedroProjectProgressProps) => {
  const [steps, setSteps] = useState<StepStatus[]>([
    { name: 'Create virtual environment', status: 'pending' },
    { name: 'Install Kedro', status: 'pending' },
    { name: 'Generate project structure', status: 'pending' },
    { name: 'Create pipeline files', status: 'pending' }
  ]);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);

  // Simulate the progress of project generation
  useEffect(() => {
    if (!isGenerating) return;
    
    let stepTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    const runStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setCompleted(true);
        return;
      }
      
      setCurrentStep(stepIndex);
      
      // Update the current step status
      setSteps(prevSteps => 
        prevSteps.map((step, i) => 
          i === stepIndex 
            ? { ...step, status: 'in-progress' } 
            : step
        )
      );
      
      // Progress bar animation
      let stepProgress = 0;
      const stepDuration = [3000, 5000, 4000, 3000][stepIndex] || 3000;
      const intervalStep = 100 / (stepDuration / 100);
      
      progressInterval = setInterval(() => {
        stepProgress += intervalStep;
        const overallProgress = (stepIndex * 25) + (stepProgress * 0.25);
        setProgress(Math.min(overallProgress, 99));
        
        if (stepProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
      
      // Complete the step after duration
      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        
        setSteps(prevSteps => 
          prevSteps.map((step, i) => 
            i === stepIndex 
              ? { ...step, status: 'completed' } 
              : step
          )
        );
        
        // Move to next step
        runStep(stepIndex + 1);
      }, stepDuration);
    };
    
    // Start the first step
    runStep(0);
    
    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, [isGenerating, steps.length]);
  
  // When all steps are completed, set progress to 100%
  useEffect(() => {
    if (completed) {
      setProgress(100);
    }
  }, [completed]);
  
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in-progress':
        return <Circle className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <Card className="w-[450px] bg-kedro-darkgrey border-gray-700 text-kedro-white">
      <CardHeader>
        <CardTitle className="text-lg text-kedro-white">Creating Kedro Project</CardTitle>
        <CardDescription className="text-gray-300">
          Creating "{projectName}" project with Python virtual environment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-kedro-white mb-1">
            <span>Progress: {Math.round(progress)}%</span>
            {progress < 100 ? 
              <span className="text-kedro-yellow">Creating project...</span> : 
              <span className="text-green-500">Complete!</span>
            }
          </div>
          <Progress 
            value={progress} 
            className="h-4 bg-gray-700" 
            indicatorClassName="bg-kedro-yellow" 
          />
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {getStepIcon(step.status)}
              <div className="flex-1">
                <p className={`text-sm text-kedro-white ${currentStep === index ? 'font-medium' : ''}`}>
                  {step.name}
                </p>
                {step.message && (
                  <p className="text-xs text-gray-300">{step.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {completed && (
          <div className="w-full text-center">
            <p className="text-sm text-green-500 font-medium mb-2">
              Project created successfully!
            </p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-kedro-yellow text-kedro-black rounded-md text-sm font-medium hover:bg-amber-500"
            >
              Close
            </button>
          </div>
        )}
        
        {failed && (
          <div className="w-full text-center">
            <p className="text-sm text-red-500 font-medium mb-2">
              Project creation failed. Please check console for details.
            </p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-kedro-yellow text-kedro-black rounded-md text-sm font-medium hover:bg-amber-500"
            >
              Close
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default KedroProjectProgress; 