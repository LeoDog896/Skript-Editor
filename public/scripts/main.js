var x = document.getElementById("catsuwu"); 

document.getElementById("cat").onclick = function() {
  x.play();
  navigator.vibrate(200);
  console.log(1)
}

function playMe() {
  x.play();
}

function Stop() {
  //Most likey wont be used
  x.stop();
}