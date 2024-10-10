
const ayse = [54, 65, 78, 88];
const ehmad = [98, 99, 97, 95];
const feruz = [71, 75, 91, 88];


function getStatus(ad, bal) {
    const zerbeci = bal.some(bal => bal >= 91);
    const elaci = bal.every(bal => bal >= 91);
    
    if (elaci) return `${ad}: Əlacı`;
    if (zerbeci && bal.every(bal => bal >= 71)) return `${ad}: Zərbəci`;
    return `${ad}: qoz qiran`;
}


console.log(getStatus("Ayşə", ayse));  
console.log(getStatus("Əhməd", ehmad));  
console.log(getStatus("Feruz", feruz));  