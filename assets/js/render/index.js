import {ctx} from "../useCanvas";
import Size from "../class/size-class";
import config from "../config";
import Map from "../map/index";

export default function Render(unit) {

    const size = unit.size;
    const coordinate = unit.coordinate;

    /**
     * Function returns coordinates of the upper left corner
     * @param cord
     * @param size
     */
    function getStartCoordinate(cord, size) {
        return {
            x: cord.x - size.w / 2,
            y: cord.y - size.h / 2
        }
    }

    /**
     * Function draws the object unit. Object includes two fields: coordinate(x,y) and size(w,h).
     * */
    function draw(){
        const tmpCoordinate = getStartCoordinate(coordinate, size);

        ctx.fillStyle = 'blue';
        ctx.fillRect(tmpCoordinate.x, tmpCoordinate.y, size.w, size.h);
    }


    /**
     * Function draws select stroke around the unit
     * */
    function select(){
        const selectSize = new Size(size.w + config.selectUnit.margin * 2, size.h + config.selectUnit.margin * 2);

        const tmpCoordinate = getStartCoordinate(coordinate, selectSize);

        ctx.strokeStyle = config.selectUnit.color;
        ctx.lineWidth   = config.selectUnit.width;
        ctx.strokeRect(tmpCoordinate.x, tmpCoordinate.y, selectSize.w, selectSize.h);

    }
    
    /**
     *
     * */
    function path(){
        if (!unit.moveConfig) return;
    
        const path = unit.moveConfig.path;
        path.forEach(cell => {
            ctx.fillStyle = 'rgba(134,163,212,0.55)';
        
            const {x,y} = Map.translateCell(cell);
        
            ctx.fillRect(x,y, config.mapBlock, config.mapBlock );
        })
    }
    
    function pathEndPoint(){
        if (!unit.moveConfig) return;
    
        const path = unit.moveConfig.path;
        if (path.length) {
            const lastCellCoordinate = Map.translateCell(path[0]);
            ctx.strokeStyle = "#ffcf00";
            ctx.strokeRect(lastCellCoordinate.x, lastCellCoordinate.y, config.mapBlock, config.mapBlock);
        }
    }

    return {
        draw,
        select,
        pathEndPoint,
        path
    }

}