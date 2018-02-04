var juego;
var nombre ="";
var dificultad = 1;

$(document).ready(function () {
    $("#estadistica")[0].style.display = "none";
    $("#tablero")[0].style.display = "none";
    $('#TBguardar').on('click', guardar);
	
	dificultad = $('#dificultad').val();
});

function guardar() {
    var nombreUsuario = document.getElementById("TBnombreUsuario").value;

    if (nombreUsuario.length != " ") {

        document.getElementById("tablero").style.display = "block";
        document.getElementById("formulario").style.display = "none";
        
        //incio juego
        juego = new Phaser.Game(410, 500, Phaser.AUTO, 'tablero', {
            preload: preload,
            create: create,
            update: update
        });
		nombre = nombreUsuario;
		
    } else {
        mensajes('Cuidado!', 'Necesitamos un nombre para registrar tus datos');
    }
}

//funcion que devuelve un mensaje de toast
function mensajes(mensaje, leyenda) {

    $.toast({
        heading: mensaje,
        text: leyenda,
        loader: true,
        loaderBg: 'red'
    });
}

/* Variables JUEGO*/
var pelotas;
var Xpelota = 205;
var suelos;
var click = true;
var posicionesX = [35, 101, 167, 233, 299, 365, 431, 531, 597, 663];
var puntos = 0;
var bloques;
var bloquesTotales=0;
var auz=0;
var tablero = [
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ],
    [, , , , , ]
];

function preload() {
    juego.load.image("fondo", "img/fondo.jpg");
    juego.load.image("pelota", "img/pelota.png");
    juego.load.image("bloque1", "img/bloque1.png");
    juego.load.image("bloque2", "img/bloque2.png");
    juego.load.image("bloque3", "img/bloque3.png");
    juego.load.image("bloque4", "img/bloque4.png");
    juego.load.image("bloque5", "img/bloque5.png");
    juego.load.image("bloque6", "img/bloque6.png");
    juego.load.image("base", "img/base.png");
	juego.load.audio("musica","musica/musica.mp3");
}

function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.enableBody = true;
    fondo = juego.add.sprite(0, 0, "fondo");
	
	musica = juego.add.audio("musica");
	musica.play("",1,true);

    suelos = juego.add.group();
    suelos.enableBody = true;

    suelo = suelos.create(0, 490, "base");
    suelo.width = 410;
    suelo.height = 70;

    bloques = juego.add.group();
    bloques.enableBody = true;
    crearbloque();
    bloques.y = -563;

    pelotas = juego.add.group();
    pelotas.enableBody = true;

    pelota = pelotas.create(205, 450, "pelota")
    pelota.body.collideWorldBounds = true;
    pelota.anchor.setTo(0.5);
    pelota.body.bounce.set(1);
    pelota.width = 35;
    pelota.height = 35;

    juego.physics.arcade.enable(bloques);
}

function update() {
    
    juego.physics.arcade.collide(pelotas, bloques, function (pelotas, bloques) {
        if (!click) {
            bloques.kill();
            puntos++;
            bloquesTotales--;
        }
    });

    juego.physics.arcade.overlap(pelotas, suelo, function (pelotas, suelo) {

        //para la pelota para simular un nuevo tiro
        pelota.y = 450;
        pelota.x = Xpelota;
        pelota.body.velocity.y = 0;
        pelota.body.velocity.x = 0;
        mensajes("Puntos:",""+puntos)
        bloques.y += 66;
        click = true;
    });

    juego.physics.arcade.overlap(bloques, suelo, function (bloques, suelo) {
        mostrarEstadistica(0);
    });

    if (juego.input.mousePointer.isDown && click == true) {
        //mueve la pelota a donde haga click

        if (juego.input.mousePointer.y < 450) {
            juego.physics.arcade.moveToPointer(pelota, 700);
            click = false;
        } else {
            mensajes("Ups", "Cuidado tienes que tirar hacia arriba");
            pelota.body.velocity.y = 0;
            pelota.body.velocity.x = 0;
            
        }
    }

    Xpelota = pelota.x;
    if(bloquesTotales == 0) {
        mostrarEstadistica(1);
    }
}

function crearbloque() {
    var bloquesDisponibles = ["bloque1", "bloque2", "bloque3", "bloque4", "bloque5", "bloque6"];
    var aux = -1;

    for (var f = 0; f < tablero.length - 1; f++) {
        var NumBloques = Math.round(Math.random() * (6 - 1) + dificultad);
        aux = -1;

        for (var c = 0; c < NumBloques; c++) {

            var Color = Math.round(Math.random() * (6 - 1));
            if (Color == 6) {
                Color--
            };

            var PosicionRadom = Math.round(Math.random() * (6 - 1));
            if (PosicionRadom == 6) {
                PosicionRadom--
            };

            if (aux != PosicionRadom) {
                bloqueActual = bloques.create(posicionesX[PosicionRadom], posicionesX[f], bloquesDisponibles[Color])
                bloqueActual.enableBody = true;
                bloqueActual.anchor.setTo(0.5);
                bloqueActual.body.immovable = true;
                aux = PosicionRadom;
                bloquesTotales++;
            }
        }
    }
}

function mostrarEstadistica(i) {   
    juego.destroy();    
    $("#tablero").remove();
	$("#estadistica").attr("style","display:block");
	
	var arrayNombres = [];
	var arrayPuntos = [];
	localStorage.setItem(nombre,puntos);
	
	for(var i=0; i<localStorage.length;i++){
		arrayNombres[i]=localStorage.key(i);
		arrayPuntos[i]=localStorage.getItem(localStorage.key(i));
	}
	
	for(var i = 0; i<arrayNombres.length; i++){
		var nodo = `<ul class="usuario">
						<li>${arrayNombres[i]}</li>
						<li>${arrayPuntos[i]} puntos</li>
					</ul>`;
		$("#estadistica").append(nodo);
	}
	
	var boton=`<input class="boton" type="button" value="Jugar Otra Vez" onclick="location.reload();">`;
	$("#estadistica").append(boton);
}
