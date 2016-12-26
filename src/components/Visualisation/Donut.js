import React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

const order = [
  'cert/diploma',
  'associates',
  'bachelors',
  'masters',
  'doctorate',
  'other',
  'blank'
]

class Donut extends React.Component {

  constructor() {
    super();

    this._current = [];
  }

  init(props) {
    const {filter, value, hired} = props || this.props;

    const selectedData = _.find(this.props.data[filter], (data) => {
      return data.item.toLowerCase() === value.toLowerCase();
    });

    this.data = _.chain(selectedData).reduce((tmp, item, index) => {
      if (typeof item !== 'string') {
        tmp.push({
          label: index,
          value: item
        })
      }

      return tmp;
    }, []).value();

    this.data.sort(function(a, b) {
      // sort based on the index in order array
      return order.indexOf(a.label) - order.indexOf(b.label);
    })

    this.draw();
  }

  /**
   *
   * @param a
   * @returns {function(*=): *}
   */
  arcTween(a) {
    const i = d3.interpolate(this._current[a.data.label], a);
    this._current[a.data.label] = i(0);
    return (t) => this.arc(i(t));
  }

  onMouseOver(idx) {
    d3.selectAll('path.slice')
      .attr('opacity', (d, i, nodes) => {
        return i === idx ? 1 : 0.25;
      })
      .transition()
      .ease(d3.easeElastic)
      .duration(500)
      .attr("d", (d, i) => i === idx ? this.arcHover(d) : this.arc(d));

    d3.selectAll('g.legend').attr('opacity', (d, i, nodes) => {
      return i === idx ? 1 : 0.25;
    });
  }

  onMouseOut() {
    d3.selectAll('path.slice')
      .attr('opacity', 1)
      .transition()
      .duration(500)
      .ease(d3.easeElastic)
      .attr('d', d => this.arc(d))
    d3.selectAll('g.legend').attr('opacity', 1)
  }

  showTooltip(d) {
    this.tooltip
      .style("left", d3.event.pageX+15+"px")
      .style("top", d3.event.pageY - 10+"px")
      .style("display", "flex")
      .html(() => {
        return `<div style="text-transform: capitalize; font-size: 12px; padding: 0 15px;">${d.data.label}</div><div style="border-left: 1px dashed #eee; font-size: 12px; text-align: center; padding: 0 15px;">${d.data.value.toFixed(1)}%</div>`;
      });
  }

  draw() {
    const slice = this.slices
      .selectAll("path.slice")
      .data(this.pie(this.data), (d) => d.data.label);

    slice
      .enter()
      .insert("path")
      .style("fill", (d, i) => this.color(i))
      .style('cursor', 'pointer')
      .attr("class", "slice")
      .attr('data-index', (d, i) => i)
      .attr('d', d => this.arc(d))
      .style('stroke', 'white')
      .style('stroke-width', 2)
      .on('mouseover', (d, i) => this.onMouseOver(i))
      .on('mouseout', d => {
        this.onMouseOut();
        this.tooltip.style("display", "none");
      })
      .on("mousemove", (d) => this.showTooltip(d))
      .each((d) => this._current[d.data.label] = d);

    slice
      .transition().duration(500)
      .attrTween("d", d => this.arcTween(d))

    slice.exit().remove();

    const text = this.labels
      .selectAll("text")
      .data(this.pie(this.data), d => d.data.label);

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .attr('text-anchor', 'middle')
      .on('mouseover', (d, i) => this.onMouseOver(i))
      .on('mouseout', d => {
        this.onMouseOut();
        this.tooltip.style("display", "none");
      })
      .on("mousemove", (d) => this.showTooltip(d))
      .text((d) => `${d.value.toFixed(1)}%`)
      .attr('fill', '#fff')
      .attr('font-size', 12)
      .attr('transform', d =>  "translate(" + this.arc.centroid(d) + ")")

    text
      .attr("opacity", 0)
      .text((d) => d.value ? `${d.value.toFixed(1)}%` : null)
      .attr('transform', d =>  "translate(" + this.arc.centroid(d) + ")")
      .transition()
      .duration(500)
      .on("end", (d, i, nodes) => {
        d3.select(nodes[i]).attr('opacity', 1)
      })

    const scale = d3.scaleLinear()
      .domain([0, 4])
      .range([this.width * 0.25, this.width * 0.75]);

    const legends = this.legends
      .selectAll("g.legend")
      .data(this.pie(this.data), (d) => d.data.label);

    const legend = legends
      .enter()
      .append('g')
      .on('mouseover', (d, i) => this.onMouseOver(i))
      .on('mouseout', d => this.onMouseOut())
      .style('cursor', 'pointer')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${scale(i % 4)}, ${this.height - (100 - ((Math.floor(i/4)%4) * 25))})`)

    legend
      .append('rect')
      .attr('fill', (d, i) => this.color(i))
      .attr('width', 15)
      .attr('height', 15)
      .attr('dx', 0)
      .attr('dy', 0)

    legend.append('text')
      .attr('dx', 20)
      .attr('dy', 11)
      .attr('font-size', 12)
      .text(d => d.data.label)
      .style('text-transform', 'capitalize')
  }

  shouldComponentUpdate(props) {
    this.init(props);

    return false;
  }

  componentDidMount() {
    this.bounds = this.svgContainer.getBoundingClientRect();
    this.width = this.bounds.width;
    this.height =  700;
    this.radius = Math.min(this.width, this.height - 250) / 2;

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.pie = d3.pie()
      .value((d) => d.value)
      .sort(null);

    this.arc = d3.arc()
      .innerRadius(this.radius - 110)
      .outerRadius(this.radius - 20);

    this.arcHover = d3.arc()
      .innerRadius(this.radius - 110)
      .outerRadius(this.radius - 10);

    this.svg = d3.select(this.svgContainer)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.chart = this.svg
      .append("g")
      .attr('class', 'chart')
      .attr("transform", "translate(" + this.width / 2 + "," + (this.height - 100) / 2 + ")");

    this.chart
      .append('text')
      .text('Education Level Distribution')
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('dy', 6)

    this.legends = this.svg
      .append('g')
      .attr('class', 'legends')

    this.tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style('display', 'flex')
      .style('background', '#fff')
      .style('padding', '5px 0')
      .style('border', '1px solid #ddd')
      .style('flex-direction', 'row')

    this.slices = this.chart.append('g').attr('class', 'slices');
    this.labels = this.chart.append('g').attr('class', 'labels');

    this.init();
  }

  componentWillUnmount() {
    d3.selectAll('.tooltip').remove()
  }

  render() {
    return <div className="svg-container" ref={(ref) => this.svgContainer = ref}></div>
  }
}

export default Donut;