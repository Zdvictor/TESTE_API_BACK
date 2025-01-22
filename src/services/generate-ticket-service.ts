export default function generateTicket() {

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    
    let ticket = '';
  
    for (let i = 0; i < 12; i++) { 

      const char = i % 2 === 0
        ? alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase()
        : numbers[Math.floor(Math.random() * numbers.length)];
  
      ticket += char;
  
      if ((i + 1) % 4 === 0 && i !== 11) {
        ticket += '-';
      }
    }
  
    return ticket;
  }