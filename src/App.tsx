/* global process */
import React from "react";

import DeckWithMapboxMaps from "./deck-with-mapbox-maps";
import "./App.css";

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

function bboxToZoom(bbox: any): Number {
  let zoomLevel;
  const [latMin, latMax, lngMin, lngMax] = bbox;
  const latDiff = latMax - latMin;
  const lngDiff = lngMax - lngMin;
  const maxDiff = lngDiff > latDiff ? lngDiff : latDiff;
  if (maxDiff < 360 / Math.pow(2, 20)) {
    zoomLevel = 21;
  } else {
    zoomLevel =
      -1 *
      (Math.log(maxDiff) / Math.log(2) -
        Math.log(360) / Math.log(2));
    if (zoomLevel < 1) {
      zoomLevel = 1;
    }
  }
  return zoomLevel;
}

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_TOKEN;
const ENTER_KEY = 13;

export function findLocation(
  searchText: String,
  resultCallback: Function
): void {
  const searchUrl = `https://nominatim.openstreetmap.org/search/${searchText}?format=json`;
  fetch(searchUrl)
    .then(res => {
      return res.json();
    })
    .then(res => {
      const { lat, lon, boundingbox } = res[0];
      const zoom = bboxToZoom(boundingbox);
      debugger;
      resultCallback({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        zoom
      });
    })
    .catch(err => {
      resultCallback({});
      console.error(err);
    });
}

interface ViewState {
  latitude?: Number;
  longitude?: Number;
  zoom?: Number;
  pitch?: Number;
  bearing?: Number;
  transitionDuration?: Number;
  transitionInterpolator?: any;
}

interface AppState {
  searches: any[]; //replace any with suitable type
  viewState: ViewState;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      viewState: {},
      searches: []
    };
  }

  componentDidMount() {
    this.setState({ viewState: initialViewState });
  }

  handleKeyDown = (e: any) => {
    if (e.keyCode === ENTER_KEY) {
      const text = e.target.value as String;
      if (!text) {
        return;
      }
      findLocation(text, (json: any) => {
        const viewState = {
          ...this.state.viewState,
          latitude: json.latitude || 0,
          longitude: json.longitude || 0,
          zoom: json.zoom || 10
        };
        const search = { searchText: text, viewState };
        this.setState({
          searches: this.state.searches.concat(
            search
          ),
          viewState: viewState
        });
      });
    }
  };

  _updateViewState = (viewStateChangeObject: any) => {
    const { viewState = null } = viewStateChangeObject;
    const { latitude, longitude, bearing, pitch, zoom } = viewState;
    this.setState({
      viewState: { latitude, longitude, bearing, pitch, zoom }
    });
    return viewState;
  };

  render(): JSX.Element {
    const { viewState } = this.state;
    return (
      <div id="app">
        <div id="sidebar-div">
          <h1 id="header">
            Viewport Finder
          </h1>

          <div>
            <p id="help">
              Viewport for use
              within mapping
              applications
            </p>
            <div id="text-box">
              <p>
                {JSON.stringify( viewState, null, "    ")}
              </p>
            </div>
          </div>

          <div>
            {this.state.searches.map(
              row => {
                return (
                  <div
                    className="searchlist"
                    onClick={e =>
                      this._updateViewState(
                        {
                          viewState:
                            row.viewState
                        }
                      )
                    }
                  >
                    {
                      row.searchText
                    }
                  </div>
                );
              }
            )}
          </div>

          <div id="zoom-box">
            <label>
              Zoom to region (OSM Nominatim)<br />
              <input
                type="text"
                defaultValue={
                  ""
                }
                onKeyDown={
                  this
                    .handleKeyDown
                }
              ></input>
            </label>
          </div>
        </div>
        <div id="deck-container">
          <DeckWithMapboxMaps
            id="json-deck"
            controller={true}
            initialViewState={
              this.state.viewState
            }
            viewState={this.state.viewState}
            onViewStateChange={
              this._updateViewState
            }
            mapboxApiAccessToken={
              MAPBOX_ACCESS_TOKEN
            }
          />
        </div>
      </div>
    );
  }
}
