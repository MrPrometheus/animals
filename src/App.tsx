import React, {useEffect, useState} from 'react';
import './App.css';
import AnimalGame from "./components/AnimalGame/AnimalGame.component";
import {AnimalGameProvider, IPoint} from "./components/AnimalGame/AnimalGame.provider";
import {Simulate} from "react-dom/test-utils";
import drop = Simulate.drop;

const obj: {[key: string]: string} = {
    forest: "deer",
    hils: "mountainSheep",
    ocean: "octopus",
}

function App() {
    const [result, setResult] = useState<{[key: string]: boolean}>({})

    const onDragEnd = (dragElem: Element, position: IPoint, offset: IPoint, avatar: Element, dropElem: Element) => {
        if(obj[dropElem.id] === dragElem.id) {
            setResult((prev) => ({...prev, [dragElem.id]: true}))
        } else {
            setResult((prev) => ({...prev, [dragElem.id]: false}))
        }
    }

    const onDragCancel = (dragElem: Element) => {
        setResult((prev) => ({...prev, [dragElem.id]: false}))
    }

    useEffect(() => {
        let count = 0
        for (let i in result) {
            if(result[i]) count++
        }
        if(count === 3) alert("Победа")
    }, [result]);

  return (
    <div className="App">
        <AnimalGameProvider onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
            <AnimalGame />
        </AnimalGameProvider>
    </div>
  );
}

export default App;
