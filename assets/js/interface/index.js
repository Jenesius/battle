import {canvas} from "../useCanvas";
import gameStorage from "../gameStorage";

const functionArray = [
    {
        title: "mountain",
        src: "https://st3.depositphotos.com/9461386/36064/v/600/depositphotos_360646636-stock-illustration-pixel-fuji-mountain-at-sunset.jpg",
        construction: true,
        function: (e) => {
    
            gameStorage.map.take(e, {
                type: "mountain"
            })
        }
    }
]


class Interface{
    
    
    construction;
    
    constructor() {
    
        this.construction = false;
        
        initialize();
        
    }

}
const interfaceObject = new Interface();
export default interfaceObject;

function initialize(){
    
    const container = document.getElementById("function-panel");
    
    functionArray.forEach(elem => {
        
        const div = document.createElement("div");
        const image = document.createElement("img");
        image.src = elem.src;
        image.alt = elem.title;
        div.appendChild(image);
        
        div.addEventListener("click", () => {
            
            if (elem.construction) {
                interfaceObject.construction = elem.construction;
            }
            
            function listenerDown(){
                canvas.addEventListener("mousemove", elem.function);
    
                canvas.addEventListener("mouseup", listenerUp);
            }
            
            function listenerUp(){
                canvas.removeEventListener("mousedown", listenerDown);
                canvas.removeEventListener("mousemove", elem.function);
                
                /*****/
                canvas.removeEventListener("mouseup", listenerUp);
                interfaceObject.construction = false;
            }
            
            canvas.addEventListener("mousedown", listenerDown);
            

            
            
        });
        
        container.append(div);
    })
    
}

