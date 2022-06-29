import create_ship from "./ship.js";
import { to_number } from "./utilities.js";

export default function create_board(shipBlueprints, width, height) {
    /**
     * a ship looks like this :
     *  { coordinates : {x : 0, y : 0}, orientation : "vertical", length: 4, name: "byme" }
     */
    const ships = [];
    const cells = new Array(width * height).fill("hidden");

    const states = {
        hidden: "hidden",
        wrecked: "wrecked",
        tried: "tried"
    };

    for (let ship of shipBlueprints)
        ships.push(create_ship(ship.length, ship.orientation, ship.coordinates, ship.name));

    function all_is_lost() {
        return ships.every(ship => ship.is_sunk());
    }

    function is_cell_hidden(coordinates) {
        coordinates = to_number(coordinates);
        if (cells[coordinates.x + coordinates.y * width] == states.hidden)
            return true;
        return false;
    }

    function receive_attack(attackCoordinates) {
        attackCoordinates = to_number(attackCoordinates);
        if (ships.some(ship => ship.hit(attackCoordinates))) {
            cells[attackCoordinates.x + attackCoordinates.y * width] = states.wrecked;
            return true;
        }
        else {
            cells[attackCoordinates.x + attackCoordinates.y * width] = states.tried;
            return false
        }
    }

    function get_cells() {
        return cells.slice();
    }

    function get_dimensions() {
        return { width, height };
    }

    return { all_is_lost, receive_attack, is_cell_hidden, get_cells, get_dimensions};
}