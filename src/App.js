import React from 'react';
import VideoPlayer from './VideoPlayer';

const App = () => {
  return (
    <div>
      <VideoPlayer src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" />
    </div>
  );
};

export default App;
