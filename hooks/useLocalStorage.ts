import { useState } from "react";

export const useLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        const localStorage = window?.localStorage;
        const storedValue = localStorage.getItem(key);
        const [item, setItem] = useState(storedValue)

        const removeItem = () => {
            localStorage.removeItem(key)
            setItem(null)
        };
        const updateItem = (newValue: string) => {
            const stringified = JSON.stringify(newValue)
            localStorage.setItem(key, stringified);
            setItem(stringified)
        };

        return [JSON.parse(item ?? "{}"), updateItem, removeItem]
    }
    return []
}