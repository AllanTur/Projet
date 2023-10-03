window.onload = function () {
  let canvas;
  let ctx;
  let delay = 10000; //Délais de 1000 milliseconde
  let xCoord = 0;
  let yCoord = 0;

  init();

  function init() {
    canvas = document.createElement("canvas"); // Création du canvas
    canvas.width = 900; // largeur de la fenêtre du canvas
    canvas.height = 600; //Hauteur de la fenêtre du canvas
    canvas.style.backgroundColor = "#a2e4e5"; // Couleur de fond du canvas
    canvas.style.border = "1px solid"; //Bordure du canvas
    document.body.appendChild(canvas); //Attacher le canvas au body HTML
    ctx = canvas.getContext("2d"); // en 2 dimension
    refreshCanvas(); //utilise la fonction 1000 milliseconde
  }

  function refreshCanvas() {
    xCoord += 2;
    yCoord += 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(xCoord, yCoord, 100, 50);
    setTimeout(refreshCanvas, delay);
  }
};
