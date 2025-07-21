// NodoGrafo.js - Versión completa con visualización para grafos
export default class NodoGrafo {
    constructor(valor) {
        this.valor = valor;
        this.posicion = { x: 0, y: 0 };
        this.posicionDestino = { x: 0, y: 0 };
        this.esNuevo = true;
        this.resaltado = false;
        this.visitado = false; // Para recorridos DFS/BFS
        this.encontrado = false; // Para búsquedas
        this.procesado = false; // Para algoritmos como Dijkstra
        this.velocidadAnimacion = 0.1;
        this.adyacentes = new Map(); // Map<NodoGrafo, peso>
        this.color = '#007bff'; // Color por defecto
        this.distancia = Infinity; // Para algoritmos de camino más corto
        this.predecesor = null; // Para reconstruir caminos
        this.grado = 0; // Número de conexiones
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

    marcarProcesado(estado = true) {
        this.procesado = estado;
    }

    limpiarEstados() {
        this.resaltado = false;
        this.visitado = false;
        this.encontrado = false;
        this.procesado = false;
        this.esNuevo = false;
        this.distancia = Infinity;
        this.predecesor = null;
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

    // Métodos específicos para grafos
    agregarAdyacente(nodo, peso = 1) {
        if (!this.adyacentes.has(nodo)) {
            this.adyacentes.set(nodo, peso);
            this.grado++;
            return true;
        }
        return false;
    }

    removerAdyacente(nodo) {
        if (this.adyacentes.has(nodo)) {
            this.adyacentes.delete(nodo);
            this.grado--;
            return true;
        }
        return false;
    }

    esAdyacente(nodo) {
        return this.adyacentes.has(nodo);
    }

    obtenerPesoArista(nodo) {
        return this.adyacentes.get(nodo) || null;
    }

    obtenerAdyacentes() {
        return Array.from(this.adyacentes.keys());
    }

    obtenerAristasConPesos() {
        return Array.from(this.adyacentes.entries());
    }

    establecerDistancia(dist) {
        this.distancia = dist;
    }

    establecerPredecesor(nodo) {
        this.predecesor = nodo;
    }

    establecerColor(color) {
        this.color = color;
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
            procesado: this.procesado,
            color: this.color,
            distancia: this.distancia,
            grado: this.grado,
            adyacentes: this.obtenerAdyacentes().map(nodo => ({
                valor: nodo.valor,
                peso: this.obtenerPesoArista(nodo)
            }))
        };
    }
}