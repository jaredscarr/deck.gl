import React from 'react';
import {createRoot} from 'react-dom/client';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';


const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 10,
  bearing: 0,
  pitch: 30
};

const COPYRIGHT_LICENSE_STYLE = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: 'hsla(0,0%,100%,.5)',
  padding: '0 5px',
  font: '12px/20px Helvetica Neue,Arial,Helvetica,sans-serif'
};

const LINK_STYLE = {
  textDecoration: 'none',
  color: 'rgba(0,0,0,.75)',
  cursor: 'grab'
};

function Root() {
  /*
  * The useState hook defines an initial state and function to call to set the state.
  * This is used as the callback function to send to onTilesLoading and onViewportLoad.
  * The flow is once the code starts the initial state "loading" is false and when onTilesLoading
  * runs it calls the setLoading function with the false argument which triggers the loading screen
  * (obviously would be replaced by some fancy spinner or something).
  * when the tiles are complete the same setLoading function is passed as a callback to onViewportLoad
  * so it would set loading to false and show the map.
  *
  * see the console.log fires in the console which I left in. Also try zooming in and out to try
  * and get the loading screen as new tiles are loaded.
  * */
  let [loading, setLoading] = React.useState(false);
  // tile layer example pulled from website/map-tile example and modified
  const tileLayer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    onTilesLoading: () => setLoading(true),
    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 20,
    pickable: true,
    onViewportLoad: () => setLoading(false),
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: props => {
      const {
        bbox: {west, south, east, north}
      } = props.tile;

      return [
        new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        })
      ];
    }
  });

  const overlayStyles = {
    height: '100%',
    width: '100%',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    overflowX: 'hidden',
    background: 'white',
  }

  const overlayContentStyles = {
    position: 'relative',
    top: '25%',
    width: '100%',
    textAlign: 'center',
    marginTop: '30px'
  }

  return (
    <DeckGL
      layers={[tileLayer]}
      views={new MapView({repeat: true})}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      {loading &&
      <div style={overlayStyles}>
        <h1 style={overlayContentStyles}>LOADING</h1>
      </div>
      }
      <div style={COPYRIGHT_LICENSE_STYLE}>
        {'© '}
        <a style={LINK_STYLE} href="http://www.openstreetmap.org/copyright" target="blank">
          OpenStreetMap contributors
        </a>
      </div>
    </DeckGL>
  );
}

/* global document */
const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);
