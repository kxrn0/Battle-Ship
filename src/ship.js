import { to_number } from "./utilities.js";

export default function create_ship(length, orientation, coordinates, name) {
    const segments = new Array(length).fill(1);

    function hit(attackCoordinates) {
        attackCoordinates = to_number(attackCoordinates);
        if ((orientation == "horizontal" && coordinates.y != attackCoordinates.y) ||
            orientation == "vertical" && coordinates.x != attackCoordinates.x)
            return false;

        let startCoordinate, endCoordinate, attackCoodinate;

        if (orientation == "vertical") {
            startCoordinate = coordinates.y;
            attackCoodinate = attackCoordinates.y;
        }
        else if (orientation == "horizontal") {
            startCoordinate = coordinates.x;
            attackCoodinate = attackCoordinates.x;
        }

        endCoordinate = segments.length - 1 + startCoordinate;

        if (startCoordinate <= attackCoodinate &&
            attackCoodinate <= endCoordinate) {
                segments[attackCoodinate - startCoordinate] = 0;
                return true;
            }
        return false;
    }

    function is_sunk() {
        return !segments.reduce((total, seg) => total + seg, 0);
    }

    function get_coordinates() {
        return to_number(coordinates);
    }

    function get_name() {
        return name;
    }

    function get_segs() {
        return segments.slice();
    }

    function get_length() {
        return length;
    }

    return { hit, is_sunk, get_coordinates, get_name, get_segs, get_length };
}