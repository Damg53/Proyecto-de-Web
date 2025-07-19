// NodoDL.js
export default class NodoDL {
    constructor(valor) {
        this.Valor = valor;
        this.Posicion = { x: 0, y: 0 };
        this.PosicionDestino = { x: 0, y: 0 };
        this.EsNuevo = true;
        this.Resaltado = false;
        this.VelocidadAnimacion = 0.1;
        this.siguiente = null;
        this.anterior = null;
    }

    actualizarAnimacion() {
        if (!this.PosicionDestino || !this.Posicion) {
            return false;
        }

        const deltaX = this.PosicionDestino.x - this.Posicion.x;
        const deltaY = this.PosicionDestino.y - this.Posicion.y;
        const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distancia < 1) {
            this.Posicion.x = this.PosicionDestino.x;
            this.Posicion.y = this.PosicionDestino.y;
            this.EsNuevo = false;
            return false; // Animación terminada
        }

        // Mover hacia la posición destino
        this.Posicion.x += deltaX * this.VelocidadAnimacion;
        this.Posicion.y += deltaY * this.VelocidadAnimacion;

        return true; // Animación en progreso
    }

    establecerPosicion(x, y) {
        this.Posicion = { x, y };
        this.PosicionDestino = { x, y };
    }

    moverHacia(x, y) {
        this.PosicionDestino = { x, y };
    }

    resaltar(estado = true) {
        this.Resaltado = estado;
    }

    estaAnimando() {
        if (!this.PosicionDestino || !this.Posicion) {
            return false;
        }
        
        const deltaX = this.PosicionDestino.x - this.Posicion.x;
        const deltaY = this.PosicionDestino.y - this.Posicion.y;
        const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        return distancia > 1;
    }
}