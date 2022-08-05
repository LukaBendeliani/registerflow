import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useId, useState } from "react";
import styles from "./index.module.css";

interface InputProps {
    type?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    maxLength?: number;
    wrapperClassName?: string;
    formatText?: (value: string) => string;
    onChange?: (value: string) => void;
}

export const Input: React.FC<InputProps> = (props) => {
    const { formatText, onChange, value: initialValue, wrapperClassName, label, placeholder, maxLength, type } = props
    const [value, setValue] = useState<string>(initialValue || "");
    const id = useId()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = formatText ? formatText(e.target.value) : e.target.value;
        setValue(newValue);
        onChange && onChange(newValue);
    }

    return (
        <div className={styles.inputContainer}>
            {label && <label className={styles.label} htmlFor={id}>{label}</label>}
            <div className={`${styles.inputWrapper} ${wrapperClassName}`}>
                <input
                    id={id}
                    type={type}
                    value={value}
                    maxLength={maxLength}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={placeholder}
                    autoComplete={id}
                />
            </div>
        </div>
    )
}
