import {createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";


interface IAnimalGameContextState {

}

interface IAnimalGameContextProps extends PropsWithChildren {
    onDragEnd?: (dragElem: Element, position: IPoint, offset: IPoint, avatar: Element, dropElem: Element) => void;
    onDragCancel?: (dragElem: Element, position: IPoint, offset: IPoint, avatar: Element) => void;
}

const DEFAULT_ANIMAL_GAME_CONTEXT_STATE: IAnimalGameContextState = {

}

const AnimalGameContext = createContext<IAnimalGameContextState>(DEFAULT_ANIMAL_GAME_CONTEXT_STATE)

export interface IPoint {
    x: number;
    y: number;
}

type ElementWithRollback = Element & {rollback?: () => void}

function createAvatar(e: MouseEvent, target: ElementWithRollback) {
    const avatar: ElementWithRollback = target;
    const oldValues = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: (avatar as HTMLElement).style.position || '',
        left: (avatar as HTMLElement).style.left || '',
        top: (avatar as HTMLElement).style.top || '',
        zIndex: (avatar as HTMLElement).style.zIndex || ''
    };

    // функция для отмены переноса
    avatar.rollback = () => {
        oldValues.parent?.insertBefore(avatar, oldValues.nextSibling);
        (avatar as HTMLElement).style.position = oldValues.position;
        (avatar as HTMLElement).style.left = oldValues.left;
        (avatar as HTMLElement).style.top = oldValues.top;
        (avatar as HTMLElement).style.zIndex = oldValues.zIndex
    };

    return avatar;
}

function getCoords(element: Element) { // кроме IE8-
    const box = element.getBoundingClientRect();

    return {
        top: box.top,
        left: box.left,
    };

}

export const AnimalGameProvider: FC<IAnimalGameContextProps> = ({children, onDragEnd, onDragCancel}) => {
    const [target, setTarget] = useState<Element>()
    const [avatar, setAvatar] = useState<ElementWithRollback>()
    const [localOffset, setLocalOffset] = useState<IPoint>({x: 0, y: 0})
    const [currentPosition, setCurrentPosition] = useState<IPoint>({x: 0, y: 0})

    const onMouseDown = useCallback((event: MouseEvent) => {

        var elem = (event.target as HTMLElement).closest('.draggable');
        if (!elem) return;

        setTarget(elem)
        setCurrentPosition({x: event.pageX, y: event.pageY})

        return false;
    }, [])

    const onMouseMove = useCallback((event: MouseEvent) => {
        if (!target) return;

        if (!avatar) {
            const moveX = event.pageX - currentPosition.x;
            const moveY = event.pageY - currentPosition.y;

            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                return;
            }

            const av = createAvatar(event, target)

            if (!av) {
                setAvatar(undefined)
                setTarget(undefined)
                return;
            }
            setAvatar(av)

            const coords = getCoords(av);
            setLocalOffset({x: currentPosition.x - coords.left, y: currentPosition.y - coords.top})

            startDrag(event);
        }

        if(Boolean(avatar)) {
            (avatar as HTMLElement).style.left = event.pageX - localOffset.x + 'px';
            (avatar as HTMLElement).style.top = event.pageY - localOffset.y + 'px';
        }

        return false;
    }, [target, avatar, localOffset, currentPosition])

    const onMouseUp = useCallback((event: MouseEvent) => {
        if (avatar) { // если перенос идет
            finishDrag(event);
        }
        setAvatar(undefined)
        setTarget(undefined)
    },[avatar])

    const finishDrag = (e: MouseEvent) => {
        const dropElem = findDroppable(e);
        if(target && avatar) {
            if (!dropElem) {
                onDragCancel?.(target, currentPosition, localOffset, avatar);
            } else {
                onDragEnd?.(target, currentPosition, localOffset, avatar, dropElem);
            }
        }
    }

    const startDrag = (e:MouseEvent) => {
        if(avatar) {
            document.body.appendChild(avatar as HTMLElement);
            (avatar as HTMLElement).style.zIndex = "9999";
            (avatar as HTMLElement).style.position = 'absolute';
        }
    }

    const findDroppable = (event: MouseEvent) => {
        (avatar as HTMLElement).hidden = true;

        const elem = document.elementFromPoint(event.clientX, event.clientY);

        (avatar as HTMLElement).hidden = false;

        if (elem == null) {
            return null;
        }

        return elem.closest('.droppable');
    }

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousedown", onMouseDown);
        return () => {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousedown", onMouseDown);
        }
    }, [onMouseMove, onMouseUp, onMouseDown])

    const value = useMemo(() => ({

    }), [])

    return <AnimalGameContext.Provider value={value}>
        {children}
    </AnimalGameContext.Provider>
}