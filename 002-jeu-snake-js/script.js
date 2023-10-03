window.onload = function(){
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let snakee;
    let applee;
    let widthInBlock = canvasWidth/blockSize; // la largeur du canvas divisé par un block qui est égale à 30px, 900/30 = 30, il y a 30 block de large
    let heightInBlock = canvasHeight/blockSize; // la hauteur de canvas divisé par un block qui est égale à 30px, 600/30 = 30, il y a 20 block de hauteur
    let score;
    let timeOut;
    let hightScore = 0;

    init(); //Execute le fonction init qui me permet de raffraichir mon canvas

    function init(){ // "init", nom standard pour initié
        let canvas = document.createElement('canvas'); //créer un élément de type canvas pour nous permettre de déssiner
        canvas.width = canvasWidth; //largeur 900px
        canvas.height = canvasHeight; //hauteur 600px
        canvas.style.border = "30px solid grey"; //Permet d'apporter un style, plus précisément "border" = bordure du canvas de 1px et en noir par défaut
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas); // Permet de rattacher le canvas au fichier html dans la balise body
        /* 
            Permet de déssiner quelque chose(un rectangle) dans le canvas grâce au getCanvas,
            on appelle ça un contexte.
            Et il sera en '2d' (en 2 dimensions).
        */
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas(); // Appelle la fonction refreshCanvas
    }

    function refreshCanvas(){
        snakee.advance(); //Fait toujours avancé mon serpent
        if(snakee.checkCollision()){
            // GAME OVER
            gameOver();
            if(score > hightScore)
            {
                hightScore = score;
            }
        }else{
            if(snakee.isEatingApple(applee)){
                // LE SERPENT A MANGER LA POMME
                score ++;
                if(score > hightScore)
            {
                hightScore = score;
            }
                snakee.ateApple = true;
                do
                {
                    applee.setNewPosition();
                }
                while (applee.isOnSnake(snakee)); // vérifie que la pomme apprarait pas sur le serpent  
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); //Efface le canvas 
            // ctx.fillText(score, 880, 15);
            drawScore(); // permet au serpent et à la pomme d'être "sur" le score
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas, delay); //fonction qui permet d'éxécuter une certaine fonction à chaque fois qu'un certain délai est passé
        }
        
    }

    function drawScore(){
        ctx.save();
        ctx.fillText(hightScore.toString(), 5, canvasHeight - 10);
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // sert a centrer notre texte au milieu de notre axe x et y
        let centreX = canvasWidth / 2;
        let centreY = canvasHeight / 2;

        ctx.fillText(score.toString(), centreX, centreY);
        
        ctx.restore();
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // sert a centrer notre texte au milieu de notre axe x et y
        ctx.strokeStyle = "white";
        ctx.lineWitdh = 5;
        let centreX = canvasWidth / 2;
        let centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);

        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function restart(){
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas(); // Appelle la fonction refreshCanvas
    }

    function drawBlock(ctx, position){
        /*
         position de x dans la "grille" * par la taille du blockSize 30px,
          espace entre la gauche à la droite.
          Exemple : x = 5 et blockSize = 30, 5 * 30 = 150px d'écart entre le côté gauche du canvas
        */
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize); //Permet de déssiner un rectangle qui sera notre future serpent : position x, position y, largeur = blockSize = 30px, hauteur = blockSize = 30px
    }

    function Snake(body, direction){ //fonction construteur de notre serpent
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){ // méthode qui permet de déssiner le corp de notre serpent dans le canvas
            ctx.save(); // sauvegarder le contexte, son contenu comme il était avant
            ctx.fillStyle = "#ff0000"; // La couleur avec laquelle je vais déssiner grâce à l'attribut de ce contexte ".fillStyle" et la couleur est rouge
            for(let i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        /*
            Cette fonction permet de faire "avancé" le serpent en ajoutant une case devant(indice 0) et en effaçant la dernière
        */
        this.advance = function(){ //fonction pour faire avancé notre serpent vers la droite
            let nextPosition = this.body[0].slice(); // enregistre la position de l'indice 0 du serpent, dans nextPosition
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition); // Met nextPosition qu'on à enregistrer ligne 68 pour lui mettre début du tableau, à la tête du snake
            if(!this.ateApple){
                this.body.pop(); //Efface le dernier indice de notre tableau
            }else{
                this.ateApple = false;
            }  
        };

        /*
            Cette fonction permet de prendre pour paramétre la nouvelle direction (donc sur quelle touche on a appuyer : 
                fléche gauche = "left", haut = "up", droite = "right" et bas = "down").
            
            "allowedDirection" est la direction permises.
            "this.direction" est la direction dans laquelle le serpent se dirige déjà(gauche = "left", haut = "up", 
                droite = "right" et bas = "down")
            
            Exemple 1 : 
                paramétre de la fonction "down", flèche du bas
                switch("left")
                il rentre dans le premier cas "case "left" :"
                ducoup les directions permises sont "up" ou "down" qui sont dans un tableau

                Avec "indexOf" on récupére l'indice du tableau de allowedDirection compris dans le premier "cas", soit indice "0" ou indice "1"
                Indice 0 = "up"
                Indice 1 = "down"
                dans cette exemple newDirection = "down", ducoup l'indice est égale à "1"
                Si 1 est strictement supérieur à -1
                La direction actuelle change est devient "down"
                notre serpent se dirigera vers le bas
            Exemple 2 :
                paramétre de la fonction "down", flèche du bas
                switch("up")
                il rentre dans le quatrième cas "case "up" :"
                ducoup les directions permises sont "left" ou "right" qui sont dans un tableau

                Avec "indexOf" on récupére l'indice du tableau de allowedDirection compris dans le premier "cas", soit indice "0" ou indice "1"
                Indice 0 = "left"
                Indice 1 = "right"
                dans cette exemple newDirection = "down", ducoup l'indice est égale à "-1"
                Si -1 est strictement supérieur à -1
                La direction actuelle ne change pas est reste "up"
                notre serpent se dirigera toujours vers le haut
        */

        this.setDirection = function (newDirection){
            let allowedDirection;

            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        /*
            Test si notre serpent entre en collision/touche un côté de notre canvas ou si il se touche lui même
        */

        this.checkCollision = function(){
            let wallCollision = false; // Par défaut ils sont a "false" (sinon cela veut dire qu'il est en collision constant avec les côtés du canvas)
            let snakeCollision = false; // Par défaut ils sont a "false" (sinon cela veut dire qu'il est en collision constant avec lui même)
            let head = this.body[0]; // récupére l'indice 0 (emplacement du premier partie du corp) la tête du serpent
            let rest = this.body.slice(1); // récupére l'indice 1 compris du serpent jusqu'a le dernier indice de this.body(le corp du serpent sans sa tête)
            let snakeX = head[0]; // emplace x (horizontale de la tête du serpent)
            let snakeY = head[1]; // emplace y (horizontale de la tête du serpent)
            let minX = 0; // taille minimun horizontale du canvas
            let minY = 0; // taille minimun vertical du canvas
            let maxX = widthInBlock - 1; // le nombre de block de 30px de large - 1, pcq sinon sa fait 30 alors que ça commence à l'indice 0 donc 0 à 29 se qui fait 30 élément mais qui se fini a 29(pour cette dimension du canvas)
            let maxY = heightInBlock - 1; // le nombre de block de 30px de hauteur - 1, pcq sinon sa fait 20 alors que ça commence à l'indice 0 donc 0 à 19 se qui fait 20 élément mais qui se fini a 19(pour cette dimension du canvas) 
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX; // 2 condition qui test si emplacement x de la tête du serpent est en dehors gauche ou droite du canvas c'est-à-dire snakeX < 0 OU snakeX > 29
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY; // 2 condition qui test si emplacement y de la tête du serpent en dehors du haut ou du bas du canvas c'est-à-dire snakeX < 0 OU snakeX > 19

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true; // il touche un côté
            }

            for(let i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };

        /*
            Vérifie si la tête du serpent est exactement sur la position de la pomme (x, y)
        */

        this.isEatingApple = function(appleToEat){
          let head = this.body[0];
          if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
            return true;
          }else{
            return false;
          }
        };
    }

    /*
        Emplacement de la pomme
    */

    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33"; // couleur vert
            ctx.beginPath();
            let radius = blockSize/2; // la moitié de 30px pour avoir le rayon donc 15px
            let x = this.position[0]*blockSize + radius;
            let y = this.position[1]*blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true); //crée un cercle
            ctx.fill();

            ctx.restore();

        };
        this.setNewPosition = function(){
            let newX = Math.round(Math.random() * (widthInBlock - 1));
            let newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;

            for(let i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;

        };
    }

    /*
        Permet de récupérer les informations suivante :
            Si l'utilisateur appuie sur la flèche gauche, haut, droite et bas du clavier. 
    */
    document.addEventListener('keydown', (e) => {
        let key = e.key;
        let newDirection;
        switch(key){
                case "ArrowLeft":
                    newDirection = "left";
                    break;
                case "ArrowUp":
                    newDirection = "up";
                    break;
                case "ArrowRight":
                    newDirection = "right";
                    break;
                case "ArrowDown":
                    newDirection = "down";
                    break;
                case " ":
                    restart();
                    return;
                default: // Tu continue pas la fonction tu t'arrete et tu "retourne"
                    return;
            }
            snakee.setDirection(newDirection);

    /*    
        L'utilisation de "keyCode" est obsolète.
       
     {
         let key = e.keyCode;
         let newDirection;
         switch(key)
         {
             case 37:
                 newDirection = "left";
                 console.log("gauche");
                 break;
             case 38:
                 newDirection = "up";
                 console.log("haut");
                 break;
             case 39:
                 newDirection = "right";
                 console.log("droite");
                 break;
             case 40:
                 newDirection = "down";
                 console.log("bas");
                 break;
         }

    */
    });

}
