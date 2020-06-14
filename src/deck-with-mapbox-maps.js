import React, {Component} from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';

export default class DeckWithMapboxMaps extends Component {
  render() {

    return (
      <DeckGL id="json-deck" {...this.props}>
        <StaticMap
          reuseMap
          mapboxApiAccessToken={this.props.mapboxApiAccessToken}
        />
      </DeckGL>
    );
  }
}

