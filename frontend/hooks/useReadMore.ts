import React, {useEffect, useState} from 'react';

export function useReadMore (text = "", clipLength = 50, initialState = false): [string, () => void, boolean] {
    const [readMore, setReadMore] = useState<boolean>(initialState);
    const [displayText, setDisplayText] = useState<string>("");

    useEffect(() => {
        if(!text.length) return;

        if(text.length > clipLength) {
            setDisplayText(clipText());
        } else {
            setDisplayText(text);
        }
    }, [text])

    useEffect(() => {
        if(readMore) {
            setDisplayText(text);
        } else {
            setDisplayText(clipText());
        }
    }, [readMore])

    const clipText = () => text.substring(0, clipLength) + "..."

    const toggle = () => setReadMore(!readMore);

    return [displayText, toggle, readMore]

}

