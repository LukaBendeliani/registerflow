import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Image from "../../node_modules/next/image";
import arrowDownSVG from "../../assets/icons/arrow-down.svg"

interface Option {
    title: string;
    value: string;
}

interface SelectProps {
    options: Option[];
    label: string;
    onChange: (value: string) => void;
    initialValue?: Option;
}

export const Select: React.FC<SelectProps> = ({ options, label, initialValue, onChange }) => {
    const [value, setValue] = useState<Option>(initialValue ?? undefined);
    const [isOpen, setOpen] = useState(false);

    const handleSelect = (option: Option) => {
        setValue(option);
        setOpen(false);
        onChange && onChange(option.value);
    }

    const toggleOpen = () => {
        setOpen(prevState => !prevState);
    }

    useEffect(() => {
        onChange && onChange(options[0].value)
    },[])

    return (
        <>
            <div className={styles.wrapper}>
                <p className={styles.label}>{label}</p>
                <div className={`${styles.field} ${isOpen && styles.focused}`} onClick={toggleOpen}>
                    <p>{value?.title || ""}</p>
                    <Image className={isOpen ? styles.arrowUp : styles.arrowDown} src={arrowDownSVG} width={18} height={18} ></Image>
                </div>
                {isOpen && <div className={styles.options}>
                    {options.filter(option => option.value !== value?.value).map((option, key) => {
                        return (
                            <div className={styles.option} onClick={() => handleSelect(option)} key={key}>{option.title}</div>
                        )
                    })}
                </div>}
            </div>
            {isOpen && <div className={styles.overlay} onClick={() => setOpen(false)}></div>}
        </>
    )
}