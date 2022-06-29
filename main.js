import create_board from "./board.js";
import create_player from "./player.js";
import { distance, segments } from "./utilities.js";

const dream = document.querySelector(".placement-screen .segments");
const modal = document.querySelector(".modal");
const playAgain = modal.querySelector(".play-again");
const nameScreen = document.querySelector(".name-screen");
const formName = nameScreen.querySelector(".name-form");
const orientationButton = document.querySelector(".rotate");
const currentName = document.querySelector(".placement-screen .current-ship");
const placement = document.querySelector(".placement-screen");
const grid = placement.querySelector(".grid");
const boardWidth = 10;
const boardHeight = 10;
const playerDom = document.querySelector(".player");
const playerBoardDom = playerDom.querySelector(".board");
const aiDom = document.querySelector(".ai");
const aiBoardDom = aiDom.querySelector(".board");
const shipes = [
    {
        length: 5,
        name: "Carrier",
        visible: true
    },
    {
        length: 4,
        name: "Battleship",
        visible: true
    },
    {
        length: 3,
        name: "Cruiser",
        visible: true
    },
    {
        length: 3,
        name: "Submarine",
        visible: true
    },
    {
        length: 2,
        name: "Patrol Boat",
        visible: true
    }
];
const aiCover = document.querySelector(".off-turn");
let player;
let aiShips;
let ai;
let playerCellsDom;
let aiCellsDom;
let playerName;
let currentPositionalIndex;

currentPositionalIndex = 0;

playAgain.addEventListener("click", () => {
    currentPositionalIndex = 0;
    populate_placement_grid(grid, boardWidth, boardHeight);
    currentName.innerText = shipes[0].name;
    modal.classList.remove("shown");
    modal.classList.add("not-shown");
    nameScreen.classList.remove("not-shown");
    nameScreen.classList.add("shown");
    placement.classList.remove("not-shown");
    placement.classList.add("shown");

    dream.innerHTML = '';
    for (let i = 0; i < shipes[0].length; i++) {
        const segment = document.createElement("div");

        segment.classList.add("segment");
        dream.append(segment);
    }
});

formName.addEventListener("submit", event => {
    event.preventDefault();

    playerName = formName["player-name"].value ? formName["player-name"].value : "player_01";
    nameScreen.classList.remove("shown");
    nameScreen.classList.add("not-shown");
});

populate_placement_grid(grid, boardWidth, boardHeight);

function toggle_state() {
    playerDom.classList.toggle("in-turn");
    aiDom.classList.toggle("in-turn");
}

function game_over(player) {
    const message = modal.querySelector(".message");

    modal.classList.toggle("shown");
    modal.classList.toggle("not-shown");
    message.innerText = `${player.get_name()} is the Victor!`
}

function populate_dom_board(domBoard, ships, width, height) {
    const cells = new Array(width * height);

    domBoard.querySelectorAll(".cell").forEach(cell => domBoard.removeChild(cell));

    for (let i = 0; i < cells.length; i++) {
        const cell = document.createElement("div");

        cell.classList.add("active");
        cell.classList.add("cell");
        cells[i] = cell;
    }

    if (ships[0].visible)
        for (let ship of ships) {
            const segments = [];
            let end;

            if (ship.orientation == "vertical") {
                end = ship.length - 1 + ship.coordinates.y;
                for (let y = ship.coordinates.y; y <= end; y++)
                    segments.push({ x: ship.coordinates.x, y });
            }
            else {
                end = ship.length - 1 + ship.coordinates.x;
                for (let x = ship.coordinates.x; x <= end; x++)
                    segments.push({ x, y: ship.coordinates.y });
            }

            segments.forEach(seg => cells[seg.x + seg.y * width].classList.add("visible"));
        }
    else {
        cells.forEach(cell => cell.classList.add("enemy"));
    }

    for (let x = 0; x < width; x++)
        for (let y = 0; y < height; y++) {
            cells[x + y * width].setAttribute("data-x", x);
            cells[x + y * width].setAttribute("data-y", y);
        }

    cells.forEach(cell => domBoard.append(cell));
    return cells;
}

function is_valid_position(coordinates) {
    const currentShip = shipes[currentPositionalIndex];
    const outerEnd = (orientationButton.checked ? coordinates.y : coordinates.x) + currentShip.length - 1;
    const limit = orientationButton.checked ? boardWidth : boardHeight;
    let theseSegments;

    if (outerEnd >= limit)
        return false;

    theseSegments = segments(Object.assign({}, currentShip, { coordinates, orientation: orientationButton.checked ? "vertical" : "horizontal" }));

    for (let i = 0; i <= currentPositionalIndex - 1; i++) {
        const otherSegments = segments(shipes[i]);

        if (theseSegments.some(segment => otherSegments.some(otherSegment => distance(segment, otherSegment) < 2)))
            return false
    }
    return true;
}

function populate_placement_grid(grid, width, height) {
    grid.innerHTML = '';
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            const cell = document.createElement("div");

            cell.classList.add("cell-grid");

            cell.setAttribute("data-x", x);
            cell.setAttribute("data-y", y);

            cell.addEventListener("click", () => {
                const coordinates = { x: Number(cell.dataset.x), y: Number(cell.dataset.y) };
                const ship = shipes[currentPositionalIndex];

                if (is_valid_position(coordinates)) {
                    const allCells = document.querySelectorAll(".cell-grid");

                    ship.orientation = orientationButton.checked ? "vertical" : "horizontal";
                    ship.coordinates = coordinates;

                    if (orientationButton.checked) {
                        const end = coordinates.y + ship.length - 1;

                        for (let y = coordinates.y; y <= end; y++)
                            allCells[coordinates.x + y * width].classList.add("selected-cell");
                    }
                    else {
                        const end = coordinates.x + ship.length - 1;

                        for (let x = coordinates.x; x <= end; x++)
                            allCells[x + coordinates.y * width].classList.add("selected-cell");
                    }

                    currentPositionalIndex++;
                    if (currentPositionalIndex < 5) {
                        currentName.innerText = shipes[currentPositionalIndex].name;
                        dream.innerHTML = '';
                        for (let i = 0; i < shipes[currentPositionalIndex].length; i++) {
                            const segment = document.createElement("div");
        
                            segment.classList.add("segment");
                            dream.append(segment);
                        }
                    }
                    else {
                        const playerTag = document.querySelector(".game-screen .player-name");

                        placement.classList.remove("shown");
                        placement.classList.add("not-shown");
                        playerTag.innerText = playerName;
                        player = create_player(create_board(shipes, boardWidth, boardHeight), playerName);
                        aiShips = player.create_random_board(boardWidth, boardHeight);
                        ai = create_player(create_board(aiShips, boardWidth, boardHeight), "愛");
                        playerCellsDom = populate_dom_board(playerBoardDom, shipes, boardWidth, boardHeight);
                        aiCellsDom = populate_dom_board(aiBoardDom, aiShips, boardWidth, boardHeight);

                        aiCellsDom.forEach(cell => {
                            cell.addEventListener("click", () => {
                                const x = cell.dataset.x;
                                const y = cell.dataset.y;
                                const state = ai.get_board().is_cell_hidden({ x, y });
                                if (!state)
                                    return;
                        
                                const result = ai.receive_attack({ x, y });
                        
                                if (result)
                                    cell.classList.add("wrecked-cell");
                                else
                                    cell.classList.add("tried-cell");
                        
                                if (ai.lost())
                                    game_over(player);
                                else {
                                    const time = ~~(Math.random() * 500 + 500);
                        
                                    aiCover.classList.toggle("hidden");
                                    toggle_state();
                        
                                    setTimeout(() => {
                                        const attack = ai.random_attack(player.get_board());
                                        const playerCell = playerCellsDom[attack.coordinates.x + attack.coordinates.y * boardWidth];
                        
                                        if (attack.result) {
                                            playerCell.classList.add("wrecked-cell");
                                        }
                                        else {
                                            playerCell.classList.add("tried-cell");
                                        }
                        
                                        if (player.lost())
                                            game_over(ai);
                        
                                        aiCover.classList.toggle("hidden");
                                        toggle_state();
                        
                                    }, time);
                                }
                            })
                        });
                    }
                }
            });

            cell.addEventListener("mouseover", () => {
                const ship = shipes[currentPositionalIndex];
                const coordinates = { x: Number(cell.dataset.x), y: Number(cell.dataset.y) };
                const end = (orientationButton.checked ? coordinates.y : coordinates.x) + ship.length - 1;
                const limit = orientationButton.checked ? height : width;
                const allCells = document.querySelectorAll(".cell-grid");
                const currentCells = [];

                if (end < limit && is_valid_position(coordinates)) {
                    if (orientationButton.checked) {
                        for (let y = coordinates.y; y <= end; y++)
                            currentCells.push(allCells[coordinates.x + y * width]);
                    }
                    else {
                        for (let x = coordinates.x; x <= end; x++)
                            currentCells.push(allCells[x + coordinates.y * width]);
                    }
                    currentCells.forEach(validCell => validCell.classList.add("valid-cell"));
                }
                else {
                    if (orientationButton.checked) {
                        for (let y = coordinates.y; y <= Math.min(end, height - 1); y++)
                            currentCells.push(allCells[coordinates.x + y * width]);
                    }
                    else {
                        for (let x = coordinates.x; x <= Math.min(end, width - 1); x++)
                            currentCells.push(allCells[x + coordinates.y * width]);
                    }
                    currentCells.forEach(validCell => validCell.classList.add("invalid-cell"));
                }
            });

            cell.addEventListener("mouseout", () => {
                document.querySelectorAll(".cell-grid").forEach(cell => {
                    cell.classList.remove("valid-cell");
                    cell.classList.remove("invalid-cell");
                });
            });

            grid.append(cell);
        }
}