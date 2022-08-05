import React, { useEffect, useState } from "react"
import { Button, Input, Select, FileUpload } from "../components/index"
import { formatCardCode } from "../helpers/formatCardCode";
import { formatCardExpiration } from "../helpers/formatCardExpiration";
import { isCardHolder, isCardNumber, isCVV, isEmail, isExpDate, isPassword, isValidImage } from "../helpers/validations";
import { useLocalStorage } from "../hooks/useLocalStorage";
import styles from "./index.module.css"

const options = [{
  title: "BMW",
  value: "bmw"
}, {
  title: "Mercedes",
  value: "mercedes"
}, {
  title: "Tesla",
  value: "tesla"
}]

const INCORRECT_EMAIL = "Please make sure your email is correct"
const INCORRECT_PASSWORD = "Password should be at least 8 characters, one number and one capital letter"
const INCORRECT_CARD_NUMBER = "Card number must consist of 16 numbers and only contain numbers"
const INCORRECT_CARD_HOLDER = "Card holder name must be more than 4 characters"
const INCORRECT_CVV = "CVV must be 3 characters long"
const INCORRECT_EXP_DATE = "Your card is either expired or date format is incorrect"
const INCORRECT_CAR_MODEL = "Please select car model"
const INCORRECT_IMAGE = "Please upload photo of your car(.jpg .jpeg .png or .webp)"

export default function Home() {
  const [step, setStep] = useState(0);
  const [values, setValues, removeValues] = useLocalStorage("VALUES")
  const { email, password, cardNumber, cardHolder, expDate, cvv, carModel, img } = values || {};
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => setIsSuccess(false), 3000);
    }
    return () => clearTimeout(timeout)
  }, [isSuccess])

  const validateValues = () => {
    if (step === 0) {
      if (!isEmail(email)) {
        setErrorMessage(INCORRECT_EMAIL)
        return false
      }

      if (!isPassword(password)) {
        setErrorMessage(INCORRECT_PASSWORD)
        return false;
      }
    } else if (step === 1) {
      if (!isCardNumber(cardNumber)) {
        setErrorMessage(INCORRECT_CARD_NUMBER)
        return false
      }
      if (!isCardHolder(cardHolder)) {
        setErrorMessage(INCORRECT_CARD_HOLDER)
        return false
      }

      if (!isExpDate(expDate)) {
        setErrorMessage(INCORRECT_EXP_DATE)
        return false
      }

      if (!isCVV(cvv)) {
        setErrorMessage(INCORRECT_CVV)
        return false
      }

    } else if (step == 2) {
      if (!carModel) {
        setErrorMessage(INCORRECT_CAR_MODEL);
        return false
      }

      if (!isValidImage(img)) {
        setErrorMessage(INCORRECT_IMAGE)
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/results", { method: "POST", body: JSON.stringify(values) })
      const blob = await response.blob();
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = "results.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      removeValues();
      setStep(0);
      setIsSuccess(true);
    } catch (e) {
      setErrorMessage(`Something went wrong: ${e}`)
    }

  }

  const handleChange = (key: string, value: string) => {
    let temp = { ...values };
    temp[key] = value;
    setValues(temp);
    setErrorMessage(null)
  }

  const handleContinue = () => {
    if (validateValues()) {
      if (step !== 2) {
        setStep(prevState => prevState + 1);
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevious = () => {
    step !== 0 && setStep(prevState => prevState - 1);
  }

  return (
    <>
      <div className={styles.container}>
        {errorMessage && <div className={styles.errorBox}>
          <p>{errorMessage}</p>
        </div>}
        {isSuccess &&
          <div className={styles.successMessage}>
            <p>Succesfully downloaded json file</p>
          </div>
        }
        {step === 0 && <div className={styles.firstStep}>
          <Input
            label="E-mail"
            onChange={(value) => handleChange("email", value)}
            placeholder="Enter your E-mail"
            value={email ?? ""}
          />
          <Input
            label="Password"
            type="password"
            onChange={(value) => handleChange("password", value)}
            placeholder="Enter your Password"
            value={password ?? ""}
          />
        </div>}
        {step === 1 && <div className={styles.secondStep}>
          <Input
            formatText={formatCardCode}
            maxLength={19}
            placeholder="XXXX XXXX XXXX XXXX"
            label="Card number"
            onChange={(value) => handleChange("cardNumber", value)}
            value={cardNumber ?? ""}
          />
          <Input
            label="Card holder"
            placeholder="John wick"
            onChange={(value) => handleChange("cardHolder", value)}
            value={cardHolder ?? ""}
          />
          <Input
            formatText={formatCardExpiration}
            label="Exp. Date"
            placeholder="MM / YY"
            onChange={(value) => handleChange("expDate", value)}
            value={expDate ?? ""}
          />
          <Input
            label="CVV"
            placeholder="***"
            maxLength={3}
            type="password"
            onChange={(value) => handleChange("cvv", value)}
            value={cvv ?? ""}
          />
        </div>}
        {step === 2 && <div className={styles.thirdStep}>
          <Select
            onChange={(value) => handleChange("carModel", value)}
            label="Select model"
            options={options}
            initialValue={options.find(opt => opt.value === carModel)}
          />
          <FileUpload initialSource={img} onChange={(value) => handleChange("img", value)} />
        </div>}
        <div className={styles.actions}>
          <Button disabled={step === 0} onClick={handlePrevious} styletype="secondary">Previous</Button>
          <Button onClick={handleContinue}>{step === 2 ? "Submit" : "Next"}</Button>
        </div>
      </div>
    </>
  )
}
