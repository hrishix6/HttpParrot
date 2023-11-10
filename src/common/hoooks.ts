import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useState, useEffect } from 'react';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useWindowWidth = () => {
    const [ww, setWW] = useState(window.innerWidth);

    useEffect(() => {
        function resizeEventHandler() {
            setWW(window.innerWidth);
        }
        window.addEventListener("resize", resizeEventHandler);
        return () => {
            window.removeEventListener("resize", resizeEventHandler);
        };

    }, []);

    return ww;
}
