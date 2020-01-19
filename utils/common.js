function sayHello(name) {
  console.log('Hello ${name}!')
}

function sayGoodBye(name) {
  console.log('GoodBye ${name}!')
}

module.exports.sayHello = sayHello
module.exports.sayGoodBye = sayGoodBye