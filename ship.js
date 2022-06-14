export default function create_ship(length, orientation, coordinates, name) {
    const segments = new Array(length).fill(1);

    function hit(attack) {
        console.log(orientation);
        console.log(attack);
        segments[0] = 0;
    }

    function is_sunk() {
        return !segments.reduce((total, seg) => total + seg, 0);
    }

    function get_coordinates() {
        return { x: coordinates.x, y: coordinates.y };
    }

    function get_name() {
        return name;
    }

    return { hit, is_sunk, get_coordinates, get_name };
}

//module.exports = create_ship;