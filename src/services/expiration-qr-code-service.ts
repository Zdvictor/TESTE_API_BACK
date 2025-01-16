

export function generateExpirationDate()  {

    const now = new Date();

    const expirationDate = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 horas

    return expirationDate.toISOString();


}