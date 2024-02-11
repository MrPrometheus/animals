import React, {FC, forwardRef, PropsWithChildren, ReactHTMLElement} from "react";

interface IAnimalProps extends PropsWithChildren {
    className: string
    id: string
}

export const Animal: FC<IAnimalProps> = ({children, className, id}) => {
    return <div className={className} id={id}>
        {children}
    </div>
}

export default Animal