import create_ship from "./ship.js";

export default function create_board(shipBlueprints) {
    /**
     * a ship looks like this :
     *  { coordinates : {x : 0, y : 0}, orientation : "vertical", length: 4, name: "byme" }
     */
    const ships = [];

    for (let ship of shipBlueprints)
        ships.push(create_ship(ship));

    function all_is_lost() {
        return ships.every(ship => ship.is_sunk());
    }

    function receive_attack(attackCoordinates) {
        return attackCoordinates;
    }

    return { all_is_lost };
}
