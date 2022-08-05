import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import styles from "./index.module.css";

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    styletype?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = (props) => {
    const { styletype } = props;
    return (
        <button
            className={`${styles.button} ${styletype === "secondary" ? styles.secondaryButton : styles.primaryButton}`}
            {...props}
        />
    )
}