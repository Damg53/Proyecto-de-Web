// InterpretadorEstructuras.js
import VectorVisual from './VectorVisual.js';
import MatrizVisual from './MatrizVisual.js';
import ListaVisual from './ListaVisual.js';

class InterpretadorEstructuras {
    constructor() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
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
        this.historialDeshacer = [];
    }

    // NUEVO MÉTODO: Limpiar solo las estructuras sin afectar el código cargado
    limpiarEstructuras() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
        this.historialDeshacer = [];
        this.pasoActual = 0;
        this.resultadoEjecucion = [];
        // Mantener this.lineasCodigo para preservar el código cargado
    }

    // NUEVO MÉTODO: Limpiar todo completamente
    limpiarTodo() {
        this.vectores = {};
        this.matrices = {};
        this.listas = {};
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
        
        // Primero intenta con matrices
        const resultadoMatriz = MatrizVisual.ejecutarPaso(linea, this.matrices, this.historialDeshacer);
        if (resultadoMatriz) return resultadoMatriz;
        
        // Luego con listas
        const resultadoLista = ListaVisual.ejecutarPaso(linea, this.listas, this.historialDeshacer);
        if (resultadoLista) return resultadoLista;
        
        // Finalmente con vector
        return VectorVisual.ejecutarPaso(linea, this.vectores, this.historialDeshacer);
    }

    // MÉTODO MODIFICADO: Ahora es alias de limpiarTodo para mantener compatibilidad
    reiniciar() {
        this.limpiarTodo();
    }

    obtenerEstadoCompleto() {
        const vectores = Object.values(this.vectores).map(v => v.obtenerEstadoVisual());
        const matrices = Object.values(this.matrices).map(m => m.obtenerEstadoVisual());
        const listas = Object.values(this.listas).map(l => l.obtenerEstadoVisual());
        
        return {
            estructuras: [...vectores, ...matrices, ...listas],
            pasoActual: this.pasoActual,
            totalPasos: this.lineasCodigo.length,
            resultadoEjecucion: this.resultadoEjecucion,
            puedeAvanzar: this.pasoActual < this.lineasCodigo.length,
            puedeRetroceder: this.pasoActual > 0
        };
    }

    // NUEVO MÉTODO: Obtener solo las estructuras del tipo especificado
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
            default:
                return [];
        }
    }
}

export default InterpretadorEstructuras;