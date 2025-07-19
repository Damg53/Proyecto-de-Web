// MatrizVisual.js
class MatrizVisual {
    constructor(nombre, filas, columnas) {
        this.nombre = nombre;
        this.filas = filas;
        this.columnas = columnas;
        this.elementos = Array.from({ length: filas }, () => 
            new Array(columnas).fill(null)
        );
        this.celdasAsignadas = Array.from({ length: filas }, () => 
            new Array(columnas).fill(false)
        );
        this.ultimaCeldaModificada = null;
    }

    asignarValor(fila, columna, valor) {
        if (fila < 0 || fila >= this.filas || columna < 0 || columna >= this.columnas) {
            throw new Error(`Celda [${fila}][${columna}] fuera de rango. Matriz '${this.nombre}' tiene tamaño ${this.filas}x${this.columnas}`);
        }

        this.elementos[fila][columna] = valor;
        this.celdasAsignadas[fila][columna] = (valor !== null && valor !== undefined);
        this.ultimaCeldaModificada = { fila, columna };
    }

    obtenerValor(fila, columna) {
        if (fila < 0 || fila >= this.filas || columna < 0 || columna >= this.columnas) {
            throw new Error(`Celda [${fila}][${columna}] fuera de rango`);
        }
        return this.elementos[fila][columna];
    }

    obtenerEstadoVisual() {
        return {
            nombre: this.nombre,
            filas: this.filas,
            columnas: this.columnas,
            elementos: this.elementos.map((fila, i) => ({
                fila: i,
                columnas: fila.map((elemento, j) => ({
                    columna: j,
                    valor: elemento !== null && elemento !== undefined ? elemento.toString() : "∅",
                    asignado: this.celdasAsignadas[i][j],
                    modificadoRecientemente: this.ultimaCeldaModificada && 
                                        this.ultimaCeldaModificada.fila === i && 
                                        this.ultimaCeldaModificada.columna === j
                }))
            }))
        };
    }

    static ejecutarPaso(linea, matrices, historialDeshacer) {
        try {
            if (linea.includes("new") && linea.includes("[") && linea.includes("][")) {
                const regex = /(\w+)\s+(\w+)\s*=\s*new\s+\w+\[(\d+)\]\[(\d+)\]/;
                const match = linea.match(regex);
                
                if (match) {
                    const nombre = match[2];
                    const filas = parseInt(match[3]);
                    const columnas = parseInt(match[4]);
                    
                    matrices[nombre] = new MatrizVisual(nombre, filas, columnas);
                    historialDeshacer.push(() => delete matrices[nombre]);
                    return {
                        tipo: 'creacion',
                        mensaje: `Matriz ${nombre} creada con tamaño ${filas}x${columnas}`,
                        advertencia: filas * columnas > 25 ? 'Matrices grandes pueden ser difíciles de visualizar' : null
                    };
                }
            }
            
            if (linea.includes("[") && linea.includes("][") && linea.includes("=")) {
                const regex = /(\w+)\[(\d+)\]\[(\d+)\]\s*=\s*([^;]+)/;
                const match = linea.match(regex);
                
                if (match) {
                    const nombre = match[1];
                    const fila = parseInt(match[2]);
                    const columna = parseInt(match[3]);
                    const valor = match[4].trim();
                    
                    if (!matrices[nombre]) {
                        throw new Error(`Matriz '${nombre}' no existe`);
                    }

                    const valorAnterior = matrices[nombre].obtenerValor(fila, columna);
                    matrices[nombre].asignarValor(fila, columna, valor);
                    historialDeshacer.push(() => matrices[nombre].asignarValor(fila, columna, valorAnterior));
                    
                    return {
                        tipo: 'asignacion',
                        mensaje: `${nombre}[${fila}][${columna}] = ${valor}`,
                        valorAnterior: valorAnterior !== null ? valorAnterior.toString() : "∅"
                    };
                }
            }
            
            const accesoRegex = /(\w+)\s*=\s*(\w+)\[(\d+)\]\[(\d+)\]/;
            const accesoMatch = linea.match(accesoRegex);
            
            if (accesoMatch) {
                const variable = accesoMatch[1];
                const nombreMatriz = accesoMatch[2];
                const fila = parseInt(accesoMatch[3]);
                const columna = parseInt(accesoMatch[4]);
                
                if (!matrices[nombreMatriz]) {
                    throw new Error(`Matriz '${nombreMatriz}' no existe`);
                }

                const valor = matrices[nombreMatriz].obtenerValor(fila, columna);
                return {
                    tipo: 'acceso',
                    mensaje: `${variable} = ${nombreMatriz}[${fila}][${columna}] (valor: ${valor !== null ? valor : "∅"})`
                };
            }
            
            return null;
        } catch (error) {
            return {
                tipo: 'error',
                mensaje: `Error en matriz: ${error.message}`,
                esErrorTamaño: error.message.includes('fuera de rango')
            };
        }
    }
}

export default MatrizVisual;