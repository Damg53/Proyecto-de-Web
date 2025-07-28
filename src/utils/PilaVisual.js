import LibroAnimado from './LibroAnimado.js';

class PilaVisual {
    constructor(nombre) {
        this.nombre = nombre;
        this.elementos = [];
        this.librosEnAnimacion = [];
        this.posicionBase = { x: 100, y: 400 };
        
        // Precargar imágenes de libros al crear la pila
        LibroAnimado.cargarImagenes().catch(error => {
            console.error('Error al cargar imágenes de libros:', error);
        });
        
        // Constantes - MEJORADAS
        this.ESPACIO_VERTICAL = 73; // Reducido de 45 a 25 para mejor apilamiento
        this.ANCHO_LIBRO = 160;
        this.ALTO_LIBRO = 80;
        this.ALTURA_BASE = 40; // Aumentado de 30 a 40 para mejor proporción
        this.VELOCIDAD_MANOS = 8; // Aumentado de 2 a 8 (4x más rápido)
        this.TAMAÑO_MANO = 80;
        
        // Configuración de manos
        this.posicionManoIzquierda = { x: 0, y: -110 };
        this.posicionManoDerecha = { x: 0, y: -110 };
        this.destinoManoIzquierda = { ...this.posicionManoIzquierda };
        this.destinoManoDerecha = { ...this.posicionManoDerecha };
        this.manosEnMovimiento = false;
        
        // Cargar imágenes de manos
        this.cargarImagenesManos();
    }
    
    cargarImagenesManos() {
        try {
            this.manoIzquierda = new Image();
            this.manoIzquierda.src = 'src/assets/ManoIzquierda.webp';
            
            this.manoDerecha = new Image();
            this.manoDerecha.src = 'src/assets/ManoDerecha.webp';
        } catch (error) {
            console.error('Error al cargar las imágenes de las manos:', error);
        }
    }
    
    setPosicion(nuevaPosicion) {
        const posicionAnterior = { ...this.posicionBase };
        this.posicionBase = { ...nuevaPosicion };
        
        // Actualizar posiciones de todos los libros en la pila con espaciado correcto
        if (this.elementos.length > 0) {
            for (let i = 0; i < this.elementos.length; i++) {
                const alturaPila = i * this.ESPACIO_VERTICAL;
                const nuevaPosicionLibro = {
                    x: nuevaPosicion.x,
                    y: nuevaPosicion.y - alturaPila - this.ALTO_LIBRO
                };
                this.elementos[i].posicion = { ...nuevaPosicionLibro };
                this.elementos[i].destino = { ...nuevaPosicionLibro };
            }
        }
        
        return posicionAnterior;
    }
    
    push(valor) {
        const nuevoLibro = new LibroAnimado(valor);
        const posicionInicial = { x: this.posicionBase.x, y: -this.ALTO_LIBRO };
        
        // Calcular la posición final correcta con el nuevo espaciado
        const alturaPila = this.elementos.length * this.ESPACIO_VERTICAL;
        const posicionFinal = {
            x: this.posicionBase.x,
            y: this.posicionBase.y - alturaPila - this.ALTO_LIBRO
        };
        
        nuevoLibro.iniciarCaida(posicionInicial, posicionFinal);
        this.librosEnAnimacion.push(nuevoLibro);
    }
    
    pop() {
        if (this.elementos.length > 0) {
            const libro = this.elementos.pop();
            const posicionSalida = { x: libro.posicion.x, y: -this.ALTO_LIBRO - 50 };
            
            this.configurarManosPop(libro.posicion);
            libro.iniciarCaida(libro.posicion, posicionSalida);
            libro.conManos = true;
            this.librosEnAnimacion.push(libro);
            
            // Reposicionar los libros restantes con el espaciado correcto
            this.reposicionarLibros();
        }
    }
    
    // Nuevo método para reposicionar libros después del pop
    reposicionarLibros() {
        for (let i = 0; i < this.elementos.length; i++) {
            const alturaPila = i * this.ESPACIO_VERTICAL;
            const nuevaPosicion = {
                x: this.posicionBase.x,
                y: this.posicionBase.y - alturaPila - this.ALTO_LIBRO
            };
            this.elementos[i].posicion = { ...nuevaPosicion };
            this.elementos[i].destino = { ...nuevaPosicion };
        }
    }
    
    configurarManosPop(posicionLibro) {
        try {
            this.posicionManoIzquierda = {
                x: posicionLibro.x - 10,
                y: posicionLibro.y + this.ALTO_LIBRO + 10
            };
            
            this.posicionManoDerecha = {
                x: posicionLibro.x + this.ANCHO_LIBRO - 20,
                y: posicionLibro.y + this.ALTO_LIBRO + 10
            };
            
            this.destinoManoIzquierda = {
                x: this.posicionManoIzquierda.x,
                y: -100
            };
            
            this.destinoManoDerecha = {
                x: this.posicionManoDerecha.x,
                y: -100
            };
            
            this.manosEnMovimiento = true;
        } catch (error) {
            console.error('Error al configurar las manos:', error);
            this.manosEnMovimiento = false;
        }
    }
    
    hayAnimacionesActivas() {
        return this.librosEnAnimacion.length > 0 || this.manosEnMovimiento;
    }
    
    actualizarAnimacion() {
        const librosCompletados = [];
        
        // Actualizar movimiento de manos con velocidad mejorada
        if (this.manosEnMovimiento) {
            const distanciaIzq = Math.abs(this.posicionManoIzquierda.y - this.destinoManoIzquierda.y);
            const distanciaDer = Math.abs(this.posicionManoDerecha.y - this.destinoManoDerecha.y);
            
            if (distanciaIzq > this.VELOCIDAD_MANOS) {
                this.posicionManoIzquierda.y -= this.VELOCIDAD_MANOS;
            } else {
                this.posicionManoIzquierda.y = this.destinoManoIzquierda.y;
            }
            
            if (distanciaDer > this.VELOCIDAD_MANOS) {
                this.posicionManoDerecha.y -= this.VELOCIDAD_MANOS;
            } else {
                this.posicionManoDerecha.y = this.destinoManoDerecha.y;
            }
            
            // Verificar si ambas manos han llegado a su destino
            if (this.posicionManoIzquierda.y === this.destinoManoIzquierda.y &&
                this.posicionManoDerecha.y === this.destinoManoDerecha.y) {
                this.manosEnMovimiento = false;
            }
        }
        
        // Actualizar libros en animación
        this.librosEnAnimacion.forEach(libro => {
            if (!libro.actualizarPosicion()) {
                librosCompletados.push(libro);
                
                // Si el libro no tiene manos y está cerca de la base, agregarlo a la pila
                if (!libro.conManos && 
                    Math.abs(libro.posicion.x - this.posicionBase.x) < 20 && 
                    libro.posicion.y <= this.posicionBase.y) {
                    
                    this.elementos.push(libro);
                    
                    // Establecer posición final correcta con espaciado mejorado
                    const alturaPila = (this.elementos.length - 1) * this.ESPACIO_VERTICAL;
                    libro.posicion = {
                        x: this.posicionBase.x,
                        y: this.posicionBase.y - alturaPila - this.ALTO_LIBRO
                    };
                    libro.destino = { ...libro.posicion };
                }
            } else if (libro.conManos) {
                // Sincronizar posición del libro con las manos durante el pop
                const promedioY = (this.posicionManoIzquierda.y + this.posicionManoDerecha.y) / 2;
                libro.posicion.y = promedioY - this.ALTO_LIBRO / 2;
            }
        });
        
        // Remover libros completados
        librosCompletados.forEach(libro => {
            const index = this.librosEnAnimacion.indexOf(libro);
            if (index > -1) {
                this.librosEnAnimacion.splice(index, 1);
            }
        });
    }
    
    dibujar(ctx) {
        // Guardar estado del contexto
        ctx.save();
        
        // Configurar suavizado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // TÍTULO CORREGIDO - POSICIÓN Y CENTRADO MEJORADOS
        const emoji = "📚";
        const titulo = `Pila ${this.nombre}`;

        // Configurar fuentes para medición correcta
        ctx.font = '30px "Segoe UI Emoji", Arial';
        const medidasEmoji = ctx.measureText(emoji);
        
        ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
        const medidasTitulo = ctx.measureText(titulo);
    
        const espacioEntreTitulos = 100;
        const anchoTotal = medidasEmoji.width + espacioEntreTitulos + medidasTitulo.width;
        
        // Centrar el título respecto al ancho del libro
        const xCentrado = this.posicionBase.x + (this.ANCHO_LIBRO / 2) - (anchoTotal / 2);
        const yTitulo = this.posicionBase.y + this.ALTURA_BASE + 45;
        
        // Calcular posiciones individuales
        const xEmoji = xCentrado;
        const xTexto = xEmoji + medidasEmoji.width + espacioEntreTitulos;
        
        // Fondo del título con mejor dimensionamiento
        const paddingHorizontal = 20;
        const paddingVertical = 12;
        const fondoRect = {
            x: xCentrado - paddingHorizontal,
            y: yTitulo - 22, // Ajustado para centrar verticalmente el texto
            width: anchoTotal + (paddingHorizontal * 2),
            height: 40
        };
        
        // Crear gradiente más sofisticado para el fondo
        const gradient = ctx.createLinearGradient(
            fondoRect.x, fondoRect.y,
            fondoRect.x + fondoRect.width, fondoRect.y + fondoRect.height
        );
        gradient.addColorStop(0, 'rgba(41, 98, 255, 0.9)');
        gradient.addColorStop(0.3, 'rgba(74, 144, 226, 0.9)');
        gradient.addColorStop(0.7, 'rgba(120, 119, 198, 0.9)');
        gradient.addColorStop(1, 'rgba(155, 89, 182, 0.9)');
        
        // Sombra del fondo del título
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        // Dibujar fondo redondeado con sombra
        ctx.fillStyle = gradient;
        this.dibujarRectanguloRedondeado(ctx, fondoRect.x, fondoRect.y, 
                                        fondoRect.width, fondoRect.height, 12);
        ctx.fill();
        
        // Quitar sombra para el resto
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Borde brillante del fondo
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Borde interior sutil
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        this.dibujarRectanguloRedondeado(ctx, fondoRect.x + 1, fondoRect.y + 1, 
                                        fondoRect.width - 2, fondoRect.height - 2, 11);
        ctx.stroke();
        
        // Sombra del texto
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '30px "Segoe UI Emoji", Arial';
        ctx.fillText(emoji, xEmoji + 1, yTitulo + 1);
        ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
        ctx.fillText(titulo, xTexto + 1, yTitulo + 1);
        
        // Texto principal con mejor posicionamiento
        ctx.fillStyle = 'white';
        ctx.font = '30px "Segoe UI Emoji", Arial';
        ctx.fillText(emoji, xEmoji, yTitulo);
        ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
        ctx.fillText(titulo, xTexto, yTitulo);
        
        // BASE MEJORADA - MÁS ELEGANTE Y DETALLADA
        const baseRect = {
            x: this.posicionBase.x - 5,
            y: this.posicionBase.y,
            width: this.ANCHO_LIBRO + 10,
            height: this.ALTURA_BASE
        };
        
        // Sombra de la base
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        
        // Gradiente más sofisticado para la base
        const baseGradient = ctx.createLinearGradient(
            baseRect.x, baseRect.y,
            baseRect.x, baseRect.y + baseRect.height
        );
        baseGradient.addColorStop(0, '#D4AF37');
        baseGradient.addColorStop(0.2, '#DAA520');
        baseGradient.addColorStop(0.5, '#B8860B');
        baseGradient.addColorStop(0.8, '#8B4513');
        baseGradient.addColorStop(1, '#654321');
        
        ctx.fillStyle = baseGradient;
        this.dibujarRectanguloRedondeado(ctx, baseRect.x, baseRect.y, 
                                        baseRect.width, baseRect.height, 6);
        ctx.fill();
        
        // Quitar sombra
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Borde principal de la base
        ctx.strokeStyle = '#2F1B14';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Borde interior brillante
        ctx.strokeStyle = 'rgba(255, 223, 0, 0.6)';
        ctx.lineWidth = 1.5;
        this.dibujarRectanguloRedondeado(ctx, baseRect.x + 2, baseRect.y + 2, 
                                        baseRect.width - 4, baseRect.height - 4, 4);
        ctx.stroke();
        
        // Efecto de relieve en la base
        const relieveGradient = ctx.createLinearGradient(
            baseRect.x, baseRect.y,
            baseRect.x, baseRect.y + baseRect.height * 0.3
        );
        relieveGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        relieveGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = relieveGradient;
        this.dibujarRectanguloRedondeado(ctx, baseRect.x + 3, baseRect.y + 3, 
                                        baseRect.width - 6, baseRect.height * 0.4, 3);
        ctx.fill();
        
        // Dibujar libros de la pila (desde abajo hacia arriba para mejor visualización)
        for (let i = this.elementos.length - 1; i >= 0; i--) {
            this.elementos[i].dibujar(ctx);
        }
        
        // Dibujar libros en animación
        this.librosEnAnimacion.forEach(libro => {
            libro.dibujar(ctx);
        });
        
        // Dibujar manos si están en movimiento
        if (this.manosEnMovimiento) {
            if (this.manoIzquierda && this.manoIzquierda.complete) {
                ctx.drawImage(this.manoIzquierda, 
                             this.posicionManoIzquierda.x, this.posicionManoIzquierda.y,
                             this.TAMAÑO_MANO, this.TAMAÑO_MANO);
            }
            if (this.manoDerecha && this.manoDerecha.complete) {
                ctx.drawImage(this.manoDerecha,
                             this.posicionManoDerecha.x, this.posicionManoDerecha.y,
                             this.TAMAÑO_MANO, this.TAMAÑO_MANO);
            }
        }
        
        // Restaurar estado del contexto
        ctx.restore();
    }
    
    // Método auxiliar para dibujar rectángulos redondeados
    dibujarRectanguloRedondeado(ctx, x, y, width, height, radio) {
        ctx.beginPath();
        ctx.moveTo(x + radio, y);
        ctx.lineTo(x + width - radio, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radio);
        ctx.lineTo(x + width, y + height - radio);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radio, y + height);
        ctx.lineTo(x + radio, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radio);
        ctx.lineTo(x, y + radio);
        ctx.quadraticCurveTo(x, y, x + radio, y);
        ctx.closePath();
    }
    
    // Métodos estáticos para ejecutar comandos (equivalente a EjecutarPaso)
    static ejecutarPaso(linea, pilas, historialDeshacer, canvasElement) {
        // Crear pila
        let match = linea.match(/Pila\s+(\w+)\s*=\s*new\s+Pila\[?(\d*)\]?/);
        if (match) {
            const nombrePila = match[1];
            if (!pilas[nombrePila]) {
                const nuevaPila = new PilaVisual(nombrePila);
                const contadorPilas = Object.keys(pilas).length;
                
                nuevaPila.setPosicion({
                    x: 100 + (contadorPilas * 200),
                    y: 350
                });
                
                pilas[nombrePila] = nuevaPila;
                
                // Agregar al historial para deshacer
                historialDeshacer.push(() => {
                    delete pilas[nombrePila];
                });
            }
            return;
        }
        
        // Push
        match = linea.match(/(\w+)\.push\([""']?(.*?)[""']?\)/);
        if (match) {
            const nombrePila = match[1];
            const valor = match[2];
            
            if (pilas[nombrePila]) {
                const estadoAnterior = [...pilas[nombrePila].elementos];
                pilas[nombrePila].push(valor);
                
                historialDeshacer.push(() => {
                    if (pilas[nombrePila]) {
                        pilas[nombrePila].elementos = estadoAnterior;
                    }
                });
            }
            return;
        }
        
        // Pop
        match = linea.match(/(\w+)\.pop\(\)/);
        if (match) {
            const nombrePila = match[1];
            
            if (pilas[nombrePila] && pilas[nombrePila].elementos.length > 0) {
                const estadoAnterior = [...pilas[nombrePila].elementos];
                pilas[nombrePila].pop();
                
                historialDeshacer.push(() => {
                    if (pilas[nombrePila]) {
                        pilas[nombrePila].elementos = estadoAnterior;
                    }
                });
            }
            return;
        }
        
        // Clear
        match = linea.match(/(\w+)\.clear\(\)/);
        if (match) {
            const nombrePila = match[1];
            
            if (pilas[nombrePila]) {
                const estadoAnterior = [...pilas[nombrePila].elementos];
                pilas[nombrePila].elementos = [];
                
                historialDeshacer.push(() => {
                    if (pilas[nombrePila]) {
                        pilas[nombrePila].elementos = estadoAnterior;
                    }
                });
            }
            return;
        }
        
        // Peek (solo actualiza el canvas)
        match = linea.match(/(\w+)\.peek\(\)/);
        if (match) {
            // No requiere acción específica, solo actualizar visualización
            return;
        }
    }
}

export default PilaVisual;