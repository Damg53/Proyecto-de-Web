// GrafoVisual.js - Implementación completa para grafos
import NodoGrafo from './NodoGrafo.js';

export default class GrafoVisual {
    constructor(nombre = 'miGrafo', dirigido = false) {
        this.nombre = nombre;
        this.dirigido = dirigido;
        this.nodos = new Map(); // Map<valor, NodoGrafo>
        this.aristas = []; // Array de {origen, destino, peso, resaltada}
        this.tipoRecorrido = null; // 'dfs', 'bfs', 'dijkstra', etc.
        this.estadoRecorrido = [];
        this.ultimaOperacion = '';
    }

    // Métodos para crear y gestionar nodos
    agregarNodo(valor) {
        if (!this.nodos.has(valor)) {
            const nuevoNodo = new NodoGrafo(valor);
            this.nodos.set(valor, nuevoNodo);
            this.posicionarNodosCircular(); // Reorganizar posiciones
            this.ultimaOperacion = `Nodo ${valor} agregado`;
            return nuevoNodo;
        }
        this.ultimaOperacion = `El nodo ${valor} ya existe`;
        return this.nodos.get(valor);
    }

    eliminarNodo(valor) {
        if (this.nodos.has(valor)) {
            const nodo = this.nodos.get(valor);
            
            // Eliminar todas las aristas que involucren este nodo
            this.aristas = this.aristas.filter(arista => 
                arista.origen.valor !== valor && arista.destino.valor !== valor
            );
            
            // Remover de las listas de adyacencia de otros nodos
            for (let [, otroNodo] of this.nodos) {
                otroNodo.removerAdyacente(nodo);
            }
            
            this.nodos.delete(valor);
            this.posicionarNodosCircular();
            this.ultimaOperacion = `Nodo ${valor} eliminado`;
            return true;
        }
        this.ultimaOperacion = `El nodo ${valor} no existe`;
        return false;
    }

    // Métodos para crear y gestionar aristas
    agregarArista(valorOrigen, valorDestino, peso = 1) {
        const nodoOrigen = this.nodos.get(valorOrigen);
        const nodoDestino = this.nodos.get(valorDestino);
        
        if (!nodoOrigen || !nodoDestino) {
            this.ultimaOperacion = `Error: nodos no encontrados (${valorOrigen}, ${valorDestino})`;
            return false;
        }

        // Verificar si la arista ya existe
        const aristaExiste = this.aristas.some(arista => 
            arista.origen.valor === valorOrigen && arista.destino.valor === valorDestino
        );

        if (!aristaExiste) {
            // Agregar arista al array de aristas
            this.aristas.push({
                origen: nodoOrigen,
                destino: nodoDestino,
                peso: peso,
                resaltada: false
            });

            // Actualizar listas de adyacencia
            nodoOrigen.agregarAdyacente(nodoDestino, peso);
            
            // Si no es dirigido, agregar la arista inversa
            if (!this.dirigido) {
                nodoDestino.agregarAdyacente(nodoOrigen, peso);
                // También agregar la arista visual inversa si no existe
                const aristaInversaExiste = this.aristas.some(arista => 
                    arista.origen.valor === valorDestino && arista.destino.valor === valorOrigen
                );
                if (!aristaInversaExiste) {
                    this.aristas.push({
                        origen: nodoDestino,
                        destino: nodoOrigen,
                        peso: peso,
                        resaltada: false
                    });
                }
            }

            this.ultimaOperacion = `Arista ${valorOrigen} → ${valorDestino} (peso: ${peso}) agregada`;
            return true;
        }
        
        this.ultimaOperacion = `La arista ${valorOrigen} → ${valorDestino} ya existe`;
        return false;
    }

    eliminarArista(valorOrigen, valorDestino) {
        const nodoOrigen = this.nodos.get(valorOrigen);
        const nodoDestino = this.nodos.get(valorDestino);
        
        if (!nodoOrigen || !nodoDestino) {
            this.ultimaOperacion = `Error: nodos no encontrados (${valorOrigen}, ${valorDestino})`;
            return false;
        }

        // Eliminar del array de aristas
        const longitudInicial = this.aristas.length;
        this.aristas = this.aristas.filter(arista => 
            !(arista.origen.valor === valorOrigen && arista.destino.valor === valorDestino)
        );

        // Remover de las listas de adyacencia
        nodoOrigen.removerAdyacente(nodoDestino);
        
        // Si no es dirigido, remover también la arista inversa
        if (!this.dirigido) {
            nodoDestino.removerAdyacente(nodoOrigen);
            this.aristas = this.aristas.filter(arista => 
                !(arista.origen.valor === valorDestino && arista.destino.valor === valorOrigen)
            );
        }

        if (this.aristas.length < longitudInicial) {
            this.ultimaOperacion = `Arista ${valorOrigen} → ${valorDestino} eliminada`;
            return true;
        }
        
        this.ultimaOperacion = `La arista ${valorOrigen} → ${valorDestino} no existe`;
        return false;
    }

    // Algoritmos de recorrido
    recorridoDFS(valorInicio) {
        this.limpiarEstadosVisuales();
        this.tipoRecorrido = 'dfs';
        this.estadoRecorrido = [];
        
        const nodoInicio = this.nodos.get(valorInicio);
        if (!nodoInicio) {
            this.ultimaOperacion = `Nodo ${valorInicio} no encontrado para DFS`;
            return [];
        }

        const visitados = new Set();
        const pila = [nodoInicio];
        
        while (pila.length > 0) {
            const nodoActual = pila.pop();
            
            if (!visitados.has(nodoActual)) {
                visitados.add(nodoActual);
                nodoActual.marcarVisitado(true);
                this.estadoRecorrido.push(nodoActual.valor);
                
                // Agregar adyacentes no visitados a la pila
                const adyacentes = nodoActual.obtenerAdyacentes();
                for (let i = adyacentes.length - 1; i >= 0; i--) {
                    if (!visitados.has(adyacentes[i])) {
                        pila.push(adyacentes[i]);
                    }
                }
            }
        }
        
        this.ultimaOperacion = `DFS desde ${valorInicio}: ${this.estadoRecorrido.join(' → ')}`;
        return this.estadoRecorrido;
    }

    recorridoBFS(valorInicio) {
        this.limpiarEstadosVisuales();
        this.tipoRecorrido = 'bfs';
        this.estadoRecorrido = [];
        
        const nodoInicio = this.nodos.get(valorInicio);
        if (!nodoInicio) {
            this.ultimaOperacion = `Nodo ${valorInicio} no encontrado para BFS`;
            return [];
        }

        const visitados = new Set();
        const cola = [nodoInicio];
        visitados.add(nodoInicio);
        
        while (cola.length > 0) {
            const nodoActual = cola.shift();
            nodoActual.marcarVisitado(true);
            this.estadoRecorrido.push(nodoActual.valor);
            
            // Agregar adyacentes no visitados a la cola
            const adyacentes = nodoActual.obtenerAdyacentes();
            for (let adyacente of adyacentes) {
                if (!visitados.has(adyacente)) {
                    visitados.add(adyacente);
                    cola.push(adyacente);
                }
            }
        }
        
        this.ultimaOperacion = `BFS desde ${valorInicio}: ${this.estadoRecorrido.join(' → ')}`;
        return this.estadoRecorrido;
    }

    // Algoritmo de Dijkstra para camino más corto
    dijkstra(valorInicio, valorFin = null) {
        this.limpiarEstadosVisuales();
        this.tipoRecorrido = 'dijkstra';
        
        const nodoInicio = this.nodos.get(valorInicio);
        if (!nodoInicio) {
            this.ultimaOperacion = `Nodo ${valorInicio} no encontrado para Dijkstra`;
            return null;
        }

        // Inicializar distancias
        for (let [, nodo] of this.nodos) {
            nodo.establecerDistancia(Infinity);
            nodo.establecerPredecesor(null);
        }
        nodoInicio.establecerDistancia(0);

        const noVisitados = new Set(this.nodos.values());
        
        while (noVisitados.size > 0) {
            // Encontrar nodo no visitado con menor distancia
            let nodoActual = null;
            let menorDistancia = Infinity;
            
            for (let nodo of noVisitados) {
                if (nodo.distancia < menorDistancia) {
                    menorDistancia = nodo.distancia;
                    nodoActual = nodo;
                }
            }
            
            if (nodoActual === null || nodoActual.distancia === Infinity) {
                break; // No hay más nodos alcanzables
            }
            
            noVisitados.delete(nodoActual);
            nodoActual.marcarProcesado(true);
            
            // Actualizar distancias de nodos adyacentes
            for (let [adyacente, peso] of nodoActual.adyacentes) {
                if (noVisitados.has(adyacente)) {
                    const nuevaDistancia = nodoActual.distancia + peso;
                    if (nuevaDistancia < adyacente.distancia) {
                        adyacente.establecerDistancia(nuevaDistancia);
                        adyacente.establecerPredecesor(nodoActual);
                    }
                }
            }
        }
        
        // Resaltar camino si se especifica un nodo final
        if (valorFin && this.nodos.has(valorFin)) {
            this.resaltarCamino(valorInicio, valorFin);
        }
        
        this.ultimaOperacion = `Dijkstra desde ${valorInicio} completado`;
        return this.obtenerDistancias();
    }

    resaltarCamino(valorInicio, valorFin) {
        const nodoFin = this.nodos.get(valorFin);
        if (!nodoFin || nodoFin.distancia === Infinity) {
            return false;
        }

        // Reconstruir camino
        const camino = [];
        let nodoActual = nodoFin;
        while (nodoActual !== null) {
            camino.unshift(nodoActual);
            nodoActual.marcarEncontrado(true);
            nodoActual = nodoActual.predecesor;
        }

        // Resaltar aristas del camino
        for (let i = 0; i < camino.length - 1; i++) {
            const origen = camino[i];
            const destino = camino[i + 1];
            
            for (let arista of this.aristas) {
                if (arista.origen === origen && arista.destino === destino) {
                    arista.resaltada = true;
                }
            }
        }

        return camino.map(nodo => nodo.valor);
    }

    obtenerDistancias() {
        const distancias = {};
        for (let [valor, nodo] of this.nodos) {
            distancias[valor] = nodo.distancia === Infinity ? '∞' : nodo.distancia;
        }
        return distancias;
    }

    // Posicionamiento automático de nodos en círculo
    posicionarNodosCircular() {
        const nodos = Array.from(this.nodos.values());
        const total = nodos.length;
        
        if (total === 0) return;
        
        const centerX = 400;
        const centerY = 300;
        const radio = Math.min(150, 50 + total * 10);
        
        nodos.forEach((nodo, index) => {
            const angulo = (2 * Math.PI * index) / total;
            const x = centerX + radio * Math.cos(angulo);
            const y = centerY + radio * Math.sin(angulo);
            
            if (nodo.esNuevo) {
                nodo.establecerPosicion(x, y);
            } else {
                nodo.moverHacia(x, y);
            }
        });
    }

    buscarNodo(valor) {
        this.limpiarEstadosVisuales();
        const nodo = this.nodos.get(valor);
        if (nodo) {
            nodo.marcarEncontrado(true);
            this.ultimaOperacion = `Nodo ${valor} encontrado`;
            return nodo;
        }
        this.ultimaOperacion = `Nodo ${valor} no encontrado`;
        return null;
    }

    limpiarEstadosVisuales() {
        // Limpiar estados de nodos
        for (let [, nodo] of this.nodos) {
            nodo.limpiarEstados();
        }
        
        // Limpiar estados de aristas
        this.aristas.forEach(arista => {
            arista.resaltada = false;
        });
        
        this.tipoRecorrido = null;
        this.estadoRecorrido = [];
    }

    obtenerEstadoVisual() {
        return {
            tipo: 'grafo',
            nombre: this.nombre,
            dirigido: this.dirigido,
            nodos: Array.from(this.nodos.values()).map(nodo => nodo.obtenerEstadoVisual()),
            aristas: this.aristas.map(arista => ({
                origen: arista.origen.valor,
                destino: arista.destino.valor,
                peso: arista.peso,
                resaltada: arista.resaltada,
                posicionOrigen: arista.origen.posicion,
                posicionDestino: arista.destino.posicion
            })),
            ultimaOperacion: this.ultimaOperacion,
            tipoRecorrido: this.tipoRecorrido,
            estadoRecorrido: [...this.estadoRecorrido],
            totalNodos: this.nodos.size,
            totalAristas: this.aristas.length
        };
    }

    // Métodos estáticos para el interpretador
    static ejecutarPaso(linea, grafos, historialDeshacer) {
        // Remover espacios y comentarios
        linea = linea.trim();
        if (linea.startsWith('//') || linea === '') return null;

        try {
            // Creación de grafo: Grafo miGrafo = new Grafo(dirigido?);
            let match = linea.match(/(\w+)\s+(\w+)\s*=\s*new\s+Grafo\s*\(\s*(true|false)?\s*\)\s*;?/);
            if (match) {
                const [, tipo, nombre, dirigidoStr] = match;
                const dirigido = dirigidoStr === 'true';
                const nuevoGrafo = new GrafoVisual(nombre, dirigido);
                grafos[nombre] = nuevoGrafo;
                
                historialDeshacer.push(() => {
                    delete grafos[nombre];
                });
                
                return `Grafo ${nombre} ${dirigido ? 'dirigido' : 'no dirigido'} creado`;
            }

            // Agregar nodo: grafo.agregarNodo(valor);
            match = linea.match(/(\w+)\.agregarNodo\s*\(\s*([^)]+)\s*\)\s*;?/);
            if (match) {
                const [, nombreGrafo, valor] = match;
                const grafo = grafos[nombreGrafo];
                if (grafo) {
                    const valorLimpio = valor.replace(/['"]/g, '');
                    const estadoAnterior = grafo.nodos.has(valorLimpio);
                    grafo.agregarNodo(valorLimpio);
                    
                    if (!estadoAnterior) {
                        historialDeshacer.push(() => {
                            grafo.eliminarNodo(valorLimpio);
                        });
                    }
                    
                    return grafo.ultimaOperacion;
                }
                return `Error: Grafo ${nombreGrafo} no encontrado`;
            }

            // Agregar arista: grafo.agregarArista(origen, destino, peso?);
            match = linea.match(/(\w+)\.agregarArista\s*\(\s*([^,]+)\s*,\s*([^,)]+)(?:\s*,\s*([^)]+))?\s*\)\s*;?/);
            if (match) {
                const [, nombreGrafo, origen, destino, peso] = match;
                const grafo = grafos[nombreGrafo];
                if (grafo) {
                    const valorOrigen = origen.replace(/['"]/g, '');
                    const valorDestino = destino.replace(/['"]/g, '');
                    const pesoNumerico = peso ? parseFloat(peso) : 1;
                    
                    const exito = grafo.agregarArista(valorOrigen, valorDestino, pesoNumerico);
                    if (exito) {
                        historialDeshacer.push(() => {
                            grafo.eliminarArista(valorOrigen, valorDestino);
                        });
                    }
                    
                    return grafo.ultimaOperacion;
                }
                return `Error: Grafo ${nombreGrafo} no encontrado`;
            }

            // Recorrido DFS: grafo.dfs(inicio);
            match = linea.match(/(\w+)\.dfs\s*\(\s*([^)]+)\s*\)\s*;?/);
            if (match) {
                const [, nombreGrafo, inicio] = match;
                const grafo = grafos[nombreGrafo];
                if (grafo) {
                    const valorInicio = inicio.replace(/['"]/g, '');
                    grafo.recorridoDFS(valorInicio);
                    
                    historialDeshacer.push(() => {
                        grafo.limpiarEstadosVisuales();
                    });
                    
                    return grafo.ultimaOperacion;
                }
                return `Error: Grafo ${nombreGrafo} no encontrado`;
            }

            // Recorrido BFS: grafo.bfs(inicio);
            match = linea.match(/(\w+)\.bfs\s*\(\s*([^)]+)\s*\)\s*;?/);
            if (match) {
                const [, nombreGrafo, inicio] = match;
                const grafo = grafos[nombreGrafo];
                if (grafo) {
                    const valorInicio = inicio.replace(/['"]/g, '');
                    grafo.recorridoBFS(valorInicio);
                    
                    historialDeshacer.push(() => {
                        grafo.limpiarEstadosVisuales();
                    });
                    
                    return grafo.ultimaOperacion;
                }
                return `Error: Grafo ${nombreGrafo} no encontrado`;
            }

            // Algoritmo de Dijkstra: grafo.dijkstra(inicio, fin?);
            match = linea.match(/(\w+)\.dijkstra\s*\(\s*([^,)]+)(?:\s*,\s*([^)]+))?\s*\)\s*;?/);
            if (match) {
                const [, nombreGrafo, inicio, fin] = match;
                const grafo = grafos[nombreGrafo];
                if (grafo) {
                    const valorInicio = inicio.replace(/['"]/g, '');
                    const valorFin = fin ? fin.replace(/['"]/g, '') : null;
                    grafo.dijkstra(valorInicio, valorFin);
                    
                    historialDeshacer.push(() => {
                        grafo.limpiarEstadosVisuales();
                    });
                    
                    return grafo.ultimaOperacion;
                }
                return `Error: Grafo ${nombreGrafo} no encontrado`;
            }

            // Buscar nodo: grafo.buscar(valor);
            match = linea.match(/(\w+)\.buscar\s*\(\s*([^)]+)\s*\)\s*;?/);
            if (match) {
                const [, nombreGrafo, valor] = match;
                const grafo = grafos[nombreGrafo];
                if (grafo) {
                    const valorLimpio = valor.replace(/['"]/g, '');
                    grafo.buscarNodo(valorLimpio);
                    
                    historialDeshacer.push(() => {
                        grafo.limpiarEstadosVisuales();
                    });
                    
                    return grafo.ultimaOperacion;
                }
                return `Error: Grafo ${nombreGrafo} no encontrado`;
            }

            return null; // No es una operación de grafo válida
            
        } catch (error) {
            return `Error en línea: ${linea} - ${error.message}`;
        }
    }
}