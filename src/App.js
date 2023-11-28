import React, { useState, useEffect } from 'react';
import ProjectionView from './components/ProjectionView';
import AxisView from './components/AxisView';
import LegendView from './components/LegendView';
import './App.css'; 
import data from './data/raw.json'; 

function App() {

  const name = "Yeongin Kim";
  const studentNum = "2023-23910";

  const numAttributes = 9;
  const angleStep = (2 * Math.PI) / numAttributes;

  const initialAxes = Array.from({ length: numAttributes }, (_, index) => ({
    x: Math.cos(index * angleStep), 
    y: Math.sin(index * angleStep) 
  }));
  const [axes, setAxes] = useState(initialAxes); 
  const [enableCheckViz, setEnableCheckViz] = useState(false);


  const width = 500;
  const height = 500;
  const margin = 35;
  
  return (
    <div className="App">
      <div style={{display: "flex"}}>
        <h1 style={{marginRight: 10}}>
        {"Assignment #3 /"}
        </h1>
        <h2 style={{marginTop: 25}}>
          {name + " (" + studentNum + ")"}
        </h2>
      </div>
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
