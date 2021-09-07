import distanceBetweenCoordinate from "./distanceBetweenCoordinate";

export default (cordStart, cordEnd, distance) => {
    //Гипотенуза, путь от start до end
    let L = distanceBetweenCoordinate(cordStart, cordEnd);
    
    let vector = {
        x: cordEnd.x - cordStart.x,
        y: cordEnd.y - cordStart.y
    };
    
    const lambda = distance / L;
    
    vector.x *= lambda;
    vector.y *= lambda;
    
    return {
        x: cordStart.x + vector.x,
        y: cordStart.y + vector.y
    };

}