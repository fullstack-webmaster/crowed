import React from 'react';
import L from 'leaflet';
import * as _ from 'lodash';

class LeafletMap extends React.Component {
  setStyle(feature) {
    return {
      weight: 1,
      color: "white",
      fillColor: this.getColor(feature.properties.freq),
      fillOpacity: 1
    }
  }

  getColor(d){
    return  d > 15 ? '#00007f':
              d > 4 ? '#0000cc':
                d > 2 ? '#0000ff':
                  d > 1 ?  '#4c4cff':
                    '#7f7fff';
  }

  renderMap(props) {
    const data = props.filter === 'departments'
      ? _.filter(props.data, (d) => d.properties.department === props.value)
      : _.filter(props.data, (d) => d.properties.job === props.value)

    if (this.choropleth){
      this.mymap.removeLayer(this.choropleth)
    } else {
      console.error("no layers yet")
    }

    this.choropleth = L.geoJson(data, {style: this.setStyle.bind(this)}).addTo(this.mymap)
  }

  componentWillReceiveProps(props) {
    this.renderMap(props);
  }

  componentDidMount() {
    var nolabelsAPI = 'https://api.mapbox.com/styles/v1/hpnair1014/cj4g6ueqt0wfw2sn5ehg1hexx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHBuYWlyMTAxNCIsImEiOiJjajExNnJiMHowMDB3MndyejF6MHU2OXk0In0.Pg9nQhbA8xnvvEt6IMPpkg'
    var token = "pk.eyJ1IjoiaHBuYWlyMTAxNCIsImEiOiJjajExNnJiMHowMDB3MndyejF6MHU2OXk0In0.Pg9nQhbA8xnvvEt6IMPpkg"

    this.mymap = L.map('map').setView([40.730610, -73.935242], 8)
    this.mymap.createPane('labels');
    this.mymap.getPane('labels').style.zIndex = 650;
    this.mymap.getPane('labels').style.pointerEvents = 'none';

    const nolabels = L.tileLayer(`https://api.mapbox.com/styles/v1/hpnair1014/cj4g7shml0ylh2rs3y2f42pja/tiles/256/{z}/{x}/{y}?access_token=${token}`,{
      maxZoom:18
    })
      .addTo(this.mymap);


    const labels = L.tileLayer(`https://api.mapbox.com/styles/v1/hpnair1014/cj4g8kgso40jj2sql10ytcnc4/tiles/256/{z}/{x}/{y}?access_token=${token}`, {
      maxZoom: 18,
      pane:'labels'
    }).addTo(this.mymap);

    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend'),
        grades = [">15","5-15","3-4","1-2","<1"],
        colors = ["#00007f","#0000cc","#0000ff","#4c4cff","#7f7fff" ];

      div.innerHTML += '<div style="text-align: center; margin-bottom: 10px; font-size: 14px">Number of Candidates</div>';

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<span style="width: 150px; display: inline-block; text-align: center; color: white; background-color:' + colors[i] + '">'+grades[i]+'</span>' + '<br>';
      }
      return div;
    };

    legend.addTo(this.mymap);

    this.renderMap(this.props);
  }

  render() {
    return (
      <div id="map" style={{height: '700px'}}></div>
    )
  }
}

export default LeafletMap;