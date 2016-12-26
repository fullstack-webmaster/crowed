import React from 'react';
import * as d3 from 'd3';

class Graph extends React.Component {
  state = {
    title: '',
    mode: 'Percent'
  }

  componentDidMount() {
    const {detail} = this.props.match.params;

    const color = ["#ff8c00","#c0c0c0"];
    const bounds = this.svgContainer.getBoundingClientRect();
    const width = bounds.width;
    const height = Math.min(700, bounds.width - 30);
    const axis0 = height/2;
    const spacing = 50;
    const topPadding = 50;
    const leftPadding = 10;

    const plot = d3.select(this.svgContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color","white")
      .style("border","solid 1px black")
      .append("g")
      .attr("id","plot-g")

    const title = detail.toUpperCase();

    var displaydata = this.props.data.filter(function(e,i){
      if (i<18 && e.cat !=="Technology, Software, Software Development" && e.cat !=="Native"){
        return e.hired
      }
    })

    var yscale = d3.scaleLinear()
      .domain([0,100])
      .range([axis0,topPadding])

    var h_max = d3.max(displaydata,function(d){return +d.usb_h})

    var nh_max = d3.max(displaydata,function(d){return +d.usb_nh})

    var yscale2 = d3.scaleLinear()
      .domain([0,Math.floor(Math.max(h_max,nh_max) + 1)])
      .range([axis0,topPadding])

    displaydata.forEach(function(e){
      e.name = e.cat.split(/\s+/)
    })

    var margins =  width-(spacing * displaydata.length)
    var margin = margins/2

    d3.select("#plot-g")
      .attr("transform", "translate("+margin+",0)");

    var axis = plot.append("g")
      .attr("class","axis")
      .call(d3.axisLeft(yscale))

    var bar = plot.selectAll("g-bar")
      .data(displaydata).enter()
      .append("g")
      .attr("class","g-bar")

    var h_back = bar.append("rect")
      .attr("class","backgroundBar")
      .attr("y",function(d){return yscale(100)})
      .attr("height",function(d){return axis0-topPadding})
      .attr("x",function(d,i){return i*spacing+leftPadding})
      .attr("width",spacing/3-2)
      .attr("fill","#c0c0c0")

    var h_bar = bar.append("rect")
      .attr("class","bar-abs")
      .attr("y",function(d){return yscale(d.hired)})
      .attr("height",function(d){return axis0-yscale(d.hired)})
      .attr("x",function(d,i){return i*spacing+leftPadding})
      .attr("width",spacing/3-2)
      .attr("fill","#6B486B")

    var nh_back = bar.append("rect")
      .attr("class","backgroundBar")
      .attr("y",function(d){return yscale(100)})
      .attr("height",function(d){return axis0-topPadding})
      .attr("x",function(d,i){return i*spacing+spacing/3+leftPadding})
      .attr("width",spacing/3-2)
      .attr("fill","#c0c0c0")

    var nh_bar = bar.append("rect")
      .attr("class","bar-abs")
      .attr("y",function(d){return yscale(d.not_hired)})
      .attr("height",function(d){return axis0-yscale(d.not_hired)})
      .attr("x",function(d,i){return i*spacing+spacing/3+leftPadding})
      .attr("width",spacing/3-2)
      .attr("fill","#ff8c00")

    var xaxisLine = plot.append("line")
      .attr("y1",axis0+.5)
      .attr("y2",axis0+.5)
      .attr("x1",0)
      .attr("x2",displaydata.length*spacing)
      .attr("stroke","black")
      .attr("stroke-width",1)


    var text = bar.append("text")
      .attr("y",axis0)
      .attr("x",function(d,i){return i*spacing+leftPadding})
      .attr("fill","steelblue")
      .attr("font-size",".6em")
      .selectAll("tspan")
      .data(function(d,i){
        var namesArr=[]
        var xloc = i*spacing;
        for (var i=0;i<d.name.length;i++){
          var nameobj={}
          nameobj.xloc = xloc;
          nameobj.text = d.name[i]
          namesArr.push(nameobj)
        }
        return namesArr
      })
      .enter()
      .append("tspan")
      .attr("x",function(d){return d.xloc+leftPadding})
      .attr("dy",10)
      .text(function(d){return _.truncate(_.startCase(_.toLower(d.text)),{length:8})})
      // .text(function(d){return d.text})

    //legend
    d3.select("svg").append("rect")
      .attr("x",width/2-80)
      .attr("y",axis0+topPadding+10)
      .attr("width",10)
      .attr("height",10)
      .attr("fill","#6B486B")

    d3.select("svg").append("text")
      .attr("x",width/2-65)
      .attr("y",axis0+topPadding+20)
      .text("Hired")

    d3.select("svg").append("rect")
      .attr("x",width/2)
      .attr("y",axis0+topPadding+10)
      .attr("width",10)
      .attr("height",10)
      .attr("fill","#ff8c00")

    d3.select("svg").append("text")
      .attr("x",width/2+15)
      .attr("y",axis0+topPadding+20)
      .text("Not Hired")

    var yaxisLabel = plot.append("text")
      .attr("transform", `translate(-30, 200)rotate(270)`)
      .attr('text-anchor', 'middle')
      .text("Percent")

    const viewToggle = (choice) => {
      if (choice == "ratio"){
        axis.call(d3.axisLeft(yscale2)) //change y-axis scale
        xaxisLine                       //change y location of x-axis
          .transition().delay(100)
          .attr("y1",yscale2(1)+.5)
          .attr("y2",yscale2(1)+.5)
        yaxisLabel.text("Ratio to U.S. Benchmark")        //change y-axis label

        h_bar //update hired bar
          .transition().delay(100).duration(750)
          .attr("y",function(d){return d.usb_h>1 ? yscale2(d.usb_h): yscale2(1)})
          .attr("height",function(d){return d.usb_h>1 ? (yscale2(1))-yscale2(d.usb_h):yscale2(d.usb_h)-(yscale2(1))})

        nh_bar //update not hired bar
          .transition().delay(100).duration(750)
          .attr("y",function(d){return d.usb_nh>1 ? yscale2(d.usb_nh): yscale2(1)})
          .attr("height",function(d){return d.usb_nh>1 ? (yscale2(1))-yscale2(d.usb_nh):yscale2(d.usb_nh)-(yscale2(1))})


      } else {
        axis.call(d3.axisLeft(yscale)) //change y-axis scale
        xaxisLine                      //change y location of x-axis
          .transition().delay(100)
          .attr("y1",axis0+.5)
          .attr("y2",axis0+.5)
        yaxisLabel.text("Percent")      //change y-axis label
        h_bar //update hired bar
          .transition().delay(100).duration(750)
          .attr("y",function(d){return yscale(d.hired)})
          .attr("height",function(d){return axis0-yscale(d.hired)})
        nh_bar //update not hired bar
          .transition().delay(100).duration(750)
          .attr("y",function(d){return yscale(d.not_hired)})
          .attr("height",function(d){return axis0-yscale(d.not_hired)})
      }

    }

    this.viewToggle = viewToggle;
  }

  onChange(e) {
    this.viewToggle(e.target.value);
  }

  render() {
    return (
      <div className="svg-container" style={{textAlign: 'center'}} ref={(ref) => this.svgContainer = ref}>
        { this.props.enableToggleRatio &&
          <div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input className="form-check-input" defaultChecked type="radio" onClick={e => this.onChange(e)} name="mode" id="radio-percent" value="percent"/>
                &nbsp; Percent
              </label>
            </div>

            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input className="form-check-input" type="radio" onClick={e => this.onChange(e)} name="mode" id="radio-ratio" value="ratio"/>
                &nbsp; Ratio to U.S. Benchmark
              </label>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Graph;
