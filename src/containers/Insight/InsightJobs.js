import React from 'react';
import * as d3 from 'd3';
import cx from 'classnames';
import _ from 'lodash';
// import jsonData2 from '../../data/pool2';
// import jsonData3 from '../../data/pool3';
// import jsonData4 from '../../data/pool4';
// import jsonData9 from '../../data/pool9';
// import jsonData13 from '../../data/pool13';
//
// var data2 = jsonData2
// var data3 = jsonData3
// var data4 = jsonData4
// var data9 = jsonData9
// var data13 = jsonData13

const icon = "M21.8,29.8c-0.7,0.8-1.7,1.3-2.9,1.3H3.7c-1.2,0-2.2-0.5-2.9-1.3c-0.7-0.8-1-1.9-0.8-3l1.6-9.6C2,14.8,4.2,13,6.6,13h0.6c-1.8-1.3-3-3.4-3-5.8C4.2,3.2,7.4,0,11.3,0s7.1,3.2,7.1,7.1c0,2.4-1.2,4.5-3,5.8h0.6c2.3,0,4.5,1.9,4.9,4.2l1.6,9.6C22.8,27.9,22.5,28.9,21.8,29.8z"

class Loader extends React.PureComponent {
  render() {
    return (
      <div className="lds-rolling">
        <div></div>
      </div>
    )
  }
}

const BASE_URL = __DEV__ ? '/dist/data/' : `${__DATA_BASE_URL__}/data/`;

class InsightJobItem extends React.PureComponent {
  render() {
    const {
      title,
      children,
      flex
    } = this.props;

    return (
      <div className="flex1" style={{
        flex: flex || 1
      }}>
        <div className="flex-table">
          <div className="theader">
            { title }
          </div>
          <div className="tbody" style={{position: 'relative'}}>
            { children }
          </div>
        </div>
      </div>
    )
  }
}

class InsightCluster extends React.Component {
  componentDidMount() {
    if (!this.props.pool) return;

    d3.json(this.props.pool, (edexp_data) => {
      this.init(edexp_data)
    });
    // this.init(eval('data'+this.props.pool))
  }

  shouldComponentUpdate(props) {
    if (!props.pool) return false;

    if (props.pool !== this.props.pool) {
      d3.select('#cluster').select('svg').remove();
      d3.json(props.pool, (edexp_data) => {
        this.init(edexp_data)
      });
    }
    // if (props.pool !== this.props.pool) {
    //   d3.select('#cluster').select('svg').remove();
    //   this.init(eval('data'+props.pool))
    // }
    return true;
  }

  componentWillUpdate(newProps, newState) {
    var parent = this;
    ////////// Highlight candidates
    d3.select("#cluster")
      .selectAll('path')
      .each(function(d,i) {
        if ( newProps.filterskill == 'MOUSEOUT' ) {
          d3.select(this).attr( 'opacity','1.0' );
          return;
        }

        if( parent.searchDvlprByskill(d.data.tags, newProps.filterskill) )
          d3.select(this).attr( 'opacity','1.0' )
        else
          d3.select(this).attr( 'opacity','0.2' )
      })
    ////////// Highlight barchart
    d3.select('#plot-g')
      .selectAll('.g-bar')
      .each(function(d) {
        if ( newProps.filterskill == 'MOUSEOUT') {
          d3.select(this).attr('opacity', '1.0')
          return;
        }
        if ( newProps.filterskill == d.text[0] )
          d3.select(this).attr('opacity','1.0')
        else
          d3.select(this).attr('opacity','0.2')
      })
  }

  searchDvlprByskill( src, filterskill ) {
    if(typeof(src) === 'undefined'|| !src.length)
      return false;
    var personalSkills = src;
    var temp;
    var isSuccess = false;
    personalSkills.forEach(function(element) {
      temp = element.trim().toLowerCase();
      if( temp.indexOf(filterskill) != -1 && temp.length == filterskill.length ) {
        isSuccess = true;
        return;
      }
    }, this);
    return isSuccess;
  }

  init(edexp_data) {
    const labels = [
      {'label':'Doctorate','offset':-3,'axis':'y'},
      {'label':'Masters','offset':-2,'axis':'y'},
      {'label':'Bachelors','offset':-1,'axis':'y'},
      {'label':'Associates','offset':0,'axis':'y'},
      {'label':'Cert/Diploma','offset':1,'axis':'y'},
      {'label':'Unk/Other','offset':2,'axis':'y'},
      {'label':'<1','offset':-2,'axis':'x'},
      {'label':'1-2','offset':-1,'axis':'x'},
      {'label':'3-5','offset':0,'axis':'x'},
      {'label':'5+','offset':1,'axis':'x'},
      {'label':'Unknown','offset':2,'axis':'x'},
    ]

    const boxWidth = document.getElementById("cluster").offsetWidth
    const width = boxWidth-25,
      height = 375,
      margin ={"t":20,"r":20,"b":20,"l":20},
      innerwidth = width-margin.l-margin.r,
      innerheight = height-margin.t-margin.b

    const cluster = d3.tree()
      .size([innerwidth,innerheight/1.3]);

    let root = d3.hierarchy(edexp_data);

    const centerY = innerheight/2
    const centerX = innerwidth/2

    root.fx = margin.l;
    root.fy = 0;

    root.children.forEach(function(e){

//        this orders the education categories
      if(e.data.name=="doctorate"){
        e.data.yoffset= labels[0].offset
      }else if (e.data.name=="masters"){
        e.data.yoffset= labels[1].offset
      } else if (e.data.name=="bachelors"){
        e.data.yoffset= labels[2].offset
      } else if (e.data.name=="associates"){
        e.data.yoffset= labels[3].offset
      } else if (e.data.name =="cert/diploma"){
        e.data.yoffset= labels[4].offset
      } else if (e.data.name =="Unk/Other"){
        e.data.yoffset= labels[5].offset
      }


      var edloc = margin.t+25+centerY+(centerY/3.5*e.data.yoffset)
      e.fx = margin.l;
      e.fy = edloc

      e.children.forEach(function(e){
        if (e.data.name=="<1"){
          e.data.xoffset=labels[6].offset
        } else if (e.data.name=="1-2"){
          e.data.xoffset=labels[7].offset

        } else if (e.data.name=="3-5"){
          e.data.xoffset=labels[8].offset

        } else if (e.data.name =="5+"){
          e.data.xoffset=labels[9].offset

        } else if (e.data.name =="Unknown"){
          e.data.xoffset=labels[10].offset

        }

        e.fx = 100+centerX + (centerX/3*e.data.xoffset)
        e.fy = edloc;

      })
    })

    let nodes = cluster(root)
    let links = nodes.links()

    nodes = this.flatten(nodes)

    var clusterplot = d3.select("#cluster")
      .append("svg")
      .attr("width",width)
      .attr("height",height)
      .style("background-color","white")
      .append('g')
      .attr('id','nodegroup')
      .attr("transform","translate("+margin.l+","+margin.t+")");

    var text = clusterplot.selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .text(function(d){return d.label}) //print only education and experience labels
      .style("font-size",".5em")
      .attr("fill","black")
      .attr("text-anchor","middle")
      .style("text-transform","uppercase")
      .attr("x",function(d){return d.axis=="y" ? margin.l :100+centerX + (centerX/3*d.offset)})
      .attr("y",function(d){return d.axis=="y" ? margin.t+25+centerY+(centerY/3.5*d.offset): margin.t})

    var expLabel = clusterplot.append("text")
      .attr("x",margin.l+100)
      .attr("y",margin.t)
      .text("YEARS OF EXPERIENCE:")
      .style("font-size",".5em")
      .style("font-weight","bold")

    var edLabel = clusterplot.append("text")
      .attr("x",-5)
      .attr("y",margin.t+25)
      .text("EDUCATION:")
      .style("font-size",".5em")
      .style("font-weight","bold")

    var grid = clusterplot.selectAll("line")
      .data(labels.slice(0,6))
      .enter()
      .append("line")
      .attr("x1",function(d){if(d.axis=="y"){return margin.l+100}})
      .attr("x2",function(d){if(d.axis=="y"){return innerwidth}})
      .attr("y1",function(d){if(d.axis=="y"){return margin.t+25+centerY+(centerY/3.5*d.offset)}})
      .attr("y2",function(d){if(d.axis=="y"){return margin.t+25+centerY+(centerY/3.5*d.offset)}})
      .attr("stroke","lightgrey")//hex: #00AEEF
      .attr("stroke-width",1)
      .attr("opacity",.5)
      .attr("class","link")

    var
      MBFrepel = d3.forceManyBody(nodes).strength(0).distanceMax(260).distanceMin(1),
      collision = d3.forceCollide(this.fcollide).strength(1).iterations(100),
      linkForce = d3.forceLink(links).distance(1).strength(1),
      simulation = d3.forceSimulation(nodes)
        .force("linkForce", linkForce)
        .force("MBFrepel", MBFrepel)
        .force("collision",collision)
        .alpha(.1)
        .velocityDecay(0.1)
        .on("tick", this.ticked.bind(this))

    this.nodess = clusterplot.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")

    this.nodess.append("path")
    .attr("d",function(d){if(d.depth==3){return icon}})
    .attr('transform',function (d){ return d.data.hired==0 ? 'scale(0.35)' :'scale(0.40)' })
    .attr("fill",function(d){return d.depth==3 && d.data.hired==1 ? "steelblue":"#EE7600"})
    .attr("stroke","white")
    .attr("stroke-width","1px")
  }

  ticked(){
    this.nodess.attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; });
  }

  flatten(root) {
    var nodes = [], i = 0;

    const recurse = (node) => {
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

  fcollide(node){
    if (node.depth ===2){
      return 1
    } else if (node.depth === 3){
      return 4;
    }
  }

  render() {
    return <div id="cluster" style={{width: '100%'}}></div>
  }
}

class InsightJobs extends React.Component {
  state = {
    busy: false,
    data: null,
    selected: 2,
    options: [{
      "position":"Core Developer",
      "pos": BASE_URL + "pos2.json",
      "id": 2,
      "pool": BASE_URL + "pool2.json"
    }, {
      "position":"Systems Security Engineer",
      "id": 3,
      "pos": BASE_URL + "pos3.json",
      "pool": BASE_URL + "pool2.json"
    }, {
      "position":"Full Stack Developer",
      "id": 4,
      "pos": BASE_URL + "pos4.json",
      "pool": BASE_URL + "pool2.json"
    }, {
      "position":"Instructional Designer",
      "pos": BASE_URL + "pos9.json",
      "id": 9,
      "pool": BASE_URL + "pool2.json"
    }, {
      "position":"UX Developer",
      "pos": BASE_URL + "pos13.json",
      "id": 13,
      "pool": BASE_URL + "pool2.json"
    }],
    selectedSkill: ''
  }

  componentWillMount() {
    this.setState({
      busy: true
    })

    d3.json(BASE_URL + `pos${this.state.options[0].id}.json`, result => {
      this.setState({
        data: result,
        busy: false,
        selected: this.state.options[0].id
      })
    })
  }

  componentDidMount() {
    this.width = 600;
    this.height = 350;
    this.axis0 = this.height/1.2;
    this.spacing = 50;
    this.topPadding = 50;
    this.leftPadding = 10;
    this.color = ["#ff8c00","#c0c0c0"];

    this.yscale = d3.scaleLinear()
        .domain([0, 100])
        .range([this.axis0, this.topPadding]);
  }

  draw(state) {
    this.plot = d3.select("#barChart").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .style("background-color","white")
      .append("g")
      .attr("id","plot-g");

    const nh_freq_raw = _.filter(state.data.nhchld, nhchld => {
      const active = _.find(state.data.hchld, hchld => {
        return nhchld.text === hchld.text && hchld.inpost === 1;
      });

      return active;
    })

    const nh_freq = _.map(nh_freq_raw, (nh) => {
      return {
        ...nh,
        prop: Math.round((nh.freq/state.data.nhcandidates)*100),
        text: nh.text.split(/\s+/)
      }
    })

    const h_max = d3.max(nh_freq, (d) => d.prop);

    this.yscale2 = d3.scaleLinear()
      .domain([0, Math.floor(h_max + 1)])
      .range([this.axis0, this.topPadding]);

    this.margins = this.width - (this.spacing * nh_freq.length);
    this.margin = this.margins/2;

    d3.select("#plot-g").attr("transform", "translate("+this.margin+",0)");

    const axis = this.plot.append("g")
      .attr("class","axis")
      .call(d3.axisLeft(this.yscale))

    const bar = this.plot.selectAll("g-bar")
      .data(nh_freq).enter()
      .append("g")
      .attr("class","g-bar")

    const h_back = bar.append("rect")
      .attr("class","backgroundBar")
      .attr("y", (d) => {return this.yscale(100)})
      .attr("height", (d) => {return this.axis0 - this.topPadding})
      .attr("x", (d,i) => {return i * this.spacing + this.leftPadding})
      .attr("width", this.spacing/1.5)
      .attr("fill","#c0c0c0")

    var h_bar = bar.append("rect")
      .attr("class","bar-abs")
      .attr("y", (d) => {return this.yscale(d.prop)})
      .attr("height", (d) => {return this.axis0 - this.yscale(d.prop)})
      .attr("x", (d,i) => {return i * this.spacing + this.leftPadding})
      .attr("width", this.spacing/1.5)
      .attr("fill","#ff8d00")

    var xaxisLine = this.plot.append("line")
      .attr("y1", this.axis0+.5)
      .attr("y2", this.axis0+.5)
      .attr("x1",0)
      .attr("x2", nh_freq.length * this.spacing)
      .attr("stroke", "black")
      .attr("stroke-width", 1)

    var text = bar.append("text")
      .attr("y", this.axis0+10)
      .attr("x", (d,i) => {return i * this.spacing + this.leftPadding})
      .attr("fill","steelblue")
      .attr("font-size",".5em")
      .selectAll("tspan")
      .data((d,i) => {
        const namesArr=[]
        const xloc = i * this.spacing;
        for (let i=0; i<d.text.length; i++){
          const nameobj = {
            xloc,
            text: d.text[i]
          }

          namesArr.push(nameobj)
        }
        return namesArr
      })
      .enter()
      .append("tspan")
      .attr("x", (d) => {return d.xloc + this.leftPadding})
      .attr("dy", 10)
      .style('text-transform', 'capitalize')
      .text((d) => {return d.text})

    const yaxisLabel = this.plot.append("text")
      .attr("transform", `translate(-30, ${this.height / 2})rotate(270)`)
      .attr('text-anchor', 'middle')
      .text("Percent");
  }

  /**
   *
   * @param props
   * @param state
   * @returns {boolean}
   */
  shouldComponentUpdate(props, state) {
    if (this.state.data === null || (state.data.position !== this.state.data.position)) {
      this.draw(state);
    }

    return true;
  }

  changeType(e) {
    const {value} = e.target;

    d3.selectAll("svg").remove();

    this.setState({
      busy: true
    }, () => {
      d3.json(BASE_URL + `pos${value}.json`, result => {
        this.setState({
          data: result,
          busy: false,
          selected: value
        })
      })
    })
  }

  /**
   *
   * @param post
   * @returns {boolean}
   */
  isActive(post) {
    const p = _.find(this.state.data.hchld, (h) => {
      return post.text === h.text;
    })

    return p && p.inpost === 1;
  }

  handleOverSkill(skill) {
    this.setState({
      selectedSkill: skill
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header text-center d-flex align-content-center">
              <span style={{flex: 1}} className="d-flex">
                <span style={{lineHeight: '35px'}} className="card-header-title">
                  Candidate Insights - Jobs
                </span>
              </span>
              <span className="d-flex flex-row justify-content-between">
                <select className="custom-select" value={this.state.filter} onChange={(e) => this.changeType(e) }>
                  { this.state.options.map((option, i) => {
                    return <option key={i} value={option.id}>{ option.position }</option>
                  })}
                </select>
              </span>
            </div>
            <div className="card-block">
              <div className="flex-row">
                <InsightJobItem title="Position">
                  { (this.state.data !== null && !this.state.busy) ? (
                    <div style={{padding: 10}}>
                      <h4 style={{textAlign: 'center'}}>{this.state.data.position}</h4>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>

                <InsightJobItem title="Number Who Applied">
                  { (this.state.data !== null && !this.state.busy) ? (
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                      <h4>{this.state.data.hcandidates + this.state.data.nhcandidates}</h4>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>

                <InsightJobItem title="Number Hired">
                  { (this.state.data !== null && !this.state.busy) ? (
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                      <h4 style={{marginRight: 5}}>{this.state.data.hcandidates}</h4>
                      <svg width="24" height="24">
                        <path d={icon} transform="translate(0, 3) scale(0.65)" fill="steelblue"/>
                      </svg>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>

                <InsightJobItem title="Number Not Hired">
                  { (this.state.data !== null && !this.state.busy) ? (
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                      <h4 style={{marginRight: 5}}>{this.state.data.nhcandidates}</h4>
                      <svg width="24" height="24">
                        <path d={icon} transform="translate(0, 3) scale(0.65)" fill="#EE7600"/>
                      </svg>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>

                <InsightJobItem title="Job Post" flex={2}>
                  { (this.state.data !== null && !this.state.busy) ? (
                    <div style={{
                      padding: 8,
                      height: '150px',
                      overflowY: 'scroll',
                      fontSize: 12,
                      textAlign: 'justify'
                    }}>
                      { this.state.data.jobpost[0] }
                    </div>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>
              </div>

              <div className="flex-row">
                <InsightJobItem title="Education and Experience" flex={1}>
                  { (this.state.data === null || this.state.busy) ? (
                    <Loader />
                  ) : (
                    <InsightCluster pool={BASE_URL + `pool${this.state.selected}.json`} filterskill={this.state.selectedSkill} />
                  )}
                </InsightJobItem>
              </div>

              <div className="flex-row">
                <InsightJobItem title="Skills Mentioned in Job Post">
                  { (this.state.data !== null && !this.state.busy) ? (
                    <ul className="job-posts">
                      { this.state.data.post.map((post, i) => {
                        return <li key={i} className="active">{post.text}</li>
                      })}
                    </ul>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>
                <InsightJobItem title="*Hired Candidates' Skills">
                  { this.state.data !== null && !this.state.busy ? (
                    <ul className="job-posts">
                      { this.state.data.post.map((post, index) => {
                        return <li className={cx({active: this.isActive(post), highlight: this.isActive(post)})}
                                  onMouseEnter={() => this.handleOverSkill(post.text)}
                                  onMouseLeave={() => this.handleOverSkill('MOUSEOUT')}
                                   key={index}
                                >{post.text}

                              </li>
                      })}
                    </ul>
                  ) : (
                    <Loader />
                  )}
                </InsightJobItem>
                <InsightJobItem title="Percentage of Candidates Not Hired Reporting Hired Skills" flex={4}>
                  <div id="barChart">
                    <div style={{
                      position: 'absolute',
                      top: 'calc(50% - 24px)',
                      left: 'calc(50% - 24px)'
                    }}>
                      { (this.state.data === null || this.state.busy) && <Loader /> }
                    </div>
                  </div>
                </InsightJobItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InsightJobs;
