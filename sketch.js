
var drawThings = false;


function removeElement(arr,key){
  for(var i=arr.length-1;i>=0;i--){
    if(arr[i]==key){
      arr.splice(i,1);
    }
  }
}


function heuristic(a,b){
  //var d=dist(a.x,a.y,b.x,b.y);
  var d=abs(a.i-b.i)+abs(a.j-b.j);
  return d;
}

var cols=50;
var rows=50;
var grid = new Array(rows);

//Starting and ending points of the search
var start;
var end;
//Array that stores grid points that still needs to be visited
var openSet=[];

//Array that stores grid points that are already visited so that we dont visit them again
var closedSet=[];

var w,h;

var path=[];

function Spot(i,j){
  //Properties
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.neighbours=[];
  this.previous=undefined;
  this.wall=false;
  
  if(random(1)<0.35){
    this.wall=true;
  }

  //Methods
  this.show = function(col){
    fill(col);
    if(this.wall){
      fill(0);
      noStroke();
      ellipse(this.i * w + w/2,this.j * h + h/2,w/2,h/2);
      //rect(this.i * w,this.j * h,w-1,h-1);
    }
  }

  this.mark=function(col){
    fill(col);
    //noStroke();
    //rect(0,0,w-1,h-1);
    ellipse(this.i * w + w/2,this.j * h + h/2,w/2,h/2);
  }

  this.addNeighbours=function(grid){
    if(i<rows-1){
      this.neighbours.push(grid[i+1][j]);
    }
    if(i>0){
      this.neighbours.push(grid[i-1][j]);
    }
    if(j<cols-1){
      this.neighbours.push(grid[i][j+1]);
    }
    if(j>0){
      this.neighbours.push(grid[i][j-1]);
    }
    if(i>0 && j>0){
      this.neighbours.push(grid[i-1][j-1]);
    }
    if(i<rows-1 && j<cols-1){
      this.neighbours.push(grid[i+1][j+1]);
    }
    if(i>0 && j<cols-1){
      this.neighbours.push(grid[i-1][j+1]);
    }
    if(i<rows-1 && j>0){
      this.neighbours.push(grid[i+1][j-1]);
    }
  }
}

function setup() {

  createCanvas(600, 600);
  let startbtn = createButton("Start")
  startbtn.mousePressed(toggle)

  let refreshbtn=createButton("Refresh");
  refreshbtn.mousePressed(refreshPage);

  function refreshPage(){
    window.location.reload();
  }

  
  w=width/cols;
  h=height/rows;


  //Creating a 2D array using new Array JS keyword
  for(var i=0;i<rows;i++){
    grid[i]=new Array(cols);
  }

  for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
      //New Spots to store the values or cost of that point on grid.
      grid[i][j]=new Spot(i,j);
    }
  }

  //Adding Neighbours
  for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
      grid[i][j].addNeighbours(grid);
    }
  }


  start=grid[0][0];
  end=grid[rows-1][cols-1];
  start.wall=false;
  end.wall=false;


  openSet.push(start);
}
console.log(arrayx);
function toggle(){
  drawThings = !drawThings;
    
}
//The draw() function in p5 runs as a loop. The code inside the draw() function runs continuously from top to bottom until the program is stopped. 

function draw() {
  // function mouseClicked(){
    if(drawThings){

      

  if(openSet.length>0){
    //Implies still grid points need to be visited

    var lowestIndex=0;
    for(var i=0;i<openSet.length;i++){
      if(openSet[i].f<openSet[lowestIndex].f){
        lowestIndex=i;
      }
    }

    var current=openSet[lowestIndex];

    if(current === end){
      console.log(arrayx);
      noLoop();
      document.querySelector("h2").style.visibility = 'visible';
    }

    removeElement(openSet,current);
    closedSet.push(current);


    //Some evaluations on neighbour before adding them into openset

    var neighbourOfCurrent=current.neighbours;

    for(var i=0;i<neighbourOfCurrent.length;i++){
      var neigh=neighbourOfCurrent[i];
      if(!closedSet.includes(neigh) && !neigh.wall){
        var tempG=current.g+1;
        var newPath=false;
        if(openSet.includes(neigh)){
          if(tempG<neigh.g){
            newPath=true;
            neigh.g=tempG;
          }
        }
        else{
          neigh.g=tempG;
          newPath=true;
          openSet.push(neigh);
        }
        if(newPath){
          neigh.h=heuristic(neigh,end);
          neigh.f=neigh.g+neigh.h;

          //For keeping track that from where it came
          neigh.previous=current;
        }
        


      }
    }



  }
  else{
    //All grid points are been visited
    noLoop();
    document.querySelector("h2").textContent='Sorry !!! Path Does Not Exist!!!';
    document.querySelector("h2").style.visibility='visible';
    return;
  }

  background(220);




  //For Debugging
  for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
      grid[i][j].show(color(255));
    }
  }

  

/*
  for(var i=0;i<closedSet.length;i++){
    closedSet[i].show(color(255,0,0));
  }

  for(var i=0;i<openSet.length;i++){
    openSet[i].show(color(0,255,0));
  }
  */

  //Finding the path
  path=[];
  var temp=current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp=temp.previous;
  }
  

  
  noFill();
  stroke(255,0,220);
  strokeWeight(w/2);
  beginShape();
    for(var i=0;i<path.length;i++){
      vertex(path[i].i*w + w/2,path[i].j*h +h/2);
    }
  endShape();
  start.mark(color(0,0,0));
  end.mark(color(0,0,0));

  
}

}