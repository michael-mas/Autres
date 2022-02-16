import platform from './asset/platform.png'
console.log(platform)
const canvas = document.querySelector('canvas') // selectionner le canva

const c = canvas.getContext('2d') //définis parametre canva en 2D ; c = contexte

canvas.width = innerWidth //taille canva
canvas.height = innerHeight

const gravity = 1.5 // vitesse constante gravité
class Player { //définie l'objet Player
    constructor() { //La méthode constructor est une méthode pour créer et initialiser un objet lorsqu'on utilise le mot clé class
        this.position = { //position
            x: 100,
            y: 100
        }
        this.velocity = { //sens gravité
            x:0,
            y:0
        }
        this.width = 30 //dimension
        this.height = 30
    }

    draw() { //dessine le contenu du bloc Player
        c.fillStyle = 'red' //.fillStyle de l'API Canvas 2D spécifie la couleur ou style à utiliser à l'intérieur des formes
        c.fillRect(this.position.x, this.position.y, this.width, this.height //La méthode fillRect() de l'API 2D des Canvas dessine un rectangle
            )
    }

    update() { //Cette méthode remplace le contenu de l'élément par l' argument newContent fourni et renvoie l'élément.
        this.draw()
        this.position.x += this.velocity.x //Sens velocité en x
        this.position.y += this.velocity.y //Sens velocité en y 
        
        if (this.position.y + this.height + //creer condition gravité
            this.velocity.y <= canvas.height)
            this.velocity.y += gravity //Pour donner acceleration à la gravité
        else this.velocity.y = 0 //Pour que la gravité s'arrete si touche bas canva
    }
}

//defini l'objet PLateforme
class Platform {
    constructor({ x, y }) {
        this.position = {
            x,
            y
        }

        this.width = 200
        this.height = 20
    }
    //dessiner plateforme
    draw() {
        c.fillStyle = 'blue' 
        c.fillRect(this.position.x, this.position.y, this.width, this.height )
    }
}

const player = new Player()  //définis la constante player
const platforms = [new Platform({ //définis constante platform"s"
    x: 200, y: 100
}), new Platform({x: 500, y: 200})]  //replace un nouvel objet platform

//constante keys
const keys = { // arrete boucle quand on appuie sur une touche directionnelle
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0 //let car ekke sera emmener à etre changer |  scrollOffset = décalage de défilement 

function animate() { //créer fonction animate et ainsi pouvoir la modifier
    requestAnimationFrame(animate) //méthode: notifie le navigateur que vous souhaitez exécuter une animation et lance une fonction spécifique de mise à jour de l'animation, avant refresh
    c.clearRect(0, 0, canvas.width, canvas.height) //efface frame precedent du joueur
    player.update() //met à jour joueur
    platforms.forEach((platform) => { //applique platforms sur platform
        platform.draw()
    }) 

    if (keys.right.pressed && player.position.x < 400) { //relier action objet keys.right à l'animation joueur et mettre des points de limite coté droite
        player.velocity.x = 5
    }   else if (keys.left.pressed && player.position.x > 100) { //relier action objet keys.left à l'animation joueur et mettre des points de limite coté gauche
        player.velocity.x = -5
    } else {
        player.velocity.x = 0 // si on appuye plus sur la touche desactive velocité
    
        //illusion de mouvement
        if (keys.right.pressed) {
            scrollOffset += 5 //activer scrollOffset
            platforms.forEach((platform) => { //applique platforms sur platform
                platform.position.x -= 5 //bouger les plateformes au mouvement du joueur en sortant de la limite des cotés droit
            }) 
        } else if (keys.left.pressed) {
          scrollOffset -= 5 //activer scrollOffset
                platforms.forEach((platform) => { //applique platforms sur platform
                    platform.position.x += 5 //bouger les plateformes au mouvement du joueur en sortant de la limite des cotés droit
            })
        }
    } 

    //detection collisions platform
    platforms.forEach((platform) => {
    if (
        player.position.y + player.height <= platform.position.y 
        && player.position.y + player.height + player.velocity.y >= platform.position.y  //mettre en place collision platform en y
        && player.position.x + player.width >= platform.position.x //en x
        && player.position.x <= platform.position.x + platform.width //sur la largeur
    )   {
        player.velocity.y = 0 //arrete velocité en y en cas de contact avec platform
    }
}) 

    if (scrollOffset > 2000) { //condition pour afficher 'you win'
        console.log('You win')
    }
}

animate() //lance animation

//créer evenement touches via keyCode
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 37: //definis la touche gauche
            console.log('left')
            keys.left.pressed = true // activer objet key pour left
            break

        case 40: //definis la touche bas
            console.log('down')
            break

        case 39: //definis la touche droite
            console.log('right')
            keys.right.pressed = true
            break

        case 38: //definis la touche haut
            console.log('up')
            player.velocity.y -= 20 //contrer gravité en cas de saut
            break
    }
})

//créer 2eme evenement touches via keyCode pour arreter velocité des mouvement
addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 37: //definis la touche gauche
            console.log('left')
            keys.left.pressed = false //désactiver objet keys
            break

        case 40: //definis la touche bas
            console.log('down')
            break

        case 39: //definis la touche droite
            console.log('right')
            keys.right.pressed = false 
            break

        case 38: //definis la touche haut
            console.log('up')
            player.velocity.y -= 20 //contrer gravité en cas de saut
            break
    }
})