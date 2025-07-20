// ArbolVisual.js - Versión completa con búsqueda y recorridos mejorados
import NodoArbol from './NodoArbol.js';

export default class ArbolVisual {
    constructor(nombre = 'arbol') {
        this.nombre = nombre;
        this.raiz = null;
        this.nodos = [];
        this.animando = false;
        this.maxAncho = 800;
        this.maxAlto = 400;
        this.espacioVertical = 80;
        this.espacioHorizontalBase = 60;
        this.radioNodo = 25;
        this.ultimoRecorrido = [];
        this.ultimaBusqueda = null;
    }

    static ejecutarPaso(comando, arboles, historialDeshacer) {
        try {
            const instruccion = comando.trim();
            console.log('Ejecutando comando árbol:', instruccion);
            
            // Patrones para árbol binario
            const patronCrearArbol = /^([a-zA-Z_]\w*)\s*=\s*new\s+ArbolBinario\(\);?$/;
            const patronInsertar = /^([a-zA-Z_]\w*)\.insertar\(([^)]+)\);?$/;
            const patronEliminar = /^([a-zA-Z_]\w*)\.eliminar\(([^)]+)\);?$/;
            const patronBuscar = /^([a-zA-Z_]\w*)\.buscar\(([^)]+)\);?$/;
            const patronRecorrido = /^([a-zA-Z_]\w*)\.(inorder|preorder|postorder)\(\);?$/;
            
            let match;
            
            // Crear árbol binario
            if ((match = instruccion.match(patronCrearArbol))) {
                const nombreArbol = match[1];
                console.log('Creando árbol:', nombreArbol);
                
                const estadoAnterior = arboles[nombreArbol] ? 
                    ArbolVisual.clonarArbol(arboles[nombreArbol]) : null;
                
                historialDeshacer.push(() => {
                    if (estadoAnterior) {
                        arboles[nombreArbol] = estadoAnterior;
                    } else {
                        delete arboles[nombreArbol];
                    }
                });
                
                arboles[nombreArbol] = new ArbolVisual(nombreArbol);
                return `Árbol binario '${nombreArbol}' creado`;
            }
            
            // Insertar elemento
            if ((match = instruccion.match(patronInsertar))) {
                const nombreArbol = match[1];
                const valorStr = match[2].trim();
                
                let valor = valorStr.replace(/^["']|["']$/g, '');
                const numeroValor = parseFloat(valor);
                if (!isNaN(numeroValor) && isFinite(numeroValor)) {
                    valor = numeroValor;
                }
                
                if (!arboles[nombreArbol]) {
                    return `Error: Árbol '${nombreArbol}' no existe`;
                }
                
                const estadoAnterior = ArbolVisual.clonarArbol(arboles[nombreArbol]);
                historialDeshacer.push(() => {
                    arboles[nombreArbol] = estadoAnterior;
                });
                
                const resultado = arboles[nombreArbol].insertar(valor);
                return resultado;
            }
            
            // Eliminar elemento
            if ((match = instruccion.match(patronEliminar))) {
                const nombreArbol = match[1];
                const valorStr = match[2].trim();
                
                let valor = valorStr.replace(/^["']|["']$/g, '');
                const numeroValor = parseFloat(valor);
                if (!isNaN(numeroValor) && isFinite(numeroValor)) {
                    valor = numeroValor;
                }
                
                if (!arboles[nombreArbol]) {
                    return `Error: Árbol '${nombreArbol}' no existe`;
                }
                
                const estadoAnterior = ArbolVisual.clonarArbol(arboles[nombreArbol]);
                historialDeshacer.push(() => {
                    arboles[nombreArbol] = estadoAnterior;
                });
                
                const resultado = arboles[nombreArbol].eliminar(valor);
                return resultado;
            }
            
            // Buscar elemento
            if ((match = instruccion.match(patronBuscar))) {
                const nombreArbol = match[1];
                const valorStr = match[2].trim();
                
                let valor = valorStr.replace(/^["']|["']$/g, '');
                const numeroValor = parseFloat(valor);
                if (!isNaN(numeroValor) && isFinite(numeroValor)) {
                    valor = numeroValor;
                }
                
                if (!arboles[nombreArbol]) {
                    return `Error: Árbol '${nombreArbol}' no existe`;
                }
                
                // Mantener estado para la visualización
                const estadoAnterior = ArbolVisual.clonarArbol(arboles[nombreArbol]);
                historialDeshacer.push(() => {
                    arboles[nombreArbol] = estadoAnterior;
                });
                
                const resultado = arboles[nombreArbol].buscar(valor);
                return resultado;
            }
            
            // Recorridos
            if ((match = instruccion.match(patronRecorrido))) {
                const nombreArbol = match[1];
                const tipoRecorrido = match[2];
                
                if (!arboles[nombreArbol]) {
                    return `Error: Árbol '${nombreArbol}' no existe`;
                }
                
                // Mantener estado para la visualización
                const estadoAnterior = ArbolVisual.clonarArbol(arboles[nombreArbol]);
                historialDeshacer.push(() => {
                    arboles[nombreArbol] = estadoAnterior;
                });
                
                const resultado = arboles[nombreArbol].recorrer(tipoRecorrido);
                return resultado;
            }
            
            return null;
            
        } catch (error) {
            console.error('Error en ArbolVisual.ejecutarPaso:', error);
            return `Error: ${error.message}`;
        }
    }

    static clonarArbol(arbol) {
        const nuevoArbol = new ArbolVisual(arbol.nombre);
        
        if (arbol.raiz) {
            nuevoArbol.raiz = ArbolVisual.clonarNodo(arbol.raiz);
            nuevoArbol.nodos = ArbolVisual.recolectarNodos(nuevoArbol.raiz);
            nuevoArbol.calcularPosiciones();
        }
        
        nuevoArbol.ultimoRecorrido = [...arbol.ultimoRecorrido];
        nuevoArbol.ultimaBusqueda = arbol.ultimaBusqueda;
        
        return nuevoArbol;
    }

    static clonarNodo(nodo) {
        if (!nodo) return null;
        
        const nuevoNodo = new NodoArbol(nodo.valor);
        nuevoNodo.posicion = { ...nodo.posicion };
        nuevoNodo.posicionDestino = { ...nodo.posicionDestino };
        nuevoNodo.esNuevo = nodo.esNuevo;
        nuevoNodo.resaltado = nodo.resaltado;
        nuevoNodo.visitado = nodo.visitado;
        nuevoNodo.encontrado = nodo.encontrado;
        nuevoNodo.nivel = nodo.nivel;
        
        nuevoNodo.izquierdo = ArbolVisual.clonarNodo(nodo.izquierdo);
        nuevoNodo.derecho = ArbolVisual.clonarNodo(nodo.derecho);
        
        if (nuevoNodo.izquierdo) nuevoNodo.izquierdo.padre = nuevoNodo;
        if (nuevoNodo.derecho) nuevoNodo.derecho.padre = nuevoNodo;
        
        return nuevoNodo;
    }

    static recolectarNodos(nodo, lista = []) {
        if (!nodo) return lista;
        
        lista.push(nodo);
        ArbolVisual.recolectarNodos(nodo.izquierdo, lista);
        ArbolVisual.recolectarNodos(nodo.derecho, lista);
        
        return lista;
    }

    insertar(valor) {
        console.log('Insertando valor:', valor);
        const nuevoNodo = new NodoArbol(valor);
        
        if (!this.raiz) {
            this.raiz = nuevoNodo;
            nuevoNodo.nivel = 0;
            this.nodos = [nuevoNodo];
            this.calcularPosiciones();
            return `Nodo '${valor}' insertado como raíz`;
        }
        
        let actual = this.raiz;
        let padre = null;
        
        while (actual) {
            padre = actual;
            if (valor < actual.valor) {
                actual = actual.izquierdo;
            } else if (valor > actual.valor) {
                actual = actual.derecho;
            } else {
                return `Error: El valor '${valor}' ya existe en el árbol`;
            }
        }
        
        nuevoNodo.padre = padre;
        nuevoNodo.nivel = padre.nivel + 1;
        
        if (valor < padre.valor) {
            padre.izquierdo = nuevoNodo;
        } else {
            padre.derecho = nuevoNodo;
        }
        
        this.nodos.push(nuevoNodo);
        this.calcularPosiciones();
        
        return `Nodo '${valor}' insertado correctamente`;
    }

    eliminar(valor) {
        const nodo = this.buscarNodo(valor);
        if (!nodo) {
            return `Error: El valor '${valor}' no existe en el árbol`;
        }
        
        if (nodo.esHoja()) {
            this.eliminarNodoHoja(nodo);
        } else if (nodo.tieneUnSoloHijo()) {
            this.eliminarNodoUnHijo(nodo);
        } else {
            this.eliminarNodoDosHijos(nodo);
        }
        
        this.nodos = this.nodos.filter(n => n !== nodo);
        this.calcularPosiciones();
        
        return `Nodo '${valor}' eliminado correctamente`;
    }

    eliminarNodoHoja(nodo) {
        if (nodo === this.raiz) {
            this.raiz = null;
        } else if (nodo.padre.izquierdo === nodo) {
            nodo.padre.izquierdo = null;
        } else {
            nodo.padre.derecho = null;
        }
    }

    eliminarNodoUnHijo(nodo) {
        const hijo = nodo.obtenerHijoUnico();
        
        if (nodo === this.raiz) {
            this.raiz = hijo;
            hijo.padre = null;
        } else if (nodo.padre.izquierdo === nodo) {
            nodo.padre.izquierdo = hijo;
            hijo.padre = nodo.padre;
        } else {
            nodo.padre.derecho = hijo;
            hijo.padre = nodo.padre;
        }
        
        this.actualizarNiveles(hijo);
    }

    eliminarNodoDosHijos(nodo) {
        const sucesor = this.encontrarMinimo(nodo.derecho);
        nodo.valor = sucesor.valor;
        
        if (sucesor.esHoja()) {
            this.eliminarNodoHoja(sucesor);
        } else {
            this.eliminarNodoUnHijo(sucesor);
        }
        
        const indiceSuccesor = this.nodos.indexOf(sucesor);
        if (indiceSuccesor > -1) {
            this.nodos.splice(indiceSuccesor, 1);
        }
    }

    encontrarMinimo(nodo) {
        while (nodo.izquierdo) {
            nodo = nodo.izquierdo;
        }
        return nodo;
    }

    actualizarNiveles(nodo, nivelPadre = -1) {
        if (!nodo) return;
        
        nodo.nivel = nivelPadre + 1;
        this.actualizarNiveles(nodo.izquierdo, nodo.nivel);
        this.actualizarNiveles(nodo.derecho, nodo.nivel);
    }

    buscar(valor) {
        // Limpiar estados anteriores
        this.limpiarEstadosVisuales();
        
        const nodo = this.buscarNodo(valor);
        this.ultimaBusqueda = valor;
        
        if (nodo) {
            // Marcar el camino de búsqueda
            this.marcarCaminoBusqueda(valor);
            nodo.marcarEncontrado(true);
            return `Valor '${valor}' encontrado en el árbol`;
        } else {
            // Marcar el camino que se siguió hasta no encontrar el valor
            this.marcarCaminoBusqueda(valor);
            return `Valor '${valor}' no encontrado en el árbol`;
        }
    }

    buscarNodo(valor) {
        let actual = this.raiz;
        
        while (actual) {
            if (valor === actual.valor) {
                return actual;
            } else if (valor < actual.valor) {
                actual = actual.izquierdo;
            } else {
                actual = actual.derecho;
            }
        }
        
        return null;
    }

    marcarCaminoBusqueda(valor) {
        let actual = this.raiz;
        
        while (actual) {
            actual.resaltar(true);
            
            if (valor === actual.valor) {
                break;
            } else if (valor < actual.valor) {
                actual = actual.izquierdo;
            } else {
                actual = actual.derecho;
            }
        }
    }

    recorrer(tipo) {
        this.limpiarEstadosVisuales();
        const resultado = [];
        
        switch (tipo) {
            case 'inorder':
                this.recorridoInorden(this.raiz, resultado);
                break;
            case 'preorder':
                this.recorridoPreorden(this.raiz, resultado);
                break;
            case 'postorder':
                this.recorridoPostorden(this.raiz, resultado);
                break;
        }
        
        this.ultimoRecorrido = resultado;
        return `Recorrido ${tipo}: [${resultado.join(', ')}]`;
    }

    recorridoInorden(nodo, resultado) {
        if (!nodo) return;
        
        this.recorridoInorden(nodo.izquierdo, resultado);
        resultado.push(nodo.valor);
        nodo.marcarVisitado(true);
        this.recorridoInorden(nodo.derecho, resultado);
    }

    recorridoPreorden(nodo, resultado) {
        if (!nodo) return;
        
        resultado.push(nodo.valor);
        nodo.marcarVisitado(true);
        this.recorridoPreorden(nodo.izquierdo, resultado);
        this.recorridoPreorden(nodo.derecho, resultado);
    }

    recorridoPostorden(nodo, resultado) {
        if (!nodo) return;
        
        this.recorridoPostorden(nodo.izquierdo, resultado);
        this.recorridoPostorden(nodo.derecho, resultado);
        resultado.push(nodo.valor);
        nodo.marcarVisitado(true);
    }

    limpiarEstadosVisuales() {
        this.nodos.forEach(nodo => nodo.limpiarEstados());
    }

    calcularPosiciones() {
        if (!this.raiz) return;
        
        const anchuras = this.calcularAnchurasPorNivel();
        const alturaArbol = Math.max(...Object.keys(anchuras).map(k => parseInt(k))) + 1;
        
        this.asignarPosiciones(this.raiz, this.maxAncho / 2, 50, 0, anchuras, alturaArbol);
    }

    calcularAnchurasPorNivel() {
        const anchuras = {};
        
        const calcular = (nodo, nivel) => {
            if (!nodo) return;
            
            if (!anchuras[nivel]) anchuras[nivel] = 0;
            anchuras[nivel]++;
            
            calcular(nodo.izquierdo, nivel + 1);
            calcular(nodo.derecho, nivel + 1);
        };
        
        calcular(this.raiz, 0);
        return anchuras;
    }

    asignarPosiciones(nodo, x, y, nivel, anchuras, alturaTotal) {
        if (!nodo) return;
        
        nodo.moverHacia(x, y);
        nodo.nivel = nivel;
        
        if (nodo.izquierdo || nodo.derecho) {
            const espacioHorizontal = Math.max(
                this.espacioHorizontalBase,
                this.maxAncho / Math.pow(2, nivel + 2)
            );
            
            const yHijo = y + this.espacioVertical;
            
            if (nodo.izquierdo) {
                this.asignarPosiciones(
                    nodo.izquierdo,
                    x - espacioHorizontal,
                    yHijo,
                    nivel + 1,
                    anchuras,
                    alturaTotal
                );
            }
            
            if (nodo.derecho) {
                this.asignarPosiciones(
                    nodo.derecho,
                    x + espacioHorizontal,
                    yHijo,
                    nivel + 1,
                    anchuras,
                    alturaTotal
                );
            }
        }
    }

    obtenerEstadoVisual() {
        return {
            tipo: 'arbol',
            nombre: this.nombre,
            raiz: this.raiz,
            nodos: this.nodos || [],
            radioNodo: this.radioNodo,
            ultimoRecorrido: this.ultimoRecorrido,
            ultimaBusqueda: this.ultimaBusqueda
        };
    }
}