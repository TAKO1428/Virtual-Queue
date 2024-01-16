var numeroCeldas = 0;
var visitedCells = 0;
let dimension10 = document.getElementById('10')
let dimension15 = document.getElementById('15')
let dimension20 = document.getElementById('20')

class Wall {
  constructor(options = {}) {
    this.leftCell = options.leftCell || null;
    this.rightCell = options.rightCell || null;
    this.topCell = options.topCell || null;
    this.bottomCell = options.bottomCell || null;
    this.demolished = false;
  }
  demolish() {
    this.demolished = true;
  }
}

class Cell {
  constructor(options = {}) {
    this.muroIzq = options.muroIzq || null;
    this.muroDer = options.muroDer || null;
    this.topWall = options.topWall || null;
    this.bottomWall = options.bottomWall || null;
    this.visited = false;
    numeroCeldas++;
  }
  
  visit() {
    this.visited = true;
    visitedCells++;
  }
  
  hasUnvisitedNeighbours () {
    if (this.muroIzq && this.muroIzq.leftCell && !this.muroIzq.leftCell.visited) return true;
    if (this.muroDer && this.muroDer.rightCell && !this.muroDer.rightCell.visited) return true;
    if (this.topWall && this.topWall.topCell && !this.topWall.topCell.visited) return true;
    if (this.bottomWall && this.bottomWall.bottomCell && !this.bottomWall.bottomCell.visited) return true;
    return false;
  }
  
  getUnvisitedNeighbours () {
    let result = [];
    if (this.muroIzq && this.muroIzq.leftCell && !this.muroIzq.leftCell.visited) {
      result.push({cell: this.muroIzq.leftCell, wall: this.muroIzq});
    }
    if (this.muroDer && this.muroDer.rightCell && !this.muroDer.rightCell.visited) {
      result.push({cell: this.muroDer.rightCell, wall: this.muroDer});
    }
    if (this.topWall && this.topWall.topCell && !this.topWall.topCell.visited) {
      result.push({cell: this.topWall.topCell, wall: this.topWall});
    }
    if (this.bottomWall && this.bottomWall.bottomCell && !this.bottomWall.bottomCell.visited) {
        result.push({cell: this.bottomWall.bottomCell, wall: this.bottomWall});
    }
    return result;
  }
  
  getRandomUnvisitedNeighbour () {
    let unvisitedNeighbours = this.getUnvisitedNeighbours()
    return unvisitedNeighbours[Math.floor(Math.random()*unvisitedNeighbours.length)]
  }
}

var cellMatrix = [];

function iniciarLab(celdasHorizontales, celdasVerticales) {
  for (let i = 0; i < celdasVerticales; i++) {
    cellMatrix[i] = [];
    for (let j = 0; j < celdasHorizontales; j++) {
      cellMatrix[i][j] = new Cell();
    } 
  }

  for (let i = 0; i < celdasVerticales; i++) {
    for (let j = 0; j < (celdasHorizontales - 1); j++) {
    let wall = new Wall();
    wall.leftCell = cellMatrix[i][j];
    wall.rightCell = cellMatrix[i][j + 1];
    cellMatrix[i][j].muroDer = wall;
    cellMatrix[i][j + 1].muroIzq = wall;

    if (j === 0) {
      cellMatrix[i][j].muroIzq = new Wall();
      cellMatrix[i][j].muroIzq.rightCell = cellMatrix[i][j]; 
    }

    if (i === celdasVerticales - 1) {
      cellMatrix[i][j].bottomWall = new Wall();
      cellMatrix[i][j].bottomWall.topCell = cellMatrix[i][j];
    }

    }
  }
  
  for (let i = 0; i < (celdasVerticales - 1); i++) {
    for (let j = 0; j < celdasHorizontales; j++) {
      let wall = new Wall();
      wall.topCell = cellMatrix[i][j];
      wall.bottomCell = cellMatrix[i + 1][j];
      cellMatrix[i][j].bottomWall = wall;
      cellMatrix[i + 1][j].topWall = wall;
      
      if (i === 0) {
        cellMatrix[i][j].topWall = new Wall();
        cellMatrix[i][j].topWall.bottomCell = cellMatrix[i][j];
        if (j === 0) cellMatrix[i][j].topWall.demolish();
      }
      
      if (j === celdasHorizontales - 1) {
        cellMatrix[i][j].muroDer = new Wall();
        cellMatrix[i][j].muroDer.leftCell = cellMatrix[i][j];
      }
      
    } 
  }
}

function generateMaze(startingCell) {
  const cellStack = [];
  let currentCell = startingCell;
  let neighbour = null;
  startingCell.visit();
  for (let i = 0; visitedCells <= numeroCeldas; i++) {
    if (i > 10000) break;
    if (currentCell.hasUnvisitedNeighbours()) {
      neighbour = currentCell.getRandomUnvisitedNeighbour();
      cellStack.push(currentCell);
      neighbour.wall.demolish();
      currentCell = neighbour.cell;
      currentCell.visit();
    } else {
      if (cellStack.length) currentCell = cellStack.pop();  
    }
  }
}

function renderWithCssBorder(BOX_WIDTH, BOX_HEIGHT, cellMatrix, htmlParent) {
  const BORDER_SIZE = 1
  htmlParent.style.display = 'block'
  htmlParent.style.position = 'relative'
for (let i = 0; i < cellMatrix.length; i++) {
    for (let j = 0; j < cellMatrix[i].length; j++) {
        let box = document.createElement("div");
        box.style.position = 'absolute'
        box.style.top = (BOX_HEIGHT * i) + "px"
        box.style.left = (BOX_WIDTH * j) + "px"
        box.style.display = 'block'
        box.style.width = BOX_WIDTH + "px"
        box.style.height = BOX_HEIGHT + "px"
        const EMPTY_WALL = BORDER_SIZE + "px solid #fff;"
        const SOLID_WALL = BORDER_SIZE + "px solid #333"
        if (cellMatrix[i][j].muroIzq) box.style.borderLeft = cellMatrix[i][j].muroIzq.demolished ? EMPTY_WALL : SOLID_WALL;
        if (cellMatrix[i][j].muroDer) box.style.borderRight = cellMatrix[i][j].muroDer.demolished ? EMPTY_WALL : SOLID_WALL;
        if (cellMatrix[i][j].topWall) box.style.borderTop = cellMatrix[i][j].topWall.demolished ? EMPTY_WALL : SOLID_WALL;
        if (cellMatrix[i][j].bottomWall) box.style.borderBottom = cellMatrix[i][j].bottomWall.demolished ? EMPTY_WALL : SOLID_WALL;
        htmlParent.appendChild(box);
    }
  }
}

var tablero = document.getElementById("maze");

function generateAndPrint(celdasHorizontales, celdasVerticales, boxWidth, boxHeight) {
    numeroCeldas = 0;
    visitedCells = 0;
    cellMatrix = [];
    iniciarLab(celdasHorizontales, celdasVerticales);
    generateMaze(cellMatrix[0][0]);
    tablero.innerHTML = "";
    renderWithCssBorder(boxWidth, boxHeight, cellMatrix, tablero);
    if (dimension10.checked) {
        tablero.parentElement.style.width = "420px"
        tablero.parentElement.style.height = "420px"
    } else if (dimension15.checked) {
        tablero.parentElement.style.width = "430px"
        tablero.parentElement.style.height = "430px"
    } else if (dimension20.checked) {
        tablero.parentElement.style.width = "510px"
        tablero.parentElement.style.height = "510px"
    }
}

// FUNCION CREAR LABERINTO 
function crearLaberinto () {
  if (dimension10.checked) {
    let cellHeight = 30;
    let cellWidth  = 30;
    let celdasHorizontales = 13;
    let celdasVerticales = 13;
    generateAndPrint(celdasHorizontales, celdasVerticales, cellWidth, cellHeight);
  } else if (dimension15.checked) {
    let cellHeight = 20;
    let cellWidth  = 20;
    let celdasHorizontales = 20;
    let celdasVerticales = 20;
    generateAndPrint(celdasHorizontales, celdasVerticales, cellWidth, cellHeight);
  } else if (dimension20.checked) {
    let cellHeight = 12;
    let cellWidth  = 12;
    let celdasHorizontales = 40;
    let celdasVerticales = 40;
    generateAndPrint(celdasHorizontales, celdasVerticales, cellWidth, cellHeight);
  }
}

// AL HACER CLICK EN GENERAR LABERINTO
document.getElementById('botonGenerarLaberinto').addEventListener('click', function(event){
    event.preventDefault();

    document.getElementById('response').style.display = "block";
    document.getElementById('app').style.display = "none";
    crearLaberinto();
    
})
