import React from 'react'
import JORDAN_PARK_DATA from './data.json'
import styles from './App.module.css';
import * as Locations from './location';
import {FlyToInterpolator} from '@deck.gl/core';
import {Map} from "react-map-gl";
import DeckGL , {GeoJsonLayer} from "deck.gl"
import * as Uichanges from './uichanges';

const mapboxApiAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  const INITIAL_VIEW_STATE = {
    latitude: 31.9522,
    longitude: 35.2332,
    zoom: 6,            
    bearing: 0,
    pitch: 30
  };

export default function App() {
  const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);
  const [mapStyle, setMapStyle] = React.useState('mapbox://styles/mapbox/streets-v9'); //default styles for mapbox

  const handleChangeViewState = ({ viewState }) => setViewState(viewState);
  // Transiting from one location to another
  const handleFlyto = destination =>{
  setViewState({...viewState , ...destination , transitionDuration:2000, transitionInterpolater: new FlyToInterpolator()})
  };
  const handleStyleChange = (newStyle) => {
    setMapStyle(newStyle.url);
  };

const onClick = info =>{
  if(info.object){
    alert(info.object.properties.Name )
  }
} 

  const layers = [
    new GeoJsonLayer({
      id : "jordanparks",
      data:JORDAN_PARK_DATA,
      // styles of the points
      filled:true,
      pointRadiusMinPixels : 5 , // minimum pixel of a point 
      pointRadiusMaxPixels: 15,   // maximum pixel of a point 
      pointRadiusScale : 2000,
      getPointRadius : f => 5,
      getFillColor: (data) => {
        // Check if "marker-color" property is present
        if (data.properties["marker-color"]) {
          return data.properties["marker-color"];
        } else if (data.properties.Name.includes("Jordan Park")) {
          return [0, 0, 0, 250]; // Black color
        } else if (data.properties.Name.includes("Monument")) {
          return [204, 0, 0]; // Red representing Monuments
        } else if (data.properties.Name.includes("Historic Site")) {
          return [102, 0, 204]; // Purple representing Historic Sites
        } else {
          return [86, 144, 58, 250]; // Green Default color for other things
        }
      } ,
       autoHighlight:true, //for Hover colors 
       pickable:true, // needed for onclick function
       onClick,
       
    }),
  
  ]

  return (
    <div>
    <DeckGL
    width="100vw"
    height="100vh"
    controller = {true}
    layers={layers}
    viewState={viewState}
    onViewStateChange={handleChangeViewState}
    >
    <Map mapStyle={mapStyle} mapboxAccessToken = {mapboxApiAccessToken} />
    </DeckGL>
    <div className={styles.controls}>
        {Object.keys(Locations).map(key => (
          <button key={key} onClick={()=>handleFlyto(Locations[key])} >
            {key}
          </button> 
          
        ))}
      </div>

      <div className={styles.controls_styles}>
        <h2> Theme Changer</h2>
        {Object.keys(Uichanges).map(key => (
          <button key={key} onClick={()=>handleStyleChange(Uichanges[key])} >
            {key}
          </button> 
          
        ))}
      </div>

    </div>
  )
}
