const habilidades = [
    {
        "id" : 100,
        "nombre" : "estocada ágil",
        "descripcion" : "Apuñala rapidamente el punto débil.",
        "explicacion" : "Ataque físico, inflige daño (100% de fuerza + 50% de destreza).",
        "coste" : 3,
        "requisitos" : {
            "fuerza" : 3,
            "magia" : 0,
            "defensa" : 0,
            "resistencia" : 0,
            "destreza" : 3,
            "suerte" : 0,
            "vitalidad" : 0,
            "espiritu" : 0,
            "nivel" : 2,
            "equipo" : "espada"            
        },
        "imagen": "lorc/spiral-thrust.png"
    },
    {
        "id" : 101,
        "nombre" : "curación débil",
        "descripcion" : "La base de la magia de curación.",
        "explicacion" : "Restaura 10 puntos de salud.",
        "coste" : 5,
        "requisitos" : {
            "fuerza" : 0,
            "magia" : 3,
            "defensa" : 0,
            "resistencia" : 0,
            "destreza" : 0,
            "suerte" : 0,
            "vitalidad" : 0,
            "espiritu" : 0,
            "nivel" : 2,
            "equipo" : ""
        },
        "imagen": "delapouite/healing.png"
    }
];
