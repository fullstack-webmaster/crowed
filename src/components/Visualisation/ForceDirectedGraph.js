import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import {guid} from '../../utils';

class ForceDirectedGraph extends React.Component {

  flatten(root) {
    var nodes = [], i = 0;

    function recurse(node) {
      if (node.children)
        node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
      if (!node.id)
        node.id = ++i;
      nodes.push(node);

      return node.size;
    }

    root.size = recurse(root);
    return nodes;
  }

  ticked(node, link, text){
    node
      .transition()
      .duration(25)
      .attr('x', function(d) { return d.x-15; })
      .attr('y', function(d) { return d.y-15; })



    link
      .transition().duration(25)
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

    text
      .transition().duration(25)
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y+2.5; })
  }

  collisionfunc(node){
    if (node.depth === 0){
      return 50

    } else if (node.depth === 1){
      return 50
    }
    else if (node.depth === 2){
      return 15
    }
    else if (node.depth === 3){
      return 12
    }
  }

  linkcolor(link){
    return "gray"
  }

  componentDidMount() {
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.bounds = this.svgContainer.getBoundingClientRect();
    this.width = this.bounds.width;
    this.height = Math.min(700, this.bounds.width - 30);

    this.plotwidth = this.width/2;
    this.plotheight = this.height/2

    this.plot = d3.select(this.svgContainer)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .style("background-color","white")
      .append("g")
      .attr("transform", "translate("+ this.plotwidth/2 +","+ this.plotheight/2 +")");

    this.cluster = d3.cluster()
      .size([360, this.height/2]);

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr('id', 'tooltip-name')
      .attr("x", this.width - 290)
      .attr("y",70)
      .text(`NAME: `)
      .style("font-size",".7em")
      .attr("fill","black")

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr('id', 'tooltip-skill')
      .attr("x", this.width - 290)
      .attr("y",90)
      .text(`SKILL: `)
      .style("font-size",".7em")
      .attr("fill","black")

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr('id', 'tooltip-location')
      .attr("x", this.width - 290)
      .attr("y",110)
      .text("LOCATION: ")
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

    d3.select('svg')
      .append("text")
      .attr("class","tooltipInfo")
      .attr('id', 'tooltip-school')
      .attr("x", this.width - 290)
      .attr("y",150)
      .style("font-size",".7em")
      .attr("fill","black")
      .text("SCHOOL: ")

    this.init(this.props);
  }

  draw(data) {
    this.root = d3.hierarchy(data);

    this.root
      .sum(function(d){return d.freq})
      .sort(function(a,b){return b.freq-a.freq;})


    this.root.fx = this.plotwidth/2;
    this.root.fy = this.plotheight/2;
    let nodes = this.cluster(this.root)
    let links = nodes.links();

    nodes = this.flatten(nodes)

    this.collision = d3.forceCollide(this.collisionfunc).strength(1).iterations(100);
    this.linkForce = d3.forceLink(links).distance(.2).strength(1);
    this.centeringF = d3.forceCenter()
      .x(this.plotwidth/2)
      .y(this.plotheight/2);
//    MBFrepel = d3.forceManyBody(nodes).strength(nodeCharge).distanceMax(260).distanceMin(1),
//    InnerRepel = d3.forceManyBody(nodes).strength(innerCharge).distanceMax(300).distanceMin(1),

    const linkData = this.plot.selectAll(".link").data(links, d => guid())

    linkData.exit().remove();

    const link = linkData
      .enter()
      .append("line")
      .attr("stroke", (d) => {return this.linkcolor(d)}) //hex: #00AEEF
      .attr("stroke-width",2)
      .attr("opacity",.5)
      .attr("class","link");

    const nodeData = this.plot.selectAll(".node").data(nodes, d => guid())

    nodeData.exit().remove();

    const node = nodeData
      .enter()
      // .attr("xlink:href",function(d){
      //   console.log(d);
      //
      //   return d.data.profile+'_blank';
      // })
      // .attr("xlink:show","new")
      // .append("svg:image")
      // .attr("width",30)
      // .attr("height",30)
      // .attr("class",".node")
      // .attr("id",function(d){return d.data.name})
      // .attr("xlink:href",function(d){return d.data.Photo}) ;
      .append("svg:image")
      .attr("width",30)
      .attr("height",30)
      .attr("class","node")
      .attr("id",function(d){return d.data.name})
      .attr("xlink:href",function(d){if(d.depth>1){return "https://www.crowded.com/images/icon-footer.png"}})
      .on('mouseover', (d) => {
        if(typeof d.data.children === 'undefined') {
          this.showInfo(d)
        }
      })
      .on('mouseleave', (d) => {
        if(typeof d.data.children === 'undefined') {
          this.clearTooltip()
        }
      })

    const tooltipbox = d3
      .select('svg')
      .append("rect")
      .attr('class', 'tooltip-wrapper')
      .attr("x", this.width - 300)
      .attr("y",50)
      .attr("height",110)
      .attr("width",250)
      .attr("fill","none")
      .attr("stroke","#000080")

    const textData = this.plot.selectAll(".text").data(nodes, d => guid());

    textData.exit().remove();

    const text = textData
      .enter()
      .append("text")
      .attr("class","text")
      .text((d) => {
        if (d.depth<3) {
          return d.data.name
        }
      })
      .style('font-size',".75em")
      .style("font-family", "'muli', sans-serif")
      .style("font-variant", "small-caps")
      .style("fill","black")
      .style("text-anchor","middle")

    d3.forceSimulation(nodes)
      .force("linkForce", this.linkForce)
      .force("centeringF", this.centeringF)
      .force("collision", this.collision)
      //            .force("InnerRepel",InnerRepel)
      //            .force("MBFrepel", MBFrepel)
      .alpha(.8)
      //          .velocityDecay(0.5)
      .on("tick", () => this.ticked(node, link, text))
  }

  clearTooltip() {
    d3.select('#tooltip-name').text("NAME: ")
    d3.select('#tooltip-skill').text("SKILL: ")
    d3.select('#tooltip-location').text("LOCATION: ")
    d3.select('#tooltip-job').text("JOB: ")
    d3.select("#tooltip-school").text("SCHOOL: ")
  }

  showInfo(d){
    d3.select('#tooltip-name').text("NAME: "+ d.data.flname)
    d3.select('#tooltip-skill').text("SKILL: "+ _.truncate(_.startCase(_.toLower(d.data.skillsTot)), {length: 38}))
    d3.select('#tooltip-location').text("LOCATION: "+d.data.citystate)
    d3.select('#tooltip-job').text("JOB: "+ d.data.jobtitle.substr(0,25))
    d3.select("#tooltip-school").text("SCHOOL: "+ _.truncate(_.startCase(_.toLower(d.data.school)), {length: 35}))
  }

  init(props) {
    const children = _.map(props.data.children, (child) => {
      return {
        ...child,
        children: _.filter(child.children, (grandChild) => {
          if (props.filter === "jobs"){
            return grandChild.ats_job_refID === props.value
          } else {
            return grandChild.departments === props.value
          }
        })
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
    return <div className="svg-container" style={{textAlign: 'center'}}ref={(ref) => this.svgContainer = ref}></div>
  }
}

export default ForceDirectedGraph