import React, {CSSProperties, FC, forwardRef} from "react";

interface IHabitatProps {
    backgroundColor: CSSProperties["backgroundColor"];
    width: CSSProperties["width"];
    height: CSSProperties["height"];
}

export const Habitat = forwardRef<HTMLDivElement, IHabitatProps>(({height, width, backgroundColor}, ref) => {
    return <div ref={ref} style={{height, width, backgroundColor}} />
})

export default Habitat