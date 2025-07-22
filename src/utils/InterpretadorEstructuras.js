// InterpretadorEstructuras.js - Actualizado con soporte para árboles, grafos y pilas
import VectorVisual from './VectorVisual.js';
import MatrizVisual from './MatrizVisual.js';
import ListaVisual from './ListaVisual.js';
import ArbolVisual from './ArbolVisual.js';
import GrafoVisual from './GrafoVisual.js';
import PilaVisual from './PilaVisual.js';

class InterpretadorEstructuras {
    constructor() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {}; // Estructura para árboles
        this.grafos = {}; // Nueva estructura para grafos
        this.pilas = {}; // Soporte para pilas
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.lineasCodigo = [];
        this.resultadoEjecucion = [];
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
        this.pilas = {}; // Limpiar pilas también
        this.historialDeshacer = [];
    }

    limpiarEstructuras() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {};
        this.grafos = {};
        this.pilas = {};
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.resultadoEjecucion = [];
    }

    limpiarTodo() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.arboles = {};
        this.grafos = {};
        this.pilas = {};
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.resultadoEjecucion = [];
        this.lineasCodigo = [];
    }

    ejecutarTodo() {
        this.resultadoEjecucion = [];

        for (let i = 0; i < this.lineasCodigo.length; i++) {
            const resultado = this.ejecutarPaso(i);
            this.resultadoEjecucion.push(resultado);
        }

        this.pasoActual = this.lineasCodigo.length;
        return this.obtenerEstadoCompleto();
    }

    ejecutarSiguientePaso() {
        if (this.pasoActual < this.lineasCodigo.length) {
            const resultado = this.ejecutarPaso(this.pasoActual);
            this.resultadoEjecucion.push(resultado);
            this.pasoActual++;
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
            return this.obtenerEstadoCompleto();
        }
        return null;
    }

    ejecutarPaso(indicePaso) {
        const linea = this.lineasCodigo[indicePaso];

        try {
            PilaVisual.ejecutarPaso(linea, this.pilas, this.historialDeshacer);
            if (this.seEjecutoPila(linea)) return `Operación de pila ejecutada: ${linea}`;
        } catch (e) { console.warn('No es operación de pila:', e.message); }

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
        const patrones = [/Pila\s+(\w+)\s*=\s*new\s+Pila/, /(\w+)\.push\(/, /(\w+)\.pop\(/, /(\w+)\.peek\(/, /(\w+)\.clear\(/];
        return patrones.some(p => p.test(linea));
    }

    reiniciar() {
        this.limpiarTodo();
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

        return {
            estructuras: [...vectores, ...matrices, ...listas, ...arboles, ...grafos, ...pilas],
            pasoActual: this.pasoActual,
            totalPasos: this.lineasCodigo.length,
            resultadoEjecucion: this.resultadoEjecucion,
            puedeAvanzar: this.pasoActual < this.lineasCodigo.length,
            puedeRetroceder: this.pasoActual > 0,
            pilas: this.pilas
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
            default:
                return [];
        }
    }
}

export default InterpretadorEstructuras;
