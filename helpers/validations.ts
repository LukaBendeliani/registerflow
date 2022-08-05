export const isEmail = (email: string) => {
    const re = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'i');

    if (!email) {
        return false;
    };

    return re.test(String(email).toLowerCase());
}

export const isPassword = (password: string) => {
    const re = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'g');
    return re.test(password);
}

export const isCardNumber = (cardNumber: string) => {
    const containsOnlyNumberRe = new RegExp(/^\d+$/)
    return cardNumber?.length === 19 && containsOnlyNumberRe.test(cardNumber.split(" ").join(""))
}

export const isCardHolder = (cardHolder: string) => {
    return cardHolder?.length > 3
}

export const isExpDate = (expDate: string) => {
    const [month, year] = expDate?.split("/") || [];
    const expirationDate = new Date(+`20${year}`, +month - 1)

    return expDate?.length === 5 && expirationDate.getTime() > new Date().getTime()
}

export const isCVV = (str: string) => {
    const containsOnlyNumberRe = new RegExp(/^\d+$/)
    return str?.length === 3 && containsOnlyNumberRe.test(str)
}

export const isValidImage = (source: string | ArrayBuffer) => {
    return `${source}`.startsWith("data:image")
}