// VectorVisual.js
class VectorVisual {
    constructor(nombre, tamaño) {
        this.nombre = nombre;
        this.tamaño = tamaño;
        this.elementos = new Array(tamaño).fill(null);
        this.indicesAsignados = new Set();
        this.ultimoIndiceModificado = null;
    }

    asignarValor(indice, valor) {
        if (indice < 0 || indice >= this.tamaño) {
            throw new Error(`Índice ${indice} fuera de rango. El vector '${this.nombre}' tiene tamaño ${this.tamaño} (índices válidos: 0-${this.tamaño - 1})`);
        }

        this.elementos[indice] = valor;
        if (valor === null || valor === undefined) {
            this.indicesAsignados.delete(indice);
        } else {
            this.indicesAsignados.add(indice);
        }
        this.ultimoIndiceModificado = indice;
    }

    obtenerValor(indice) {
        if (indice < 0 || indice >= this.tamaño) {
            throw new Error(`Índice ${indice} fuera de rango`);
        }
        return this.elementos[indice];
    }

    obtenerEstadoVisual() {
        return {
            nombre: this.nombre,
            tamaño: this.tamaño,
            elementos: this.elementos.map((elemento, indice) => ({
                indice,
                valor: elemento !== null && elemento !== undefined ? elemento.toString() : "∅",
                asignado: this.indicesAsignados.has(indice),
                modificadoRecientemente: this.ultimoIndiceModificado === indice
            }))
        };
    }

    static ejecutarPaso(linea, vectores, historialDeshacer) {
        try {
            if (linea.includes("new") && linea.includes("[")) {
                const regex = /(\w+)\s+(\w+)\s*=\s*new\s+\w+\[(\d+)\]/;
                const match = linea.match(regex);
                
                if (match) {
                    const nombre = match[2];
                    const tamaño = parseInt(match[3]);
                    
                    vectores[nombre] = new VectorVisual(nombre, tamaño);
                    historialDeshacer.push(() => delete vectores[nombre]);
                    return {
                        tipo: 'creacion',
                        mensaje: `Vector ${nombre} creado con tamaño ${tamaño}`,
                        advertencia: tamaño > 10 ? 'Vectores grandes pueden ser difíciles de visualizar' : null
                    };
                }
            }
            
            if (linea.includes("[") && linea.includes("=")) {
                const regex = /(\w+)\[(\d+)\]\s*=\s*([^;]+)/;
                const match = linea.match(regex);
                
                if (match) {
                    const nombre = match[1];
                    const indice = parseInt(match[2]);
                    const valor = match[3].trim();
                    
                    if (!vectores[nombre]) {
                        throw new Error(`Vector '${nombre}' no existe`);
                    }

                    const valorAnterior = vectores[nombre].obtenerValor(indice);
                    vectores[nombre].asignarValor(indice, valor);
                    historialDeshacer.push(() => vectores[nombre].asignarValor(indice, valorAnterior));
                    
                    return {
                        tipo: 'asignacion',
                        mensaje: `${nombre}[${indice}] = ${valor}`,
                        valorAnterior: valorAnterior !== null ? valorAnterior.toString() : "∅"
                    };
                }
            }
            
            const accesoRegex = /(\w+)\s*=\s*(\w+)\[(\d+)\]/;
            const accesoMatch = linea.match(accesoRegex);
            
            if (accesoMatch) {
                const variable = accesoMatch[1];
                const nombreVector = accesoMatch[2];
                const indice = parseInt(accesoMatch[3]);
                
                if (!vectores[nombreVector]) {
                    throw new Error(`Vector '${nombreVector}' no existe`);
                }

                const valor = vectores[nombreVector].obtenerValor(indice);
                return {
                    tipo: 'acceso',
                    mensaje: `${variable} = ${nombreVector}[${indice}] (valor: ${valor !== null ? valor : "∅"})`
                };
            }
            
            throw new Error(`Línea no reconocida: ${linea}`);
            
        } catch (error) {
            return {
                tipo: 'error',
                mensaje: `Error: ${error.message}`,
                esErrorTamaño: error.message.includes('fuera de rango')
            };
        }
    }
}

export default VectorVisual;