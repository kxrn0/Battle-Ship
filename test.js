
function segments(blue) {
    let segments = [];

    if (blue.orientation == "vertical")
        segments = make_interval(blue.coordinates.y, blue.coordinates.y + blue.length - 1).map(number => { return { x: blue.coordinates.x, y: number } });
    else if (blue.orientation == "horizontal")
        segments = make_interval(blue.coordinates.x, blue.coordinates.x + blue.length - 1).map(number => { return { x: number, y: blue.coordinates.y } });
    return segments;
}

function make_interval(start, end) {
    const interval = [];

    for (let i = start; i <= end; i++)
        interval.push(i);
    return interval;
}

let blue = { coordinates: { x: 2, y: 2 }, length: 5, orientation: "horizontal" };

console.log(segments(blue));