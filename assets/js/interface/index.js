import {canvas} from "../useCanvas";
import gameStorage from "../gameStorage";

const functionArray = [
    {
        title: "mountain",
        src: "https://st3.depositphotos.com/9461386/36064/v/600/depositphotos_360646636-stock-illustration-pixel-fuji-mountain-at-sunset.jpg",
        

        activate: () => {
            
            
            
            canvas.addEventListener("mousedown", e => {
    
                function addMountain(e){
                    gameStorage.map.take(e, {
                        type: "mountain"
                    })
                }
                
                canvas.addEventListener("mousemove", addMountain);
                

                
                canvas.addEventListener("mouseup", () => {
    
                    canvas.removeEventListener("mousemove", addMountain);
                    
                })
                
            })
            
        }
    }
]


export function initialize(){
    
    const container = document.getElementById("function-panel");
    
    functionArray.forEach(elem => {
        
        const div = document.createElement("div");
        const image = document.createElement("img");
        image.src = elem.src;
        image.alt = elem.title;
        div.appendChild(image);
        
        div.addEventListener("click", elem.activate);
        
        container.append(div);
    })
    
}