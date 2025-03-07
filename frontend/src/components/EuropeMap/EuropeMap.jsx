import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import europeGeoJson from "../../data/countries.json";
import "./EuropeMap.css";

const EuropeMap = ({ onSubmit, hasSubmitted, resetMap, correctAnswer }) => {
  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [submittedCountry, setSubmittedCountry] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const mapRef = useRef(null);

  const ResetMapView = () => {
    const map = useMap();
    if (resetMap) {
      map.setView([55, 13], 3);
    }
    return null;
  };

  const onEachCountry = (country, layer) => {
    const isEurope = country.properties.CONTINENT === "Europe";
    if (isEurope) {
      layer.on({
        click: () => handleCountryClick(country),
      });
    }
  };

  const handleCountryClick = (country) => {
    setHighlightedCountry(country.properties.ADMIN);
  };

  useEffect(() => {
    if (resetMap) {
      setHighlightedCountry(null);
      setSubmittedCountry(null);
      setIsCorrect(false);
    }
  }, [resetMap]);

  useEffect(() => {
    if (hasSubmitted && highlightedCountry) {
      setSubmittedCountry(highlightedCountry);
      setIsCorrect(highlightedCountry === correctAnswer.name);
    }
  }, [hasSubmitted, highlightedCountry, correctAnswer]);

  const style = (feature) => {
    const isEurope = feature.properties.CONTINENT === "Europe";
    const isHighlighted = highlightedCountry === feature.properties.ADMIN;
    const isSubmitted = submittedCountry === feature.properties.ADMIN;
    const isCorrectAnswer = feature.properties.ADMIN === correctAnswer.name;

    let fillColor = '#00BFFF';
    let fillOpacity = 0.7;

    if (!isEurope) {
      fillColor = 'black';
      fillOpacity = 1.0;
    } else if (hasSubmitted) {
      if (isCorrectAnswer) {
        fillColor = '#32CD32';
      } else if (isSubmitted) {
        fillColor = '#FF4500';
      }
    } else if (isHighlighted) {
      fillColor = '#FF4500';
    }

    return {
      fillColor,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity,
    };
  };

  const handleSubmit = () => {
    setSubmittedCountry(highlightedCountry);
    setIsCorrect(highlightedCountry === correctAnswer.name);
    onSubmit(highlightedCountry);
  };

  return (
    <div className="europe-map-container">
      <MapContainer center={[55, 13]} zoom={3} className="leaflet-container" ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={europeGeoJson} style={style} onEachFeature={onEachCountry} />
        <ResetMapView />
      </MapContainer>
      <div className="select-country-container">
        <p>{highlightedCountry ? `You have selected ${highlightedCountry}` : "Click on a country"}</p>
        <button
          type="button"
          className={`submit-btn ${hasSubmitted ? 'dead' : ''}`}
          onClick={handleSubmit}
          disabled={hasSubmitted}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EuropeMap;
