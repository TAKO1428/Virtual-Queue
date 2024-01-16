class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.siguiente = null;
    }

    getValor() {
        return this.valor;
    }

    setValor(valor) {
        this.valor = valor;
    }

    getSiguiente() {
        return this.siguiente;
    }

    setSiguiente(siguiente) {
        this.siguiente = siguiente;
    }

}

class Cola {
    constructor() {
        this.inicioCola = null;
        this.finalCola = null;
        this.size = 0;
    }

    getInicioCola() {
        return this.inicioCola;
    }

    getFinalCola() {
        return this.finalCola;
    }

    getSize() {
        return this.size;
    }

    estatus() {
        return this.inicioCola === null;
    }

    enque(valor) {
        let nuevo = new Nodo(valor);
        if (this.estatus()) {
            this.inicioCola = nuevo;
            this.finalCola = nuevo;
        } else {
            this.finalCola.setSiguiente(nuevo);
            this.finalCola = nuevo;
        }
        this.size++;
    }

    obtenerCola() {
        let tmp = this.inicioCola;
        let contador = 0;
        if (this.estatus()) {
            console.log("Cola vacía");
        } else {
            while (contador < this.size) {
                console.log(tmp.getValor());
                console.log("^");
                tmp = tmp.getSiguiente();
                contador++;
            }
        }
    }

    deque() {
        if (this.estatus()) {
            console.log("No se puede desencolar porque la cola está vacía");
            return;
        }
        this.inicioCola = this.inicioCola.getSiguiente();
        this.size--;
        if (this.size === 0) {
            this.finalCola = null;
        }
    }

    peek() {
        if (this.estatus()) {
            console.log("La cola está vacía");
        } else {
            console.log("Elemento al final de la cola: " + this.finalCola.getValor());
        }
    }
}


// Variables Globales

let solicitudes = new Cola();
let turno = 1;
let tiempoAproximado = 0;

// Formulario

function validarDatos(nombre, telefono, servicio, modelo) {
    let estatus;
    if (nombre == "" || telefono == "" || servicio == "" || modelo == "") {
        estatus = false;
    }
    else{
        estatus = true;
    }
    return estatus
}






function generarSolicitud(){
    
    
    let nombre = document.getElementById("nombre").value;
    let telefono = document.getElementById("numero").value;
    let servicio = document.getElementById("servicio").value;
    let modelo = document.getElementById("modelo").value;
    let datosSolicitud = { turno, nombre, telefono, servicio, modelo };
    tiempoAproximado = (solicitudes.getSize() * 10);
    let mensaje = `¿Quieres confirmar los siguientes datos y generar la solicitud?:\nTurno: ${turno}\nNombre: ${nombre}\nTeléfono: ${telefono}\nServicio: ${servicio}\nModelo: ${modelo}\nTe atenderemos en aproximadamente ${tiempoAproximado} minutos`;
    if (validarDatos(nombre,telefono,servicio,modelo)) {
        let confirmacion = confirm(mensaje);
        if (confirmacion) {
            if (solicitudes.getSize() < 10) {
                console.clear();
                solicitudes.enque(datosSolicitud);
                turno ++;   
            }
            else{
                alert("La cola esta saturada en este momento, espera a que atendamos las demas solicitudes")
                console.log("La cola esta saturada")
            }
        } 
    }
    else{
        alert("Todos los campos son obligatorios.");
    }
    turnoProximo();
    solicitudes.obtenerCola();
    console.log("Elementos en la cola: " + solicitudes.getSize());

}

function turnoProximo(){
    
    if (!solicitudes.estatus()) {
        let cabezaCola = solicitudes.getInicioCola().getValor();
        document.getElementById("proximo-turno").value = cabezaCola.turno;
        document.getElementById("proximo-nombre").value = cabezaCola.nombre;
        document.getElementById("proximo-telefono").value = cabezaCola.telefono;
        document.getElementById("proximo-servicio").value = cabezaCola.servicio;
        document.getElementById("proximo-modelo").value = cabezaCola.modelo;
    }
    else{
        document.getElementById("proximo-turno").value = "";
        document.getElementById("proximo-nombre").value = "";
        document.getElementById("proximo-telefono").value = "";
        document.getElementById("proximo-servicio").value = "";
        document.getElementById("proximo-modelo").value = "";
    }
    
}

function atenderSolicitud(){
    console.clear();
    solicitudes.deque();
    console.log("Solicitud Atendida")
    console.log("Solicitudes Pendientes: " + solicitudes.getSize());
    solicitudes.obtenerCola();
    turnoProximo();
}


