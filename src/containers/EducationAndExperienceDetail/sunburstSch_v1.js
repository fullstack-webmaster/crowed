
var width = 1000,
    height = 700,
    plotwidth = 700,
    radius = 700,
//    color = d3.scaleOrdinal(d3.schemeCategory20);
    color = d3.scaleOrdinal()
            .domain([">5 Years","3-5 Years","1-2 Years","Less than 1 year","unknown"])
            .range(["#AEC7E8","#FF7F0E","#FFBB78","#2CA02C","#C7C7C7"])
    
var plot = d3.select("#sunburst").append("svg")
        .attr("width",width)
        .attr("height",height)
        .style("border","solid 1px grey")
        .append("g")
        .attr("transform", "translate(" + width *.40 + "," + height * .5 + ")");

var selector = "department"//Event Listner
var job_dept = "Business Development" //Event Listener

//Test handlers for switching choices
document.getElementById("design").onclick = function(){
    job_dept = "Design"
    renderViz()
}
document.getElementById("legal").onclick = function(){
    job_dept = "Legal"
    renderViz()
}

document.getElementById("bd").onclick = function(){
    job_dept = "Business Development"
    renderViz()
}
document.getElementById("eng").onclick = function(){
    job_dept = "Engineering"
    renderViz()
}

//////////////////////////////////


function renderViz(){
    
d3.selectAll(".partition").remove()    
d3.json("data/treeSch_v4.json",function(tree){

updateData(tree)
//
//////
var partition = d3.partition()
    .size([plotwidth/2, height/2])
    .round(true);


var x = d3.scaleLinear()
    .domain([0,radius/2])
    .range([0, 2 * Math.PI]);

var y = d3.scaleLinear()
    .range([0, radius/height]);

var root = d3.hierarchy(tree);
    root.count(function(d){return 1})
        .sort(function(a,b){return b.value-a.value;})

partition(root)
//console.log(root.descendants())
var depthArr = [];

var arc = d3.arc()
    .startAngle(function(d) {return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) {return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));})
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });
    


var g = plot.selectAll(".g")
    .data(root.descendants())
    .enter().append("g")
    .attr("class","partition");

   
    
var leaf = g.append("path")
    .attr("id",function(d){return d.data.flname})
    .attr("class","arc")
    .attr("d",arc) 
    .on("click",function(d){if (d.depth<3){click(d.descendants())}})
//    .attr("stroke","black")
//    .style("fill", function(d) {return color((d.children ? d : d.parent).data.flname)}) 
    .style("fill", function(d){if(d.parent && d.parent.data.flname=="all")
                                {return color(d.data.flname)
                                } else if(d.parent && d.parent.data.flname !="all") {
                                    return color(d.parent.data.flname)
                                } else {return "#316395"}}) 
//    .attr("stroke-width",.5)
    
var text = 
    g
//    .append("a")
//    .attr("xlink:href",function(d){return d.data.profile})
//    .attr("xlink:show","new")
    .append("text")
    .attr("id",function(d){return d.data.flname+"txt"})
    .attr("transform", function(d) { return "translate(" + arc.centroid(d)+ ")rotate(" + computeTextRotation(d) + ")"; })
    .text(function(d){if(d.depth>0){return _.truncate(_.startCase(_.toLower(d.data.flname)),{length:15})}})
    .attr("fill","black")
    .style("font-size",function(d){if (d.depth==1 && tree.children.length<10){return ".90em"}else if(d.depth==2){return ".6em"} else {return ".5em"}})
    .attr("dx","-40")
    .attr("dy",".35em")
    .on("mouseover",function(d){if(d.parent && d.parent.data.flname !="all"){
                                                      d3.select(this).style("fill","white")
                                                      clickName(d)
        }})
    .on("mouseout",function(d){if(d.parent && d.parent.data.flname !="all"){
                                                      d3.select(this).style("fill","black")
                                                      d3.selectAll(".tooltipInfo").remove()
        }}) 
 
//Tooltip Panel
var tooltipbox = d3.select("svg")
                .append("rect")
                .attr("x",width/1.30)
                .attr("y",50)
                .attr("height",100)
                .attr("width",200)
                .attr("fill","none")
                .attr("stroke","#000080")

    
  function clickName(d){
      
      d3.select("svg")
        .append("text")
        .attr("class","tooltipInfo")
        .attr("x",width/1.28)
        .attr("y",70)
        .text("NAME: "+d.data.flname)
        .style("font-size",".7em")
        .attr("fill","black")

    d3.select("svg")
        .append("text")
        .attr("class","tooltipInfo")
        .attr("x",width/1.28)
        .attr("y",90)
        .text("LOCATION: "+d.data.citystate)
        .style("font-size",".7em")
        .attr("fill","black")

      d3.select("svg")
        .append("text")
        .attr("class","tooltipInfo")
        .attr("x",width/1.28)
        .attr("y",110)
        .style("font-size",".7em")
        .attr("fill","black")
        .text("JOB: "+d.data.jobtitle.substr(0,25))

     d3.select("svg")
        .append("text")
        .attr("class","tooltipInfo")
        .attr("x",width/1.28)
        .attr("y",130)
        .style("font-size",".7em")
        .attr("fill","black")
        .text("SCHOOL: "+d.data.school.substr(0,25))

  }  
  
  function click(d){
    var visText=[]
    for(i=0;i<d.length;i++){
        visText.push(d[i].data.flname)
        
    }
    
    text.transition().style("opacity",0)
    
plot.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(),[d[0].x0, d[0].x1])
        return function(t) {x.domain(xd(t))};
      })
      .selectAll(".arc")
      .attrTween("d", function(d) { return function() { return arc(d); }; })
      .on("end", function(e){
           
       text
          .attr("transform", function(d) {return "translate(" + arc.centroid(d)+ ")rotate(" + computeTextRotation(d) + ")"; })
    
        for (i=0;i<visText.length;i++){
            var textnode = document.getElementById(visText[i]+"txt")
            textnode.style.opacity = 1;
        }  
 
      })  
      
}  

    function computeTextRotation(d) {
        var angle = (x(d.x0+(d.x1-d.x0)/2)-Math.PI/2)/Math.PI*180 
        if (angle>90){angle = angle+180}
        return angle 

  
}



})

}

function updateData(tree){


    for (var i=0;i<tree.children.length;i++){
   
   //Filter by data by listner result
    var children = tree.children[i].children
     children = children.filter(function(e){
         if (selector == "job"){
            return e.ats_job_refID == job_dept    
        } else {
            return e.departments == job_dept
        }
        })

    if(children.length>25){
        children=children.splice(0,25)
    }
    tree.children[i].children = children
    
    }
var pruned = []
for(var i=0; i<tree.children.length;i++){
 if (tree.children[i].children.length>2)
 pruned.push(tree.children[i])
 }
tree.children = pruned 
}

renderViz()