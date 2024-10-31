const ayse = [54, 65, 78, 88];
const ehmad = [98, 99, 97, 95];
const feruz = [71, 75, 91, 88];
const sahib = [ 72 , 80 , 83 , 76 ] ;
const gulu = [ 47 , 92 , 95 , 96 ,88] ;


function getStatus(ad1, ball) {
    const zerbeci = ball.some(ball => ball >= 91);
    const elaci = ball.every(ball => ball >= 91);
const kesir = ball.some (ball => ball <= 50 ) ;

    
    if (elaci) return `${ad1}: Əlacı`;
    if (zerbeci && ball.every(ball => ball >= 71)) return `${ad1}: Zərbəci`;
if ( kesir ) return `${ad1} : kesir`
    return `${ad1}: adi`;
}

console.log(getStatus("Ayşə", ayse));  
console.log(getStatus("gulu", gulu));  

console.log(getStatus("Əhməd", ehmad));  
console.log(getStatus("Feruz", feruz)); 

console.log(getStatus("sahib", sahib)); 
