import React, {useEffect, useRef} from "react";
import Animal from "./components/Animal/Animal.component";
import {ReactComponent as DeerIcon} from "./components/Animal/assets/deer.svg";
import {ReactComponent as MountainSheepIcon} from "./components/Animal/assets/mountainSheep.svg";
import {ReactComponent as OctopusIcon} from "./components/Animal/assets/octopus.svg";
import "./AnimalGame.css"

export const AnimalGame = () => {
    return <div>
        <div id="forest" className="droppable forest">Лес</div>
        <div id="ocean" className="droppable ocean">Океан</div>
        <div id="hils" className="droppable hils">Холмы</div>
        <Animal id="deer" className="draggable"><DeerIcon className="icon"/></Animal>
        <Animal id="mountainSheep" className="draggable"><MountainSheepIcon  className="icon"/></Animal>
        <Animal id="octopus" className="draggable"><OctopusIcon  className="icon"/></Animal>
    </div>
}

export default AnimalGame;