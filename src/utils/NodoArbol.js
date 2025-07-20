// NodoArbol.js - Versión completa con visualización mejorada
export default class NodoArbol {
    constructor(valor) {
        this.valor = valor;
        this.posicion = { x: 0, y: 0 };
        this.posicionDestino = { x: 0, y: 0 };
        this.esNuevo = true;
        this.resaltado = false;
        this.visitado = false; // Para recorridos
        this.encontrado = false; // Para búsquedas
        this.velocidadAnimacion = 0.1;
        this.izquierdo = null;
        this.derecho = null;
        this.padre = null;
        this.nivel = 0; // Profundidad del nodo en el árbol
    }

    actualizarAnimacion() {
        if (!this.posicionDestino || !this.posicion) {
            return false;
        }
        
        const deltaX = this.posicionDestino.x - this.posicion.x;
        const deltaY = this.posicionDestino.y - this.posicion.y;
        const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distancia < 1) {
            this.posicion.x = this.posicionDestino.x;
            this.posicion.y = this.posicionDestino.y;
            this.esNuevo = false;
            return false; // Animación terminada
        }
        
        // Mover hacia la posición destino
        this.posicion.x += deltaX * this.velocidadAnimacion;
        this.posicion.y += deltaY * this.velocidadAnimacion;
        return true; // Animación en progreso
    }

    establecerPosicion(x, y) {
        this.posicion = { x, y };
        this.posicionDestino = { x, y };
    }

    moverHacia(x, y) {
        this.posicionDestino = { x, y };
    }

    resaltar(estado = true) {
        this.resaltado = estado;
    }

    marcarVisitado(estado = true) {
        this.visitado = estado;
    }

    marcarEncontrado(estado = true) {
        this.encontrado = estado;
    }

    limpiarEstados() {
        this.resaltado = false;
        this.visitado = false;
        this.encontrado = false;
        this.esNuevo = false;
    }

    estaAnimando() {
        if (!this.posicionDestino || !this.posicion) {
            return false;
        }
        
        const deltaX = this.posicionDestino.x - this.posicion.x;
        const deltaY = this.posicionDestino.y - this.posicion.y;
        const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        return distancia > 1;
    }

    // Métodos específicos para árboles
    esHoja() {
        return !this.izquierdo && !this.derecho;
    }

    tieneHijoIzquierdo() {
        return this.izquierdo !== null;
    }

    tieneHijoDerecho() {
        return this.derecho !== null;
    }

    tieneUnSoloHijo() {
        return (this.izquierdo && !this.derecho) || (!this.izquierdo && this.derecho);
    }

    tieneAmboHijos() {
        return this.izquierdo && this.derecho;
    }

    obtenerHijoUnico() {
        if (this.izquierdo && !this.derecho) return this.izquierdo;
        if (!this.izquierdo && this.derecho) return this.derecho;
        return null;
    }

    // Obtener estado visual del nodo
    obtenerEstadoVisual() {
        return {
            valor: this.valor,
            posicion: { ...this.posicion },
            posicionDestino: { ...this.posicionDestino },
            esNuevo: this.esNuevo,
            resaltado: this.resaltado,
            visitado: this.visitado,
            encontrado: this.encontrado,
            nivel: this.nivel
        };
    }
}