// PersonaAnimada.js - Versión con GIFs MÁS GRANDES y mejor rendimiento
import { parseGIF, decompressFrames } from 'gifuct-js';
import Persona1Gif from '../assets/Persona1.gif';
import Persona2Gif from '../assets/Persona2.gif';
import Persona3Gif from '../assets/Persona3.gif';
import Persona4Gif from '../assets/Persona4.gif';
import Persona5Gif from '../assets/Persona5.gif';
import Persona6Gif from '../assets/Persona6.gif';

class PersonaAnimada {
    // Array estático con los GIFs importados
    static gifs = [
        null, // índice 0 no usado para que coincida con 1-6
        Persona1Gif,
        Persona2Gif,
        Persona3Gif,
        Persona4Gif,
        Persona5Gif,
        Persona6Gif
    ];

    // Constructor compatible con ColaVisual
    constructor(valor, xInicial, yInicial, xFinal, yFinal, esEntrada, tipoPersona = -1, conAnimacion = true, mirandoHaciaLaDerecha = true) {
        this.valor = valor;
        this.xInicial = xInicial;
        this.yInicial = yInicial;
        this.xFinal = xFinal;
        this.yFinal = yFinal;
        this.esEntrada = esEntrada;
        this.tipoPersona = tipoPersona;
        this.conAnimacion = conAnimacion;
        this.mirandoHaciaLaDerecha = mirandoHaciaLaDerecha;
        
        // Posición actual para animación
        this.x = xInicial;
        this.y = yInicial;
        
        // Estados de control
        this.procesado = false;
        this.posicionFija = false;
        this.llegado = false;
        
        // Propiedades de animación - velocidad más lenta para mejor visualización
        this.velocidad = 1.5; // Ligeramente más rápido que antes pero aún lento
        
        // ⭐ DIMENSIONES MUCHO MÁS GRANDES para los GIFs
        this.ancho = 130; // AUMENTADO de 90 a 130 (44% más grande)
        this.alto = 170; // AUMENTADO de 120 a 170 (42% más grande)
        
        // Determinar el tipo de personaje si no se especificó
        if (this.tipoPersona === -1) {
            this.tipoPersona = PersonaAnimada.obtenerTipoPersonaje(valor);
        }
        
        // Propiedades del GIF mejoradas
        this.gifFrames = [];
        this.frameActualGif = 0;
        this.tiempoUltimoFrame = 0;
        this.canvas = null;
        this.ctx = null;
        this.gifCargado = false;
        this.intentandoCargar = false;
        this.errorCarga = false;
        this.indiceGif = this.tipoPersona;
        this.intentosMaximos = 3;
        this.intentosActuales = 0;
        
        // Evento de movimiento completado (usado por ColaVisual)
        this.eventoMovimientoCompletado = null;
        
        // Cargar el GIF correspondiente
        this.cargarGifs();
    }

    // Método estático para obtener tipo de personaje basado en el valor
    static obtenerTipoPersonaje(valor) {
        const str = valor.toString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash % 6) + 1;
    }

    async cargarGifs() {
        if (this.intentandoCargar || this.indiceGif < 1 || this.indiceGif > 6 || this.intentosActuales >= this.intentosMaximos) return;

        this.intentandoCargar = true;
        this.intentosActuales++;
        
        const gifImportado = PersonaAnimada.gifs[this.indiceGif];
        
        if (!gifImportado) {
            console.warn(`GIF con índice ${this.indiceGif} no está disponible`);
            this.gifCargado = false;
            this.errorCarga = true;
            this.intentandoCargar = false;
            return;
        }

        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout de carga')), 5000);
            });

            const response = await Promise.race([
                fetch(gifImportado),
                timeoutPromise
            ]);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            
            const gif = parseGIF(buffer);
            const frames = decompressFrames(gif, true);
            
            if (!frames || frames.length === 0) {
                throw new Error('No se encontraron frames en el GIF');
            }
            
            this.canvas = document.createElement('canvas');
            this.canvas.width = frames[0].dims.width;
            this.canvas.height = frames[0].dims.height;
            this.ctx = this.canvas.getContext('2d');
            
            this.gifFrames = frames.map((frame, index) => {
                try {
                    const imageData = new ImageData(
                        new Uint8ClampedArray(frame.patch),
                        frame.dims.width,
                        frame.dims.height
                    );
                    
                    return {
                        imageData: imageData,
                        delay: Math.max(frame.delay || 100, 80),
                        dims: frame.dims,
                        index: index
                    };
                } catch (frameError) {
                    console.warn(`Error procesando frame ${index} del GIF:`, frameError);
                    return null;
                }
            }).filter(frame => frame !== null);
            
            if (this.gifFrames.length === 0) {
                throw new Error('No se pudieron procesar los frames del GIF');
            }
            
            this.gifCargado = true;
            this.errorCarga = false;
            this.frameActualGif = 0;
            this.tiempoUltimoFrame = Date.now();
            this.intentosActuales = 0;
            
            console.log(`✅ GIF Persona${this.indiceGif} cargado exitosamente con ${this.gifFrames.length} frames - TAMAÑO: ${this.ancho}x${this.alto}`);
            
        } catch (error) {
            console.error(`❌ Error procesando GIF Persona${this.indiceGif} (intento ${this.intentosActuales}/${this.intentosMaximos}):`, error);
            this.gifCargado = false;
            this.errorCarga = true;
            
            if (this.intentosActuales < this.intentosMaximos) {
                setTimeout(() => {
                    this.intentandoCargar = false;
                    this.cargarGifs();
                }, 1000 * this.intentosActuales);
            }
        }
        
        this.intentandoCargar = false;
    }

    actualizar() {
        if (this.posicionFija && this.llegado) return;

        this.actualizarFrameGif();
        
        if (!this.llegado) {
            const distanciaX = this.xFinal - this.x;
            const distanciaY = this.yFinal - this.y;
            const distanciaTotal = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
            
            if (distanciaTotal < this.velocidad) {
                this.x = this.xFinal;
                this.y = this.yFinal;
                this.llegado = true;
                
                if (this.eventoMovimientoCompletado) {
                    this.eventoMovimientoCompletado(this, { x: this.x, y: this.y });
                }
            } else if (this.conAnimacion) {
                const proporcion = this.velocidad / distanciaTotal;
                this.x += distanciaX * proporcion;
                this.y += distanciaY * proporcion;
            } else {
                this.x = this.xFinal;
                this.y = this.yFinal;
                this.llegado = true;
            }
        }
    }

    actualizarFrameGif() {
        if (!this.gifCargado || this.gifFrames.length === 0) return;
        
        const tiempoActual = Date.now();
        const frameActual = this.gifFrames[this.frameActualGif];
        
        if (tiempoActual - this.tiempoUltimoFrame >= frameActual.delay) {
            this.frameActualGif = (this.frameActualGif + 1) % this.gifFrames.length;
            this.tiempoUltimoFrame = tiempoActual;
        }
    }

    haLlegado() {
        return this.llegado;
    }

    actualizarPosicionFinal(nuevaX, nuevaY, forzarMovimiento = false) {
        this.xFinal = nuevaX;
        this.yFinal = nuevaY;
        
        if (forzarMovimiento) {
            this.llegado = false;
            this.posicionFija = false;
        }
    }

    // ⭐ MÉTODO DE DIBUJO MEJORADO con GIFs MÁS GRANDES
    dibujar(ctx) {
        if (!ctx) return;

        if (!this.gifCargado || this.gifFrames.length === 0) {
            return;
        }

        ctx.save();
        
        // Trasladar al centro de la persona
        const centroX = this.x + this.ancho / 2;
        const centroY = this.y + this.alto / 2;
        ctx.translate(centroX, centroY);
        
        // Aplicar escala para dirección
        const escalaX = this.mirandoHaciaLaDerecha ? 1 : -1;
        ctx.scale(escalaX, 1);
        
        // ⭐ AÑADIR SOMBRA MÁS PRONUNCIADA para el GIF grande
        this.dibujarSombraPersona(ctx);
        
        // Dibujar GIF animado con el nuevo tamaño
        this.dibujarGifAnimado(ctx);
        
        // Dibujar valor con mejor estilo
        this.dibujarValor(ctx, escalaX);
        
        ctx.restore();
    }

    // ⭐ NUEVA: Sombra más visible para GIFs grandes
    dibujarSombraPersona(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#000000';
        
        // Sombra elíptica más grande para el GIF grande
        ctx.beginPath();
        ctx.ellipse(0, this.alto / 2 - 10, this.ancho / 3, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
    }

    dibujarGifAnimado(ctx) {
        try {
            const frameActual = this.gifFrames[this.frameActualGif];
            
            if (!frameActual || !frameActual.imageData) {
                return;
            }
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.putImageData(frameActual.imageData, 0, 0);
            
            // ⭐ DIBUJAR CON LAS NUEVAS DIMENSIONES MÁS GRANDES
            ctx.drawImage(
                this.canvas,
                -this.ancho / 2,
                -this.alto / 2,
                this.ancho,  // 130px de ancho
                this.alto    // 170px de alto
            );
            
            // Efectos de movimiento solo cuando se está moviendo
            if (!this.llegado && this.conAnimacion) {
                this.dibujarEfectoMovimientoSutil(ctx);
            }
            
        } catch (error) {
            console.warn(`Error dibujando GIF frame para Persona${this.indiceGif}:`, error);
        }
    }

    // ⭐ VALOR CON MEJOR ESTILO para acompañar el GIF grande
    dibujarValor(ctx, escalaX) {
        if (!this.gifCargado) return;
        
        ctx.save();
        
        ctx.scale(escalaX, 1);
        
        // ⭐ TEXTO MÁS GRANDE para acompañar el GIF grande
        ctx.font = 'bold 18px Arial'; // Aumentado de 14px a 18px
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const texto = this.valor.toString();
        const anchoTexto = ctx.measureText(texto).width + 16; // Más padding
        const altoTexto = 28; // Más alto
        
        // ⭐ FONDO CON MEJOR ESTILO y posición ajustada para GIF grande
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Gradiente para el fondo del texto
        const gradient = ctx.createLinearGradient(
            -anchoTexto / 2, -this.alto / 2 - 50,
            anchoTexto / 2, -this.alto / 2 - 50 + altoTexto
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        gradient.addColorStop(1, 'rgba(248, 249, 250, 0.95)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-anchoTexto / 2, -this.alto / 2 - 50, anchoTexto, altoTexto);
        
        // Borde más visible
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.strokeRect(-anchoTexto / 2, -this.alto / 2 - 50, anchoTexto, altoTexto);
        
        // Texto del valor más prominente
        ctx.fillStyle = '#2c3e50';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 1;
        ctx.fillText(texto, 0, -this.alto / 2 - 36);
        
        ctx.restore();
    }

    // Efecto de movimiento ajustado para GIFs grandes
    dibujarEfectoMovimientoSutil(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#3498db';
        
        // Partículas más grandes para acompañar el GIF grande
        for (let i = 0; i < 3; i++) {
            const offsetX = (this.mirandoHaciaLaDerecha ? -1 : 1) * (20 + i * 12);
            const offsetY = this.alto / 3 + Math.random() * 15;
            const tamano = 2 + Math.random() * 2; // Partículas más grandes
            
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, tamano, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.restore();
    }

    // Resto de métodos sin cambios importantes...
    obtenerColorPersona() {
        const colores = ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        return colores[(this.tipoPersona - 1) % colores.length];
    }

    obtenerColorSecundario() {
        const colores = ['#26A69A', '#2196F3', '#66BB6A', '#FFD54F', '#BA68C8', '#4DB6AC'];
        return colores[(this.tipoPersona - 1) % colores.length];
    }

    destruir() {
        if (this.canvas) {
            this.canvas = null;
            this.ctx = null;
        }
        this.gifFrames = [];
        this.gifCargado = false;
        this.errorCarga = false;
    }

    static verificarImports() {
        const gifsImportados = PersonaAnimada.gifs.filter(g => g !== null);
        console.log(`GIFs importados correctamente: ${gifsImportados.length}/6`);
        
        PersonaAnimada.gifs.forEach((gif, index) => {
            if (index > 0) {
                if (gif) {
                    console.log(`✅ Persona${index}.gif importado:`, gif);
                } else {
                    console.error(`❌ Persona${index}.gif NO importado`);
                }
            }
        });
        
        return gifsImportados.length;
    }

    reintentarCarga() {
        if (this.errorCarga && !this.intentandoCargar) {
            this.intentosActuales = 0;
            this.errorCarga = false;
            this.cargarGifs();
        }
    }

    obtenerInfoDebug() {
        return {
            valor: this.valor,
            tipoPersona: this.tipoPersona,
            indiceGif: this.indiceGif,
            gifCargado: this.gifCargado,
            errorCarga: this.errorCarga,
            intentandoCargar: this.intentandoCargar,
            intentosActuales: this.intentosActuales,
            framesDisponibles: this.gifFrames.length,
            frameActual: this.frameActualGif,
            posicion: { x: this.x, y: this.y },
            destino: { x: this.xFinal, y: this.yFinal },
            llegado: this.llegado,
            esEntrada: this.esEntrada,
            mirandoHaciaLaDerecha: this.mirandoHaciaLaDerecha,
            dimensiones: { ancho: this.ancho, alto: this.alto }, // Nuevas dimensiones
            velocidad: this.velocidad
        };
    }
}

export default PersonaAnimada;