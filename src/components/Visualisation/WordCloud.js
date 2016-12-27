import React from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import _ from 'lodash';

import {guid} from '../../utils';

class WordCloud extends React.Component {
  componentDidMount() {
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    const bounds = this.svgContainer.getBoundingClientRect();
    this.width = bounds.width;
    this.height = Math.min(700, bounds.width - 30);
    this.margin = {"t":10,"r":5,"b":10,"l":5};
    this.plotwidth = this.width - this.margin.l - this.margin.r;
    this.plotheight = this.height - this.margin.t - this.margin.b;

    this.plotarea = d3.select(".svg-container").append("svg");

    this.group = this.plotarea.append("g")
      .attr("width",this.width-this.margin.r-this.margin.l)
      .attr("height",this.height-this.margin.t-this.margin.b)
      .attr("transform", "translate(" + [this.width >> 1, this.height >> 1] + ")rotate(270)")

    this.go(this.props);
  }

  init(data) {
    this.wordSize = d3.scaleLinear()
      .domain([0,d3.max(data, function(d){return d.freq})])
      .range([10,50])

    cloud().size([this.plotheight, this.plotwidth])
      .words(data)
      .fontSize((d) => this.wordSize(d.freq))
      .text(function(d){return d.text})
      .rotate(function(d) { return ~~(Math.random() * 2) * 90; })
      .padding(2)
      .on("end", this.draw.bind(this))
      .start();
    cloud().stop();
  }

  draw(words) {
    this.plotarea
      .style("border","1px solid gray")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "wordcloud")

    const texts = this.group.selectAll("text").data(words, d => guid())
    const hired = parseInt(this.props.hired) === 1 ? 'hired' : '';

    texts
      .attr("text-anchor", "middle")
      .style("font-size", (d) => this.wordSize(d.freq) + "px")
      .style("fill", (d, i) => { if(hired == "hired" && d.hired==1){return "red"}else if(hired == "hired" && d.hired==0){return "gray"} else {return this.color(i);}  })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });

    texts
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .style("font-size", (d) => this.wordSize(d.freq) + "px")
      .style("fill", (d, i) => { if(hired == "hired" && d.hired==1){return "red"}else if(hired == "hired" && d.hired==0){return "gray"} else {return this.color(i);}  })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; })

    texts.exit().remove();
  }

  go(props) {
    const list = props.data.filter(function(e){
      if (props.filter === "jobs"){
        return e.ats_job_refID === props.value
      } else {
        return e.departments === props.value
      }
    })

    const uniqText = _.uniqBy(list,'text');

    let newList = [];

    for (let i=0;i<uniqText.length;i++){
      let cloudObj = {}
      cloudObj.text = uniqText[i].text;
      cloudObj.freq = 0;
      cloudObj.hired = 0;
      var freq = 0;

      list.forEach(function(e){
        if (e.text === uniqText[i].text){
          if(e.hired == 1){cloudObj.hired = 1}
          cloudObj.freq  = cloudObj.freq + e.freq
        }
      })

      newList.push(cloudObj)
    }

    this.init(newList);
  }

  componentDidUpdate() {
    this.go(this.props);
  }

  render() {
    return <div className="svg-container" style={{textAlign: 'center'}}ref={(ref) => this.svgContainer = ref}></div>
  }
}

export default WordCloud;
