import { ChangeEvent, useEffect, useRef, useState } from "react";
import { isValidImage } from "../../helpers/validations";
import Image from "../../node_modules/next/image";
import styles from "./index.module.css";
import uploadSVG from "../../assets/icons/upload.svg";

interface FileUploadProps {
    onChange: (file: string) => void;
    initialSource: string | undefined | ArrayBuffer;
}

export const FileUpload: React.FC<FileUploadProps> = ({ initialSource, onChange }) => {
    const inputRef = useRef(null);
    const [imageSource, setImageSource] = useState<string | ArrayBuffer | undefined>(initialSource);
    const handleClick = () => {
        inputRef.current.click()
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (file?.type && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => setImageSource(event.target.result)
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        onChange && onChange(`${imageSource}`)
    }, [imageSource])

    return (
        <div className={styles.wrapper} onClick={handleClick}>
            <Image
                src={isValidImage(imageSource) ? imageSource : uploadSVG}
                layout={isValidImage(imageSource) ? "fill" : "intrinsic"}
                objectFit="contain"
                width={75}
            />
            {!isValidImage(imageSource) &&
                <>
                    <p className={styles.desc}>Upload photo of your car</p>
                    <p className={styles.note}>.jpg .jpeg .png .webp</p>
                </>
            }
            <input onChange={handleChange} ref={inputRef} className={styles.input} type="file" accept=".jpg,.jpeg,.png,.webp" />
        </div>
    )
}
