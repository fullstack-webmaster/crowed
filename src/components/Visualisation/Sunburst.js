import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import {guid} from '../../utils';

class Sunburst extends React.Component {
  legends = {
    labels: [">5 Years","3-5 Years","1-2 Years","Less than 1 year","unknown"],
    colors: ["#AEC7E8","#FF7F0E","#FFBB78","#2CA02C","#C7C7C7"]
  }

  click(d){
    const visText= []
    for(let i=0;i<d.length;i++){
      visText.push(d[i].data.flname)
    }

    this.text.transition().style("opacity",0)

    this.plot.transition()
      .duration(750)
      .tween("scale", () => {
        const xd = d3.interpolate(this.x.domain(),[d[0].x0, d[0].x1])
        return (t) => this.x.domain(xd(t));
      })
      .selectAll(".arc")
      .attrTween("d", (d) => () =>  this.arc(d))
      .on("end", (e) => {
        this.text
          .attr("transform", (d) => {
            return "translate(" + this.arc.centroid(d)+ ")rotate(" + this.computeTextRotation(d) + ")"
          })

        for (let i=0;i<visText.length;i++){
          var textnode = document.getElementById(visText[i]+"txt")
          textnode.style.opacity = 1;
        }
      })
  }

  computeTextRotation(d) {
    const angle = (this.x(d.x0+(d.x1-d.x0)/2)-Math.PI/2)/Math.PI*180

    return (angle>90) ? angle+180 : angle;
  }

  componentDidMount() {
    this.color = d3.scaleOrdinal()
      .domain([">5 Years","3-5 Years","1-2 Years","Less than 1 year","unknown"])
      .range(["#AEC7E8","#FF7F0E","#FFBB78","#2CA02C","#C7C7C7"])
    this.bounds = this.svgContainer.getBoundingClientRect();

    this.width = this.bounds.width;
    this.height =  700;
    this.radius =  700;
    this.plotwidth =  700;

    this.plot = d3.select(this.svgContainer).append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .style("border","solid 1px grey")
      .append("g")
      .attr("transform", "translate(" + this.width *.4 + "," + this.height * .5 + ")");

    this.partition = d3.partition()
      .size([(this.plotwidth/2) - 20, (this.height/2) - 20])
      .round(true);

    this.x = d3.scaleLinear()
      .domain([0, this.radius/2])
      .range([0, 2 * Math.PI]);

    this.y = d3.scaleLinear()
      .range([0, this.radius/this.height]);

    this.drawLegends();

    this.init(this.props)
  }

  draw(data) {
    d3.selectAll(".partition").remove()

    this.root = d3.hierarchy(data);
    this.root
      .count(function(d){return 1})
      .sort(function(a,b){return b.value-a.value;})

    this.partition(this.root)

    this.arc = d3.arc()
      .startAngle((d) => {return Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))); })
      .endAngle((d) => {return Math.max(0, Math.min(2 * Math.PI, this.x(d.x1)));})
      .innerRadius((d) => { return Math.max(0, this.y(d.y0)); })
      .outerRadius((d) => { return Math.max(0, this.y(d.y1)); });

    this.datum = this.plot.selectAll(".partition").data(this.root.descendants(), d => guid())

    this.g = this.datum
      .enter()
      .append("g")
      .attr("class","partition");

    this.leaf = this.g
      .append("path")
      .attr("id",function(d){return d.data.flname})
      .attr("class","arc")
      .attr("d", (d) => this.arc(d))
      .on("click",(d) => {if (d.depth<3){this.click(d.descendants())}})
      //    .attr("stroke","black")
      // .style("fill", (d) => {return this.color((d.children ? d : d.parent).data.flname)})
      .style("fill", (d) => {
        if(d.parent && d.parent.data.flname=="all") {
          return this.color(d.data.flname)
        } else if (d.parent && d.parent.data.flname !="all") {
        return this.color(d.parent.data.flname)
        } else {
          return "#316395"
        }
      })
//    .attr("stroke-width",.5)

    // this.a = this.g
    //     .append("a")
    //     .attr("xlink:href",function(d){return d.data.profile})
    //     .attr("xlink:show","new")

    this.text = this.g
        .append("text")
        .attr("id",function(d){return d.data.flname+"txt"})
        .attr("transform", (d) => { return "translate(" + this.arc.centroid(d)+ ")rotate(" + this.computeTextRotation(d) + ")"; })
        .text(function(d){if(d.depth>1){return _.truncate(_.startCase(_.toLower(d.data.flname)),{length:16})}else{return d.data.flname}})
        // .text(function(d){if(d.depth>0){return d.data.flname}})
        .attr("fill","black")
        .style("font-size", function(d){
          if (d.depth==1 && data.children.length<10){return ".90em"}
          else if(d.depth==2){return ".6em"}
          else {return ".5em"}
        })
        .attr("dx","-40")
        .attr("dy",".35em")
        .on("mouseover",(d, i, nodes) => {
          if(typeof d.data.children === 'undefined') {
            d3.select(nodes[i]).style("fill","white")
            this.clickName(d);
          }
        })
        .on("mouseout",(d, i, nodes) => {
          if(typeof d.data.children === 'undefined') {
            d3.select(nodes[i]).style("fill","black")
            this.clearTooltip();
            // d3.selectAll(".tooltipInfo").remove()
          }
        })

    var tooltipbox = d3
      .select('svg')
      .append("rect")
      .attr("x", this.width - 300)
      .attr("y",50)
      .attr("height", 110)
      .attr("width", 250)
      .attr("fill", "none")
      .attr("stroke", "#000080")

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr("x", this.width - 290)
      .attr("y",70)
      .text("NAME: ")
      .attr('id', 'tooltip-name')
      .style("font-size",".7em")
      .attr("fill","black")

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr("x", this.width - 290)
      .attr("y",90)
      .text("SKILL: ")
      .attr('id', 'tooltip-skill')
      .style("font-size",".7em")
      .attr("fill","black")

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr("x", this.width - 290)
      .attr("y",110)
      .text("LOCATION: ")
      .attr('id', 'tooltip-location')
      .style("font-size",".7em")
      .attr("fill","black")

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr('id', 'tooltip-job')
      .attr("x", this.width - 290)
      .attr("y",130)
      .style("font-size",".7em")
      .attr("fill","black")
      .text("JOB: ")

    d3.select("svg")
      .append("text")
      .attr("class","tooltipInfo")
      .attr("x", this.width - 290)
      .attr("y",150)
      .style("font-size",".7em")
      .attr("fill","black")
      .attr('id', 'tooltip-school')
      .text("SCHOOL: ")
  }

  clearTooltip() {
    d3.select('#tooltip-name').text("NAME: ")
    d3.select('#tooltip-skill').text("SKILL: ")
    d3.select('#tooltip-location').text("LOCATION: ")
    d3.select('#tooltip-job').text("JOB: ")
    d3.select("#tooltip-school").text("SCHOOL: ")
  }

  clickName(d){
    d3.select('#tooltip-name').text("NAME: "+ d.data.flname)
    d3.select('#tooltip-skill').text("SKILL: "+ _.truncate(_.startCase(_.toLower(d.data.skillsTot)), {length: 38}))
    d3.select('#tooltip-location').text("LOCATION: "+d.data.citystate)
    d3.select('#tooltip-job').text("JOB: "+ d.data.jobtitle.substr(0,25))
    d3.select("#tooltip-school").text("SCHOOL: "+ _.truncate(_.startCase(_.toLower(d.data.school)), {length: 35}))
  }

  drawLegends() {
    const g = d3.select('svg')
      .append('g')
      .attr('id', 'legend')
      .attr('transform', d => `translate(${this.width - 200}, 175)`);
    const legends = g.selectAll('.legend').data(_.zip(this.legends.labels, this.legends.colors), d => guid());

    const group = legends
      .enter()
      .append('g')

    group
      .append('rect')
      .attr('fill', d => d[1])
      .attr('y', (d, i) => i * 38)
      .attr('width', 150)
      .attr('height', 30)

    group
      .append('text')
      .attr('y', (d, i) => (i * 38) + 20)
      .attr('x', 150/2)
      .attr('text-anchor', 'middle')
      .attr('width', 150)
      .text(d => d[0])
  }

  init(props) {
    const children = _.map(props.data.children, (child) => {
      const children = _.filter(child.children, (grandChild) => {
        if (props.filter === "jobs") {
          return grandChild.ats_job_refID === props.value
        } else {
          return grandChild.departments === props.value
        }
      });

      return {
        ...child,
        children: children.length > 25 ? _.take(children, 25) : children
      }
    })

    this.draw({
      ...props.data,
      children: children
    })
  }

  shouldComponentUpdate(props) {
    this.init(props);

    return false;
  }

  render() {
    return <div className="svg-container" ref={(ref) => this.svgContainer = ref}></div>
  }
}

export default Sunburst
