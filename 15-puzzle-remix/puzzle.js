const width = 525;
const height = 525;
const length = 4;
const spacing = 5;

const board = $(".board");
const header = $(".header");
const menu = $(".menu");

let boardArray = new Array();

// initialize board
function createBoard() {
  board.width(width);
  board.height(height);
  header.width(width);
  menu.width(width);
}

function addTile() {
  const numTiles = length * length - 1;

  // fill board in order
  for(i = 0; i < numTiles; i += 1) {
    const value = i + 1;

    // create tile and add to board
    const tile = $("<div>" + value + "</div>")
    tile.addClass("tile");
    board.append(tile);

    // get current row + column position of tile
    const row = Math.floor(i/4);
    const column = i % 4;

    // set tile on board
    setTile(tile, row, column, true);
  }
}

function setTile(tile, row, column, static) {
  // set tile width + height
  const tileWidth = (width - (spacing * (length + 1))) / length;
  const tileHeight = (height - (spacing * (length + 1))) / length;
  tile.width(tileWidth);
  tile.height(tileHeight);

  // set tile position
  const x = column * (tile.width() + spacing) + spacing;
  const y = row * (tile.height() + spacing) + spacing;

  if(static) {
    tile.css("left", x);
    tile.css("top", y);
  } else {
    tile.animate({left: x, top: y}, 200);
  }
}

// create random board
function randomArray() {
  const nums = new Array();
  const numTiles = length * length - 1;

  for(i = 0; i < numTiles; i += 1) {
    const value = i + 1;
    nums.push(value);
  }

  let x = nums.length;

  // shuffle array
  while(--x > 0) {
    let k =  Math.floor(Math.random() * (x + 1));
    let temp = nums[k];
    nums[k] = nums[x];
    nums[x] = temp;
  }

  return nums
}

function scrambleBoard() {
  // initialize empty board as an array
  for(r = 0; r < length; r += 1) {
    boardArray.push([]);
  }

  const nums = randomArray();
  const numTiles = nums.length;

  // fill board
  for(i = 0; i < numTiles; i += 1) {
    const value = nums[i];

    // create tile and add to board
    const tile = $("<div>" + value + "</div>")
    tile.addClass("tile");
    board.append(tile);

    // get current row + column position of tile
    const row = Math.floor(i/4);
    const column = i % 4;

    // set tile on board
    setTile(tile, row, column, false);

    // add element to row in boardArray
    boardArray[row].push(value);
  }

  // add 0 to represent empty space in boardArray
  boardArray[length - 1].push(0);

  $(".tile").click(function(e) {
    const currentTile = $(e.currentTarget);
    const currentValue = parseInt(currentTile.text());

    // find indices of current value
    const indices = findIndex(currentValue);
    const row = indices[0];
    const column = indices[1];

    // move tile
    moveTile(currentTile, row, column);
  });
}

function findIndex(value) {
  let endLoop = false;

  for(row = 0; row < length; row += 1) {
    for(column = 0; column < length; column += 1) {
      if(boardArray[row][column] == value) {
        endLoop = true;
        break;
      }
    }
    if(endLoop) {
      break;
    }
  }
  return [row, column];
}

// move any tile in the same row/column as the empty space
function moveTile(tile, row, column) {
  const indices = findIndex(0);
  const zeroRow = indices[0];
  const zeroColumn = indices[1];

  let dx = 0;
  let dy = 0;

  if(column < length && column < zeroColumn && row == zeroRow) {
    dx = Math.abs(column - zeroColumn); // move right
  } else if (column > 0 && column > zeroColumn && row == zeroRow) {
    dx = -(column - zeroColumn); // move left
  } else if (row < length && row < zeroRow && column == zeroColumn) {
    dy = Math.abs(row - zeroRow); // move down
  } else if (row > 0 && row > zeroRow && column == zeroColumn) {
    dy = -(row - zeroRow); // move up
  } else {
    return;
  }

  // update tile values
  const value = boardArray[row][column];
  boardArray[zeroRow][zeroColumn] = value;
  boardArray[row][column] = 0;

  // set tile position
  const x = (column + dx) * (tile.width() + spacing) + spacing;
  const y = (row + dy) * (tile.height() + spacing) + spacing;

  // animate movement on click
  tile.animate({left: x, top: y}, 150);
}

$("#start").click(startGame);

function startGame() {
  // reset board
  board.empty();
  boardArray = [];
  scrambleBoard();
}

createBoard();
addTile();
