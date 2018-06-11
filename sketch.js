  function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }

  function heuristic(a, b) {
    var d = abs(a.x - b.x) + abs(a.y - b.y);
    return d;
  }


  //Setup Values
  var cols = 100;
  var rows = 100;
  var canH = 600;
  var canW = 600;
  var wallVal = 35;
  
  
  var grid = new Array(cols);
  var openSet = [];
  var closedSet = [];
  var start;
  var end;
  var w, h;
  var path = [];
  var nosolution = false;


  function Spot(i, j) {
    this.start = false;
    this.end = false;
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < (float)(wallVal/100)) {
      this.wall = true;
    }


    this.show = function(col) {
      fill(col);
      if (this.wall) {
        fill(100, 90, 100);
      }
      if(this.start){
        fill(255,255,0);
      }
      if(this.end){
        fill(255, 100, 150);
      }
      noStroke();
      rect(this.x * w, this.y * h, w - 1, h - 1);
    }

    this.addNeighbors = function(grid) {
      if (this.x < cols - 1) {
        this.neighbors.push(grid[this.x + 1][this.y]);

        if (this.y < rows - 1 
        && (!grid[this.x+1][this.y].wall || !grid[this.x][this.y + 1].wall)) {
          this.neighbors.push(grid[this.x + 1][this.y + 1]);
        }
        if (this.y > 0
        && (!grid[this.x + 1][this.y].wall || !grid[this.x][this.y - 1].wall)) {
          this.neighbors.push(grid[this.x + 1][this.y - 1]);
        }

      }


      if (this.x > 0) {
        this.neighbors.push(grid[this.x - 1][this.y]);
        
        if (this.y < rows - 1
        && (!grid[this.x - 1][this.y].wall || !grid[this.x][this.y + 1].wall)) {
          this.neighbors.push(grid[this.x -1][this.y + 1]);
        }
        if (this.y > 0
        && (!grid[this.x - 1][this.y].wall || !grid[this.x][this.y - 1].wall)) {
          this.neighbors.push(grid[this.x - 1][this.y - 1]);
        }
        
      }
      if (this.y < rows - 1) {
        this.neighbors.push(grid[this.x][this.y + 1]);
      }
      if (this.y > 0) {
        this.neighbors.push(grid[this.x][this.y - 1]);
      }

    }


  }

  function setup() {
    createCanvas(canW, canH);
  
    

    w = width / cols;
    h = height / rows;

    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }

    for (i = 0; i < cols; i++) {
      for (j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }

    for (i = 0; i < cols; i++) {
      for (j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }

    

    //start = grid[0][0];
    start = grid[(int)(random(0, cols-1))][(int)(random(0, rows - 1))];
    start.wall = false;
    start.start = true;
    end = grid[(int)(random(0, cols-1))][(int)(random(0, rows - 1))];
    //end = grid[cols - 1][rows - 1];
    end.wall = false;
    end.end = true;


    openSet.push(start);
  }

  function draw() {

    if (openSet.length > 0) {

      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      var current = openSet[winner];

      if (current === end) {

        console.log('DONE!');
        noLoop();

      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + 1;

          var newPath = false;

          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }


        }

      }


    } else {
      nosolution = true;
      console.log('No solution');
      noLoop();
    }

    background(100);

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].show(color(180));
      }
    }

    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(255, 0, 0));
    }

    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0, 255, 0));
    }


    if (!nosolution) {
      path = [];
      var temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
    }


    for (var i = 0; i < path.length; i++) {
      path[i].show(color(0, 0, 255));
    }


  }