// ListaVisual.js
import NodoDL from './NodoDL.js';

export default class ListaVisual {
    static SeparacionX = 180;
    static AnchoNodo = 130;
    static AltoNodo = 65;
    static PosicionY = 150;
    
    constructor(nombre = 'lista') {
        this.nombre = nombre; // Agregar propiedad nombre
        this.nodos = [];
        this.posicionInicio = { x: 50, y: ListaVisual.PosicionY };
        this.animacionActiva = false;
        this.nodoParaEliminar = null;
        this.posicionEliminacion = { x: 0, y: -100 };
    }

    static ejecutarPaso(linea, listas, historialDeshacer) {
        const regexCrear = /ListaDoble\s+(\w+)\s*=\s*new\s+ListaDoble\(\);?/;
        const regexInsertarInicio = /(\w+)\.insertarInicio\(\s*["'](.+?)["']\s*\);?/;
        const regexInsertarFinal = /(\w+)\.insertarFinal\(\s*["'](.+?)["']\s*\);?/;
        const regexEliminarInicio = /(\w+)\.eliminarInicio\(\);?/;
        const regexEliminarFinal = /(\w+)\.eliminarFinal\(\);?/;
        const regexInsertarEn = /(\w+)\.insertarEn\(\s*(\d+)\s*,\s*["'](.+?)["']\s*\);?/;
        const regexEliminarEn = /(\w+)\.eliminarEn\(\s*(\d+)\s*\);?/;
        const regexBuscar = /(\w+)\.buscar\(\s*["'](.+?)["']\s*\);?/;

        let match;

        // Crear nueva lista - CORREGIDO: pasar el nombre al constructor
        if ((match = linea.match(regexCrear))) {
            const nombre = match[1];
            historialDeshacer.push(() => delete listas[nombre]);
            listas[nombre] = new ListaVisual(nombre); // Pasar el nombre
            return { tipo: 'exito', mensaje: `Lista doble ${nombre} creada` };
        }

        // Insertar al inicio
        if ((match = linea.match(regexInsertarInicio))) {
            const nombre = match[1];
            const valor = match[2];
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };

            const accionDeshacer = () => lista.nodos.shift();
            historialDeshacer.push(accionDeshacer);
            
            const nuevoNodo = new NodoDL(valor);
            nuevoNodo.Posicion = { 
                x: lista.posicionInicio.x, 
                y: lista.posicionInicio.y - 80 
            };
            nuevoNodo.PosicionDestino = { 
                x: lista.posicionInicio.x, 
                y: lista.posicionInicio.y
            };
            nuevoNodo.Resaltado = true;
            lista.nodos.unshift(nuevoNodo);
            lista.recalcularPosiciones();
            
            return { tipo: 'exito', mensaje: `Insertado al inicio de ${nombre}: ${valor}` };
        }

        // Eliminar al inicio
        if ((match = linea.match(regexEliminarInicio))) {
            const nombre = match[1];
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };
            if (lista.nodos.length === 0) return { tipo: 'error', mensaje: `Lista ${nombre} está vacía` };

            const nodoEliminado = lista.nodos[0];
            const valorEliminado = nodoEliminado.Valor;
            
            const accionDeshacer = () => {
                lista.nodos.unshift(nodoEliminado);
                nodoEliminado.Posicion = { ...nodoEliminado.PosicionDestino };
                nodoEliminado.EsNuevo = false;
            };
            historialDeshacer.push(accionDeshacer);
            
            nodoEliminado.Resaltado = true;
            lista.nodoParaEliminar = nodoEliminado;
            lista.nodos.shift();
            lista.recalcularPosiciones();
            
            return { tipo: 'exito', mensaje: `Eliminado al inicio de ${nombre}: ${valorEliminado}` };
        }

        // Insertar al final
        if ((match = linea.match(regexInsertarFinal))) {
            const nombre = match[1];
            const valor = match[2];
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };

            const accionDeshacer = () => lista.nodos.pop();
            historialDeshacer.push(accionDeshacer);
            
            const posX = lista.nodos.length > 0 ? 
                lista.nodos[lista.nodos.length - 1].PosicionDestino.x + ListaVisual.SeparacionX : 
                lista.posicionInicio.x;
            
            const nuevoNodo = new NodoDL(valor);
            nuevoNodo.Posicion = { 
                x: posX, 
                y: lista.posicionInicio.y - 80 
            };
            nuevoNodo.PosicionDestino = { 
                x: posX, 
                y: lista.posicionInicio.y
            };
            nuevoNodo.Resaltado = true;
            lista.nodos.push(nuevoNodo);
            lista.recalcularPosiciones();
            
            return { tipo: 'exito', mensaje: `Insertado al final de ${nombre}: ${valor}` };
        }

        // Eliminar al final - CORREGIDO: eliminar parámetro 'valor' innecesario
        if ((match = linea.match(regexEliminarFinal))) {
            const nombre = match[1];
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };
            if (lista.nodos.length === 0) return { tipo: 'error', mensaje: `Lista ${nombre} está vacía` };

            const nodoEliminado = lista.nodos[lista.nodos.length - 1];
            const valorEliminado = nodoEliminado.Valor;
            
            const accionDeshacer = () => {
                lista.nodos.push(nodoEliminado);
                nodoEliminado.Posicion = { ...nodoEliminado.PosicionDestino };
                nodoEliminado.EsNuevo = false;
            };
            historialDeshacer.push(accionDeshacer);
            
            nodoEliminado.Resaltado = true;
            lista.nodoParaEliminar = nodoEliminado;
            lista.nodos.pop();
            lista.recalcularPosiciones();
            
            return { tipo: 'exito', mensaje: `Eliminado al final de ${nombre}: ${valorEliminado}` };
        }

        // Insertar en posición específica
        if ((match = linea.match(regexInsertarEn))) {
            const nombre = match[1];
            const posicion = parseInt(match[2]);
            const valor = match[3];
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };
            if (posicion < 0) return { tipo: 'error', mensaje: `Posición inválida: ${posicion}` };

            const accionDeshacer = () => {
                if (posicion < lista.nodos.length) {
                    lista.nodos.splice(posicion, 1);
                }
            };
            historialDeshacer.push(accionDeshacer);
            
            const nuevoNodo = new NodoDL(valor);
            const posX = lista.posicionInicio.x + posicion * ListaVisual.SeparacionX;
            nuevoNodo.Posicion = { 
                x: posX, 
                y: lista.posicionInicio.y - 80 
            };
            nuevoNodo.PosicionDestino = { 
                x: posX, 
                y: lista.posicionInicio.y
            };
            nuevoNodo.Resaltado = true;
            
            if (posicion >= lista.nodos.length) {
                lista.nodos.push(nuevoNodo);
            } else {
                lista.nodos.splice(posicion, 0, nuevoNodo);
            }
            
            lista.recalcularPosiciones();
            return { tipo: 'exito', mensaje: `Insertado en posición ${posicion} de ${nombre}: ${valor}` };
        }

        // Eliminar en posición específica
        if ((match = linea.match(regexEliminarEn))) {
            const nombre = match[1];
            const posicion = parseInt(match[2]);
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };
            if (lista.nodos.length === 0) return { tipo: 'error', mensaje: `Lista ${nombre} está vacía` };
            if (posicion < 0 || posicion >= lista.nodos.length) {
                return { 
                    tipo: 'error', 
                    mensaje: `Posición ${posicion} fuera de rango [0-${lista.nodos.length - 1}]`,
                    esErrorTamaño: true
                };
            }

            const nodoEliminado = lista.nodos[posicion];
            const valorEliminado = nodoEliminado.Valor;
            
            const accionDeshacer = () => {
                lista.nodos.splice(posicion, 0, nodoEliminado);
                nodoEliminado.Posicion = { ...nodoEliminado.PosicionDestino };
                nodoEliminado.EsNuevo = false;
            };
            historialDeshacer.push(accionDeshacer);
            
            nodoEliminado.Resaltado = true;
            lista.nodoParaEliminar = nodoEliminado;
            lista.nodos.splice(posicion, 1);
            lista.recalcularPosiciones();
            
            return { tipo: 'exito', mensaje: `Eliminado en posición ${posicion} de ${nombre}: ${valorEliminado}` };
        }

        // Buscar valor
        if ((match = linea.match(regexBuscar))) {
            const nombre = match[1];
            const valorBuscado = match[2];
            const lista = listas[nombre];
            if (!lista) return { tipo: 'error', mensaje: `Lista ${nombre} no encontrada` };

            const estadoAnterior = new Map();
            lista.nodos.forEach(nodo => {
                estadoAnterior.set(nodo, nodo.Resaltado);
            });
            
            historialDeshacer.push(() => {
                lista.nodos.forEach(nodo => {
                    if (estadoAnterior.has(nodo)) {
                        nodo.Resaltado = estadoAnterior.get(nodo);
                    }
                });
            });
            
            let encontrado = false;
            lista.nodos.forEach(nodo => {
                if (nodo.Valor === valorBuscado) {
                    nodo.Resaltado = true;
                    encontrado = true;
                } else {
                    nodo.Resaltado = false;
                }
            });
            
            return { 
                tipo: 'exito', 
                mensaje: encontrado ? 
                    `Valor "${valorBuscado}" encontrado en ${nombre}` : 
                    `Valor "${valorBuscado}" no encontrado en ${nombre}`
            };
        }

        return null;
    }

    hayAnimacionesActivas() {
        return this.animacionActiva || this.nodoParaEliminar !== null;
    }

    actualizarAnimacion() {
        this.animacionActiva = false;

        if (this.nodoParaEliminar) {
            const distY = this.posicionEliminacion.y - this.nodoParaEliminar.Posicion.y;
            if (Math.abs(distY) < 5) {
                this.nodoParaEliminar = null;
            } else {
                this.nodoParaEliminar.Posicion.y += distY * 0.2;
                this.animacionActiva = true;
            }
        }

        this.nodos.forEach(nodo => {
            if (nodo.actualizarAnimacion && nodo.actualizarAnimacion()) {
                this.animacionActiva = true;
            }
        });

        if (!this.animacionActiva) {
            this.recalcularPosiciones();
        }
    }

    recalcularPosiciones() {
        this.nodos.forEach((nodo, i) => {
            const nuevaPosicion = {
                x: this.posicionInicio.x + i * ListaVisual.SeparacionX,
                y: ListaVisual.PosicionY
            };

            if (!nodo.PosicionDestino || 
                nodo.PosicionDestino.x !== nuevaPosicion.x || 
                nodo.PosicionDestino.y !== nuevaPosicion.y) {
                
                nodo.PosicionDestino = { ...nuevaPosicion };
                if (!nodo.EsNuevo) {
                    this.animacionActiva = true;
                }
            }
        });
    }

    // MÉTODO CORREGIDO - obtenerEstadoVisual
    obtenerEstadoVisual() {
        return {
            tipo: 'listaDoble',
            nombre: this.nombre, // CORREGIDO: usar this.nombre en lugar de 'Bof'
            nodos: this.nodos.map(nodo => ({
                valor: nodo.Valor, // Mantener la mayúscula para consistencia con NodoDL
                posicion: nodo.Posicion ? { ...nodo.Posicion } : { x: 0, y: 0 },
                posicionDestino: nodo.PosicionDestino ? { ...nodo.PosicionDestino } : { x: 0, y: 0 },
                esNuevo: nodo.EsNuevo || false,
                resaltado: nodo.Resaltado || false,
                velocidadAnimacion: nodo.VelocidadAnimacion || 0.1
            })),
            posicion: { ...this.posicionInicio },
            configuracion: {
                separacionX: ListaVisual.SeparacionX,
                anchoNodo: ListaVisual.AnchoNodo,
                altoNodo: ListaVisual.AltoNodo,
                posicionY: ListaVisual.PosicionY
            },
            animacion: {
                hayAnimacionActiva: this.hayAnimacionesActivas(),
                nodoParaEliminar: this.nodoParaEliminar ? {
                    valor: this.nodoParaEliminar.Valor,
                    posicion: { ...this.nodoParaEliminar.Posicion }
                } : null,
                posicionEliminacion: { ...this.posicionEliminacion }
            },
            estadisticas: {
                totalNodos: this.nodos.length,
                nodosResaltados: this.nodos.filter(nodo => nodo.Resaltado).length,
                nodosNuevos: this.nodos.filter(nodo => nodo.EsNuevo).length
            }
        };
    }
}