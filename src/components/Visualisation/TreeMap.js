import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import {guid} from '../../utils';

class TreeMap extends React.Component {
  legends = {
    labels: [">5 Years","3-5 Years","1-2 Years","Less than 1 year", "unknown"],
    keys: [">5 Years Experience", "3 to 5 Years Experience", "1 to 2 Years Experience", "Less than 1 year of experience", "unknown"],
    colors: ["#AEC7E8","#FF7F0E","#FFBB78","#2CA02C","#C7C7C7"],
  }

  tooltip (leaf){
    const tooltip = this.plot.append("g")
      .attr("class","tooltip")

    tooltip.append("text")
      .attr("fill","black")
      .style("font-size",".75em")
      .html(leaf.parent.data.skill)
      .attr("x",(leaf.x1 - leaf.x0) / 2 + leaf.x0)
      .attr("y",(leaf.y1 - leaf.y0) / 2 + leaf.y0)
  }

  zoom(e){
    if (!this.zoomed){
      this.x.domain([e.x0, e.x1]);
      this.y.domain([e.y0, e.y1]);
      this.zoomed = true;
    } else {
      this.x.domain([0, this.width]);
      this.y.domain([0, this.height]);
      this.zoomed = false;
    }

    const t = this.plot.selectAll("g.cell").transition()
      .attr("transform", (d) => {
        return "translate(" + this.x(d.x0) + "," + this.y(d.y0) + ")"
      })

    t.select("rect")
      .attr("width", (d) => {
        return (this.x(d.x1) - this.x(d.x0))
      })
      .attr("height", (d) => {
        return (this.y(d.y1) - this.y(d.y0))
      })
  }

  init(props) {
    const {filter, value, hired} = props;

    const filteredChildren = _.map(props.data.children, (parentTree) => {
      return {
        ...parentTree,
        children: _.filter(parentTree.children, (c) => {
          if (filter === "jobs"){
            return c.ats_job_refID === value
          } else {
            return c.departments === value
          }
        })
      }
    });

    const finalChildren = _.map(filteredChildren, treeChild => {
      const uniqText = _.uniqBy(treeChild.children, 'skill')
      const newChildren = _.map(uniqText, (a) => {
        let isHired = 0;

        const data = {
          skill: a.skill,
          freq: _.reduce(treeChild.children, (tmp, child) => {
            if (child.skill === a.skill) {
              if (child.hired == 1) {
                isHired = 1;
              }
              tmp = tmp + child.freq;
            }

            return tmp;
          }, 0)
        }

        return Object.assign({}, data, {hired: isHired});
      });

      return {
        ...treeChild,
        children: newChildren
      }
    });

    this.draw(props, {
      ...props.data,
      children: finalChildren
    });

    this.drawLegends(props);
  }

  draw(props, data) {
    this.root = d3.hierarchy(data);

    this.root
      .sum(function(d){return d.freq})
      .sort(function(a,b){return b.data.freq-a.data.freq;})
//
    this.treemap(this.root);

    this.leaf = this.plot.selectAll(".cell").data(this.root.leaves(), (d) => guid())

    this.leaf.exit().remove();

    // this.leaf
    //   .select('text')
    //   .text(function(d){return d.data.skill})
    //   .style("font-size","10px")
    //   .style("fill","white")
    //   .attr("transform", function(d){return "translate(5,10)"})
    //
    const group = this.leaf
      .enter()
      .append("g")
      .attr("class","cell")
      .attr("transform", (d) => { return "translate(" + this.x(d.x0) + "," + this.y(d.y0) + ")"; })
      .on("click", (d) => {this.zoom(d.parent)});

    group.append("rect")
      .attr("id", (d) => {return d.data.skill+d.parent.data.skill;})
      .attr("width", (d) => {return d.x1-d.x0;})
      .attr("height", (d) => {return d.y1-d.y0;})
      // .attr("fill", (d) => this.color(d.parent.data.skill))
      .attr("fill", (d) => {
        return parseInt(props.hired) === 1 && parseInt(d.data.hired) === 1 ? 'red' : this.color(d.parent.data.skill);
      })
      .on("mouseover", (d) => this.tooltip(d))
      .on("mouseout", (d) => d3.selectAll(".tooltip").remove())


    group.append("text")
      .text(function(d){return d.data.skill})
      .style("font-size","10px")
      .style("fill","white")
      .attr("transform", function(d){return "translate(5,10)"})
  }

  drawLegends(props) {
    const data = _.zip(this.legends.labels, this.legends.colors, this.legends.keys);

    if (props.hired == 1) {
      data.push(['Hired', 'red'])
    }

    const legends = this.legendSVG.selectAll('.legend').data(data, d => guid());

    legends.exit().remove();

    const group = legends
      .enter()
      .append('g')
      .attr('class', 'legend legend-action noselect')
      .on('click', (d) => {
        const child = _.find(this.root.children, (child) => child.data.skill === d[2]);
        this.zoom(child);
      })

    group
      .append('rect')
      .attr('fill', d => d[1])
      .attr('x', (d, i) => i * this.width / data.length)
      .attr('width', this.width / data.length)
      .attr('height', 30);

    legends
      .select('rect')
      .attr('fill', d => d[1])
      .attr('x', (d, i) => i * this.width / data.length)
      .attr('width', this.width / data.length)
      .attr('height', 30)

    legends
      .select('text')
      .attr('y', 20)
      .attr('x', (d, i) => (i * (this.width / data.length) + (this.width / data.length) / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('width', this.width / data.length)
      .text(d => d[0])

    group
      .append('text')
      .attr('y', 20)
      .attr('x', (d, i) => (i * (this.width / data.length) + (this.width / data.length) / 2))
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('width', this.width / data.length)
      .text(d => d[0])
  }

  componentDidMount() {
    this.bounds = this.svgContainer.getBoundingClientRect();
    this.width = this.bounds.width;
    this.height = Math.min(700, this.bounds.width - 30);
    this.fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); }
    this.color = d3.scaleOrdinal()
      .domain([">5 Years Experience","3 to 5 Years Experience","1 to 2 Years Experience","Less than 1 year of experience","unknown"])
      .range(["#AEC7E8","#FF7F0E","#FFBB78","#2CA02C","#C7C7C7"])
    this.format = d3.format(",d");
    this.zoomed = false;

    this.treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([this.width, this.height])
      .round(true)
      .paddingInner(1);

    this.x = d3.scaleLinear().domain([0, this.width]).range([0, this.width]);
    this.y = d3.scaleLinear().domain([0, this.height]).range([0, this.height]);

    this.legendSVG = d3.select(this.svgContainer)
      .append('svg')
      .attr('width', this.width)
      .attr('height', 30)

    this.plot = d3.select(this.svgContainer)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)

    this.init(this.props)
  }

  shouldComponentUpdate(props) {
    this.init(props);
    return true;
  }

  render() {
    return <div className="svg-container" style={{textAlign: 'center'}}ref={(ref) => this.svgContainer = ref}></div>
  }
}

export default TreeMap;
