function makeWorker() {
  let name = "Pete";

  return function() {
    console.log(name); // Pete
  };
}

let name = "John";

// create a function
let work = makeWorker();

// call it
work(); // что будет показано? "Pete" (из места создания) или "John" (из места выполнения)