import React, { useState, useEffect } from 'react';
import ProjectionView from './components/ProjectionView';
import AxisView from './components/AxisView';
import LegendView from './components/LegendView';
import './App.css'; // Assuming you have a CSS file for styling
import data from './data/raw.json'; // Assuming attributes are loaded from a local JSON file

function App() {
  const numAttributes = 9;
  // Calculate the angle between axes in radians
  const angleStep = (2 * Math.PI) / numAttributes;

  // Create an array of axis objects, each with an angle and a name
  const initialAxes = Array.from({ length: numAttributes }, (_, index) => ({
    x: Math.cos(index * angleStep), 
    y: Math.sin(index * angleStep) 
  }));
  // console.log(initialAxes);
  const [axes, setAxes] = useState(initialAxes); // Initialize your axes state here
  const [enableCheckViz, setEnableCheckViz] = useState(false);

  // You would populate the data and axes states with actual data, likely from an API or a file

  // Fetch your data and axes information here with useEffect and update the state
  const width = 500;
  const height = 500;
  const margin = 35;
  
  return (
    <div className="App">
      <div className="App-header">
        {/* Header content here */}
      </div>
      <div className="App-content">
        {/* The main content of the app, where you layout your views */}
        <div className="Projection-container">
          <ProjectionView 
            data={data} 
            axes={axes}
            width={width}
            height={height}
            margin={margin} 
            enableCheckViz={enableCheckViz}
            setEnableCheckViz={setEnableCheckViz}
          />
        </div>
        <div className="Axis-container">
          <AxisView 
            axes={axes} 
            setAxes={setAxes} 
            enableCheckViz={enableCheckViz}
            setEnableCheckViz={setEnableCheckViz}
          />
        </div>
        <div className="Legend-container">
          <LegendView />
        </div>
      </div>
    </div>
  );
}

export default App;
