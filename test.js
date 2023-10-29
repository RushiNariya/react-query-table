// function x() {
//   for (var i = 0; i <= 5; i++) {

//     function close(x){
//       setTimeout(function (){
//         console.log(x);
//       }, 1000);
//     }

//     close(i)
//   }
// }

// x();

// let name = {
//   firstName: 'rushi',
//   lastName: 'nariya',
// };

// function printName(city, state) {
//   console.log(this.firstName + ' ' + this.lastName + ' ' + city + ' ' + state);
// }

// let newprintFunction = printName.bind(name, 'rajkot');

// newprintFunction('gujarat');

// Function.prototype.mybind = function (...args) {
//   let obj = this;
//   let params = args.slice(1);
//   return function (...args2) {
//     obj.call(args[0], 'rushi', 'nariya');
//   };
// };

// let newprintFunction2 = printName.mybind(name, 'rajkot', 'gujarat');

// newprintFunction2('rajkot');


// const newObj = {
//   fName : 'rushi',
//   lName : 'nariya',
//   printName: function () {
//     console.log(this.fName + " " + this.lName);
//   }
// }

function multiply(x,y){
  console.log(x*y)
}


const multiplyThree = multiply.bind(this, 3)

multiplyThree(3)