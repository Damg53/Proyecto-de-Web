// InterpretadorEstructuras.js - Actualizado con soporte completo para colas animadas
import VectorVisual from './VectorVisual.js';
import MatrizVisual from './MatrizVisual.js';
import ListaVisual from './ListaVisual.js';
import ArbolVisual from './ArbolVisual.js';
import GrafoVisual from './GrafoVisual.js';
import PilaVisual from './PilaVisual.js';
import ColaVisual from './ColaVisual.js';


class InterpretadorEstructuras {
    constructor() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {};
        this.grafos = {};
        this.pilas = {};
        this.colas = {}; // Soporte para colas con animaciones
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.lineasCodigo = [];
        this.resultadoEjecucion = [];
        
        // Configuración para animaciones
        this.animacionActiva = false;
        this.intervalAnimacion = null;
    }

    cargarCodigo(codigo) {
        this.lineasCodigo = codigo
            .split('\n')
            .map(linea => linea.trim())
            .filter(linea => linea.length > 0 && !linea.startsWith('//'));

        this.pasoActual = 0;
        this.resultadoEjecucion = [];
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {};
        this.grafos = {};
        this.pilas = {};
        this.colas = {};
        this.historialDeshacer = [];
        
        // Detener animaciones previas
        this.detenerAnimaciones();
    }

    limpiarEstructuras() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {};
        this.grafos = {};
        this.pilas = {};
        this.colas = {};
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.resultadoEjecucion = [];
        this.detenerAnimaciones();
    }

    limpiarTodo() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {};
        this.grafos = {};
        this.pilas = {};
        this.colas = {};
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.resultadoEjecucion = [];
        this.lineasCodigo = [];
        this.detenerAnimaciones();
    }

    ejecutarTodo() {
        this.resultadoEjecucion = [];

        for (let i = 0; i < this.lineasCodigo.length; i++) {
            const resultado = this.ejecutarPaso(i);
            this.resultadoEjecucion.push(resultado);
        }

        this.pasoActual = this.lineasCodigo.length;
        this.iniciarAnimaciones();
        return this.obtenerEstadoCompleto();
    }

    ejecutarSiguientePaso() {
        if (this.pasoActual < this.lineasCodigo.length) {
            const resultado = this.ejecutarPaso(this.pasoActual);
            this.resultadoEjecucion.push(resultado);
            this.pasoActual++;
            this.iniciarAnimaciones();
            return this.obtenerEstadoCompleto();
        }
        return null;
    }

    ejecutarPasoAnterior() {
        if (this.pasoActual > 0 && this.historialDeshacer.length > 0) {
            const accionDeshacer = this.historialDeshacer.pop();
            accionDeshacer();
            this.pasoActual--;
            this.resultadoEjecucion.pop();
            this.iniciarAnimaciones();
            return this.obtenerEstadoCompleto();
        }
        return null;
    }

    ejecutarPaso(indicePaso) {
        const linea = this.lineasCodigo[indicePaso];

        // Intentar ejecutar como cola primero
        try {
            const resultadoCola = ColaVisual.ejecutarPaso(linea, this.colas, this.historialDeshacer);
            if (resultadoCola) return resultadoCola;
        } catch (e) { 
            console.warn('No es operación de cola:', e.message); 
        }

        // Intentar ejecutar como pila
        try {
            PilaVisual.ejecutarPaso(linea, this.pilas, this.historialDeshacer);
            if (this.seEjecutoPila(linea)) return `Operación de pila ejecutada: ${linea}`;
        } catch (e) { 
            console.warn('No es operación de pila:', e.message); 
        }

        // Resto de estructuras de datos
        const resultadoArbol = ArbolVisual.ejecutarPaso(linea, this.arboles, this.historialDeshacer);
        if (resultadoArbol) return resultadoArbol;

        const resultadoGrafo = GrafoVisual.ejecutarPaso(linea, this.grafos, this.historialDeshacer);
        if (resultadoGrafo) return resultadoGrafo;

        const resultadoMatriz = MatrizVisual.ejecutarPaso(linea, this.matrices, this.historialDeshacer);
        if (resultadoMatriz) return resultadoMatriz;

        const resultadoLista = ListaVisual.ejecutarPaso(linea, this.listas, this.historialDeshacer);
        if (resultadoLista) return resultadoLista;

        return VectorVisual.ejecutarPaso(linea, this.vectores, this.historialDeshacer);
    }

    seEjecutoPila(linea) {
        const patrones = [
            /Pila\s+(\w+)\s*=\s*new\s+Pila/, 
            /(\w+)\.push\(/, 
            /(\w+)\.pop\(/, 
            /(\w+)\.peek\(/, 
            /(\w+)\.clear\(/
        ];
        return patrones.some(p => p.test(linea));
    }

    seEjecutoCola(linea) {
        const patrones = [
            /Queue<[^>]*>\s+(\w+)\s*=\s*new\s+Queue<[^>]*>/, // Queue<string> cola = new Queue<string>()
            /(\w+)\.Enqueue\(/,                                // cola.Enqueue(valor)
            /(\w+)\.Dequeue\(/,                                // cola.Dequeue()
            /(\w+)\.Peek\(/,                                   // cola.Peek()
            /(\w+)\.Clear\(/                                   // cola.Clear()
        ];
        return patrones.some(p => p.test(linea));
    }

    reiniciar() {
        this.limpiarTodo();
    }

    // Métodos para manejo de animaciones
    iniciarAnimaciones() {
        if (!this.animacionActiva && this.hayAnimacionesActivas()) {
            this.animacionActiva = true;
            this.intervalAnimacion = setInterval(() => {
                this.actualizarAnimaciones();
            }, 16); // ~60 FPS
        }
    }

    detenerAnimaciones() {
        if (this.intervalAnimacion) {
            clearInterval(this.intervalAnimacion);
            this.intervalAnimacion = null;
        }
        this.animacionActiva = false;
    }

    actualizarAnimaciones() {
        let hayAnimacionesActivas = false;

        // Actualizar animaciones de colas
        Object.values(this.colas).forEach(cola => {
            if (cola && typeof cola.actualizarAnimacion === 'function') {
                const necesitaRedibujo = cola.actualizarAnimacion();
                if (necesitaRedibujo || cola.hayAnimacionesActivas()) {
                    hayAnimacionesActivas = true;
                }
            }
        });

        // Si no hay más animaciones activas, detener el loop
        if (!hayAnimacionesActivas) {
            this.detenerAnimaciones();
        }
    }

    hayAnimacionesActivas() {
        return Object.values(this.colas).some(cola => 
            cola && typeof cola.hayAnimacionesActivas === 'function' && cola.hayAnimacionesActivas()
        );
    }

    // Método para dibujar todas las estructuras (para usar con Canvas)
    dibujarEstructuras(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let x = 50;
        let y = 50;

        // Dibujar colas
        Object.values(this.colas).forEach(cola => {
            if (cola && typeof cola.dibujar === 'function') {
                y = cola.dibujar(ctx, x, y);
                y += 50; // Espaciado entre estructuras
            }
        });

        // Aquí se pueden agregar otros tipos de estructuras para dibujar
        // Pilas, vectores, etc.
    }

    obtenerEstadoCompleto() {
        const vectores = Object.values(this.vectores).map(v => v.obtenerEstadoVisual());
        const matrices = Object.values(this.matrices).map(m => m.obtenerEstadoVisual());
        const listas = Object.values(this.listas).map(l => l.obtenerEstadoVisual());
        const arboles = Object.values(this.arboles).map(a => a.obtenerEstadoVisual());
        const grafos = Object.values(this.grafos).map(g => g.obtenerEstadoVisual());
        const pilas = Object.values(this.pilas).map(p => ({
            tipo: 'pila',
            nombre: p.nombre,
            elementos: p.elementos?.map(e => e.valor || e) || [],
            posicion: p.posicionBase || { x: 0, y: 0 }
        }));
        const colas = Object.values(this.colas).map(c => c.obtenerEstadoVisual());

        return {
            estructuras: [...vectores, ...matrices, ...listas, ...arboles, ...grafos, ...pilas, ...colas],
            pasoActual: this.pasoActual,
            totalPasos: this.lineasCodigo.length,
            resultadoEjecucion: this.resultadoEjecucion,
            puedeAvanzar: this.pasoActual < this.lineasCodigo.length,
            puedeRetroceder: this.pasoActual > 0,
            pilas: this.pilas,
            colas: this.colas,
            hayAnimacionesActivas: this.hayAnimacionesActivas(),
            animacionActiva: this.animacionActiva
        };
    }

    obtenerEstructurasPorTipo(tipo) {
        switch(tipo.toLowerCase()) {
            case 'vector':
                return Object.values(this.vectores).map(v => v.obtenerEstadoVisual());
            case 'matriz':
                return Object.values(this.matrices).map(m => m.obtenerEstadoVisual());
            case 'lista':
            case 'lista doble':
            case 'lista simple':
                return Object.values(this.listas).map(l => l.obtenerEstadoVisual());
            case 'arbol':
            case 'arbol binario':
            case 'arboles':
                return Object.values(this.arboles).map(a => a.obtenerEstadoVisual());
            case 'grafo':
            case 'grafos':
                return Object.values(this.grafos).map(g => g.obtenerEstadoVisual());
            case 'pila':
            case 'stack':
                return Object.values(this.pilas).map(p => ({
                    tipo: 'pila',
                    nombre: p.nombre,
                    elementos: p.elementos?.map(e => e.valor || e) || [],
                    posicion: p.posicionBase || { x: 0, y: 0 }
                }));
            case 'cola':
            case 'queue':
                return Object.values(this.colas).map(c => c.obtenerEstadoVisual());
            default:
                return [];
        }
    }

    // Método para obtener información específica de colas
    obtenerInfoColas() {
        return {
            cantidad: Object.keys(this.colas).length,
            nombres: Object.keys(this.colas),
            estados: Object.values(this.colas).map(c => ({
                nombre: c.nombre,
                elementos: c.elementos,
                animacionesActivas: c.hayAnimacionesActivas(),
                personasEnMovimiento: c.personasEnMovimiento?.length || 0
            }))
        };
    }

    // Método para pausar/reanudar animaciones
    pausarAnimaciones() {
        this.detenerAnimaciones();
    }

    reanudarAnimaciones() {
        this.iniciarAnimaciones();
    }
}

export default InterpretadorEstructuras;