import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { STORIES } from '../constants';
import StoryLayout from '../components/StoryLayout';

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const story = STORIES.find(s => s.id === id);

  // Scroll to top when story changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!story) {
    return <Navigate to="/" replace />;
  }

  return <StoryLayout data={story} />;
};

export default StoryPage;