/* global global */
import React from 'react';
import { render } from '@testing-library/react';
import App, { findLocation } from './App';

test('renders map', () => {
  let getByText;
  try {
    getByText = render(<App />).getByText;
  } catch (err) {
    if (!err.message.match(/Create your own headless context/)) {
      throw new Error(err);
    }
  }
  const deckContainer = getByText(/Viewport Finder/);
  expect(deckContainer).toBeInTheDocument();
});

const OSM_FIXTURE = [{ "place_id": 235268458, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "relation", "osm_id": 182954, "boundingbox": ["39.70185", "39.920823", "-84.311377", "-84.092938"], "lat": "39.7589478", "lon": "-84.1916069", "display_name": "Dayton, Montgomery County, Ohio, United States of America", "class": "boundary", "type": "administrative", "importance": 0.7840290398910663, "icon": "https://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png" }, { "place_id": 25824437, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "node", "osm_id": 2534160841, "boundingbox": ["38.7665973", "40.7665973", "-85.1850615", "-83.1850615"], "lat": "39.7665973", "lon": "-84.1850615", "display_name": "Dayton, Montgomery County, Ohio, 45423, United States of America", "class": "place", "type": "region", "importance": 0.4582184742933953 }, { "place_id": 72452261, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright", "osm_type": "node", "osm_id": 6382216666, "boundingbox": ["39.8586528", "39.8587528", "-84.277075", "-84.276975"], "lat": "39.8587028", "lon": "-84.277025", "display_name": "Tesla Supercharger, Main Street, Morgan Place, Englewood, Montgomery County, Ohio, 45415, United States of America", "class": "amenity", "type": "charging_station", "importance": 0.101 }];
const testUrl = 'http://localhost.app.nevercalled';

test('fetchLocation fetches location', done => {
  const mockSuccessResponse = OSM_FIXTURE;
  const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // 4
  const callbackFn = (successfulResult) => {
    const { latitude, longitude } = successfulResult;
    console.log(latitude)
    expect(latitude).toEqual(OSM_FIXTURE[0].lat);
    expect(longitude).toEqual(OSM_FIXTURE[0].lon);
    fetchSpy.restore();
    done();
  }
  findLocation(testUrl, callbackFn);
})


test('fetchLocation fails gracefully', done => {
  const mockSuccessResponse = [];
  const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // 4
  const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation();
  expect(console.error).toBeCalled();

  const cb = (failedResult) => {
    expect(failedResult).toEqual({});
    fetchSpy.restore();
    done();
  }
  findLocation(testUrl, cb);

  consoleSpy.restore();
})
