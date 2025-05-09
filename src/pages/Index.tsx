
import { useState } from 'react';
import LandingPage from '../components/LandingPage';
import ProjectSetupModal from '../components/ProjectSetupModal';
import PipelineBuilder from '../components/PipelineBuilder';

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showProjectSetup, setShowProjectSetup] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    directory: '/tmp/kedro-projects'
  });

  const handleStartBuilding = () => {
    setShowLanding(false);
    setShowProjectSetup(true);
  };

  const handleCreateProject = (details: { name: string; directory: string }) => {
    setProjectDetails(details);
    setShowProjectSetup(false);
  };

  const handleCancel = () => {
    setShowProjectSetup(false);
    setShowLanding(true);
  };

  if (showLanding) {
    return <LandingPage onStartBuilding={handleStartBuilding} />;
  }

  if (showProjectSetup) {
    return <ProjectSetupModal onCreateProject={handleCreateProject} onCancel={handleCancel} />;
  }

  return <PipelineBuilder projectDetails={projectDetails} />;
};

export default Index;
