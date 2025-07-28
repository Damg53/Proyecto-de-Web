// ColaVisual.js
import PersonaAnimada from './PersonaAnimada.js';

class ColaVisual {
    static PosicionYCola = 150;
    static AnchoElemento = 80;
    static EspacioEntreElementos = 50;
    static PosicionXBase = 700;
    static DistanciaEntrada = 300;
    static COOLDOWN_OPERACIONES = 200;
    static RETRASO_REORGANIZACION = 150;

    constructor(nombre) {
        this.elementos = [];
        this.nombre = nombre;
        this.personasEnMovimiento = [];
        this.posicionesOcupadas = [];
        this.cachePosiciones = {};
        this.cacheInvalidado = true;
        this.ultimaOperacion = 0;
        this.estadoAnterior = [];
    }

    obtenerElementos() {
        return [...this.elementos];
    }

    restaurarElementos(elementosGuardados) {
        // Limpiar personas en movimiento
        this.personasEnMovimiento = [];

        // Restaurar elementos
        this.elementos = [...elementosGuardados];

        // Recrear personas estáticas directamente
        this.recrearPersonasEstaticasDirectamente(elementosGuardados);

        this.cacheInvalidado = true;
    }

    recrearPersonasEstaticasDirectamente(elementosGuardados) {
        this.actualizarCachePosiciones();

        for (let i = 0; i < elementosGuardados.length; i++) {
            const elemento = elementosGuardados[i];

            if (this.cachePosiciones[elemento]) {
                const posicion = this.cachePosiciones[elemento];

                const personaEstatica = new PersonaAnimada(
                    elemento,
                    posicion.x,
                    posicion.y,
                    posicion.x,
                    posicion.y,
                    true,  // esEntrada
                    -1,    // tipoPersona
                    false, // conAnimacion
                    true   // mirandoHaciaLaDerecha
                );

                personaEstatica.procesado = true;
                personaEstatica.posicionFija = true;

                this.personasEnMovimiento.push(personaEstatica);
            }
        }
    }

    actualizarAnimacion() {
        // Remover personas que han salido completamente
        this.personasEnMovimiento = this.personasEnMovimiento.filter(p => p.esEntrada || !p.haLlegado());

        let necesitaRedibujarse = false;
        let reorganizarDespuesDeRemover = false;

        for (let i = this.personasEnMovimiento.length - 1; i >= 0; i--) {
            const persona = this.personasEnMovimiento[i];

            if (persona.haLlegado()) {
                this.procesarPersonaLlegada(persona);
                continue;
            }

            persona.actualizar();
            necesitaRedibujarse = true;

            if (persona.haLlegado()) {
                if (this.procesarPersonaLlegada(persona) && !persona.esEntrada) {
                    this.personasEnMovimiento.splice(i, 1);
                    reorganizarDespuesDeRemover = true;
                }
            }
        }

        if (reorganizarDespuesDeRemover &&
            (Date.now() - this.ultimaOperacion) > ColaVisual.COOLDOWN_OPERACIONES) {
            this.reorganizarCola(false);
            this.ultimaOperacion = Date.now();
        }

        return necesitaRedibujarse;
    }

    procesarPersonaLlegada(persona) {
        if (persona.esEntrada && !persona.procesado) {
            this.elementos.push(persona.valor);
            persona.procesado = true;
            persona.posicionFija = true;
            this.cacheInvalidado = true;
            return true;
        }
        return false;
    }

    actualizarCachePosiciones() {
        if (!this.cacheInvalidado) return;

        this.cachePosiciones = {};
        
        for (let i = 0; i < this.elementos.length; i++) {
            this.cachePosiciones[this.elementos[i]] = {
                x: ColaVisual.PosicionXBase - (i * (ColaVisual.AnchoElemento + ColaVisual.EspacioEntreElementos)),
                y: ColaVisual.PosicionYCola
            };
        }

        this.cacheInvalidado = false;
    }

    dequeue() {
        if (this.elementos.length === 0) {
            throw new Error("La cola está vacía");
        }

        this.estadoAnterior = [...this.elementos];
        this.ultimaOperacion = Date.now();
        this.cacheInvalidado = true;

        const valor = this.elementos.shift(); // Remover primer elemento
        const tipoPersonaOriginal = PersonaAnimada.obtenerTipoPersonaje(valor);

        this.limpiarPersonasResidual(valor);

        // Actualizar posiciones ocupadas
        for (let i = 0; i < this.posicionesOcupadas.length; i++) {
            this.posicionesOcupadas[i]--;
        }
        this.posicionesOcupadas = this.posicionesOcupadas.filter(p => p >= 0);

        const posicionActual = this.cachePosiciones[valor] || {
            x: ColaVisual.PosicionXBase,
            y: ColaVisual.PosicionYCola
        };

        this.crearPersonaSaliente(valor, posicionActual, tipoPersonaOriginal);

        // Reorganizar después de un pequeño retraso
        setTimeout(() => {
            this.reorganizarCola(true);
        }, ColaVisual.RETRASO_REORGANIZACION);

        return valor;
    }

    crearPersonaSaliente(valor, posicionActual, tipoPersona) {
        const personaSaliente = new PersonaAnimada(
            valor,
            posicionActual.x,
            posicionActual.y,
            posicionActual.x,
            posicionActual.y + 80,
            false, // esEntrada
            tipoPersona,
            true,  // conAnimacion
            false  // mirandoHaciaLaDerecha
        );

        // Evento cuando complete el primer movimiento (hacia abajo)
        personaSaliente.eventoMovimientoCompletado = (sender, e) => {
            const personaSaliendoIzquierda = new PersonaAnimada(
                valor,
                e.x,
                e.y,
                e.x - ColaVisual.DistanciaEntrada,
                e.y,
                false, // esEntrada
                tipoPersona,
                true,  // conAnimacion
                false  // mirandoHaciaLaDerecha
            );
            this.personasEnMovimiento.push(personaSaliendoIzquierda);
        };

        this.personasEnMovimiento.push(personaSaliente);
    }

    enqueue(valor) {
        this.estadoAnterior = [...this.elementos];
        this.ultimaOperacion = Date.now();
        this.cacheInvalidado = true;

        const posXFinal = ColaVisual.PosicionXBase - (this.elementos.length * (ColaVisual.AnchoElemento + ColaVisual.EspacioEntreElementos));

        const nuevaPersona = new PersonaAnimada(
            valor,
            posXFinal - ColaVisual.DistanciaEntrada,
            ColaVisual.PosicionYCola,
            posXFinal,
            ColaVisual.PosicionYCola,
            true, // esEntrada
            -1,   // tipoPersona
            true, // conAnimacion
            true  // mirandoHaciaLaDerecha
        );

        this.personasEnMovimiento.push(nuevaPersona);
    }

    limpiarPersonasResidual(valor) {
        this.personasEnMovimiento = this.personasEnMovimiento.filter(p => 
            !(p.valor === valor && p.procesado && p.esEntrada)
        );
    }

    reorganizarCola(forzarMovimiento) {
        this.actualizarCachePosiciones();

        // Remover personas que ya no están en la cola
        this.personasEnMovimiento = this.personasEnMovimiento.filter(p =>
            !(p.esEntrada && p.procesado && !this.elementos.includes(p.valor))
        );

        // Actualizar posiciones de personas existentes
        this.personasEnMovimiento.forEach(persona => {
            if (persona.esEntrada && persona.procesado && this.cachePosiciones[persona.valor]) {
                const nuevaPos = this.cachePosiciones[persona.valor];
                
                const requiereActualizacion = forzarMovimiento ||
                    Math.abs(nuevaPos.x - persona.xFinal) > 0.5 ||
                    Math.abs(nuevaPos.y - persona.yFinal) > 0.5;

                if (requiereActualizacion) {
                    persona.actualizarPosicionFinal(nuevaPos.x, nuevaPos.y, forzarMovimiento);
                }
            }
        });
    }

    dibujar(ctx, x, y) {
        // Dibujar título de la cola
        this.dibujarTituloModerno(ctx, x, y);

        // Dibujar todas las personas
        this.personasEnMovimiento.forEach(persona => {
            persona.dibujar(ctx);
        });

        return y + 250; // Retornar nueva posición Y
    }

    // En ColaVisual.js, modifica el método dibujarTitulo:
// VERSIÓN 1: Estilo moderno con gradiente vibrante (centrado, sin emoji)
dibujarTituloModerno(ctx, x, y) {
    const textoTitulo = `Cola ${this.nombre}`;
    const elementos = this.elementos.length;
    const textoElementos = ` (${elementos} elemento${elementos !== 1 ? 's' : ''})`;

    // Configurar fuentes y medir texto
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
    const anchoTitulo = ctx.measureText(textoTitulo).width;
    
    ctx.font = "14px 'Segoe UI', Arial, sans-serif";
    const anchoElementos = ctx.measureText(textoElementos).width;

    const anchoTotal = anchoTitulo + anchoElementos + 40; // padding
    const altoTotal = 45;

    // Calcular posición centrada (asumiendo un canvas de ~800px de ancho)
    const canvasWidth = ctx.canvas.width;
    const centroX = (canvasWidth - anchoTotal) / 2;

    // Crear gradiente vibrante
    const gradient = ctx.createLinearGradient(centroX, y - 8, centroX + anchoTotal, y + altoTotal);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');

    ctx.save();
    
    // Sombra del contenedor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    this.drawRoundedRect(ctx, centroX + 3, y - 5, anchoTotal, altoTotal + 15, 12);
    ctx.fill();

    // Fondo principal con gradiente
    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, centroX, y - 8, anchoTotal, altoTotal + 15, 12);
    ctx.fill();

    // Highlight superior
    const highlightGradient = ctx.createLinearGradient(centroX, y - 8, centroX, y + 15);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGradient;
    this.drawRoundedRect(ctx, centroX, y - 8, anchoTotal, 20, 12);
    ctx.fill();

    // Título principal con efecto de texto centrado
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
    
    // Sombra del texto principal
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillText(textoTitulo, centroX + 41, y + 18);
    
    // Texto principal
    ctx.fillStyle = "white";
    ctx.fillText(textoTitulo, centroX + 40, y + 17);

    // Contador de elementos
    ctx.font = "14px 'Segoe UI', Arial, sans-serif";
    
    // Sombra del contador
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillText(textoElementos, centroX + 50 + anchoTitulo + 1, y + 18);
    
    // Contador principal
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(textoElementos, centroX + 50 + anchoTitulo, y + 17);

    // Indicador de animación (si está activo)
    if (this.hayAnimacionesActivas && this.hayAnimacionesActivas()) {
        const indicadorX = centroX + anchoTotal - 15;
        const indicadorY = y + 5;
        
        const tiempo = Date.now() / 1000;
        const escala = 0.8 + Math.sin(tiempo * 4) * 0.2;
        
        ctx.save();
        ctx.translate(indicadorX, indicadorY);
        ctx.scale(escala, escala);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
    }

    ctx.restore();
}

// VERSIÓN 2: Estilo minimalista y elegante (centrado, sin emoji)
dibujarTituloMinimalista(ctx, x, y) {
    const textoTitulo = `Cola ${this.nombre}`;
    const elementos = this.elementos.length;
    const badge = `${elementos}`;

    ctx.save();

    // Configurar fuentes y medir
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    const anchoTitulo = ctx.measureText(textoTitulo).width;

    const anchoTotal = anchoTitulo + 80; // espacio para badge
    const altoTotal = 36;

    // Calcular posición centrada
    const canvasWidth = ctx.canvas.width;
    const centroX = (canvasWidth - anchoTotal) / 2;

    // Fondo con borde sutil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#e1e8ed';
    ctx.lineWidth = 1;
    
    this.drawRoundedRect(ctx, centroX, y - 6, anchoTotal, altoTotal, 8);
    ctx.fill();
    ctx.stroke();

    // Línea de acento en la parte superior
    const accentGradient = ctx.createLinearGradient(centroX, y - 6, centroX + anchoTotal, y - 6);
    accentGradient.addColorStop(0, '#3b82f6');
    accentGradient.addColorStop(1, '#8b5cf6');
    
    ctx.fillStyle = accentGradient;
    this.drawRoundedRect(ctx, centroX, y - 6, anchoTotal, 4, 8);
    ctx.fill();

    // Título centrado
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "#1f2937";
    ctx.fillText(textoTitulo, centroX + 20, y + 16);

    // Badge con contador
    const badgeX = centroX + anchoTotal - 35;
    const badgeY = y + 2;
    
    ctx.fillStyle = elementos > 0 ? '#10b981' : '#6b7280';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY + 8, 12, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(badge, badgeX, badgeY + 12);
    ctx.textAlign = 'left'; // reset

    ctx.restore();
}

// VERSIÓN 3: Estilo gaming/neón (centrado, sin emoji)
dibujarTituloNeon(ctx, x, y) {
    const textoTitulo = `COLA ${this.nombre.toUpperCase()}`;
    const elementos = this.elementos.length;
    const subtexto = `${elementos} ELEMENTOS`;

    ctx.save();

    // Medir texto
    ctx.font = "bold 22px 'Courier New', monospace";
    const anchoTitulo = ctx.measureText(textoTitulo).width;
    
    ctx.font = "14px 'Courier New', monospace";
    const anchoSubtexto = ctx.measureText(subtexto).width;
    
    const anchoTotal = Math.max(anchoTitulo, anchoSubtexto) + 40;
    const altoTotal = 50;

    // Calcular posición centrada
    const canvasWidth = ctx.canvas.width;
    const centroX = (canvasWidth - anchoTotal) / 2;

    // Fondo oscuro
    ctx.fillStyle = 'rgba(20, 20, 30, 0.9)';
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    
    this.drawRoundedRect(ctx, centroX, y - 8, anchoTotal, altoTotal, 6);
    ctx.fill();
    ctx.stroke();

    // Efecto de brillo en el borde
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    this.drawRoundedRect(ctx, centroX, y - 8, anchoTotal, altoTotal, 6);
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Título principal con efecto neón centrado
    ctx.font = "bold 22px 'Courier New', monospace";
    
    // Calcular posición centrada del texto
    const textoCentroX = centroX + (anchoTotal - anchoTitulo) / 2;
    
    // Glow effect
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#00ff88';
    ctx.fillText(textoTitulo, textoCentroX, y + 18);
    
    // Texto principal
    ctx.shadowBlur = 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(textoTitulo, textoCentroX, y + 18);

    // Subtexto centrado
    ctx.font = "14px 'Courier New', monospace";
    const subtextoCentroX = centroX + (anchoTotal - anchoSubtexto) / 2;
    
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#00aaff';
    ctx.fillText(subtexto, subtextoCentroX, y + 35);

    ctx.restore();
}

// Función principal que puedes usar (cambia el nombre según el estilo que prefieras)
dibujarTitulo(ctx, x, y) {
    // Usa una de estas versiones:
    this.dibujarTituloModerno(ctx, x, y);      // Gradiente vibrante
    // this.dibujarTituloMinimalista(ctx, x, y);  // Estilo limpio
    // this.dibujarTituloNeon(ctx, x, y);         // Estilo gaming
}

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    static ejecutarPaso(linea, colas, historialDeshacer) {
        // Crear nueva cola
        if (linea.includes("=") && linea.includes("new Queue<")) {
            const nombreCola = linea.split('=')[0].trim().split(' ').pop();

            historialDeshacer.push(() => {
                if (colas[nombreCola]) {
                    delete colas[nombreCola];
                }
            });

            colas[nombreCola] = new ColaVisual(nombreCola);
            return `Cola ${nombreCola} creada`;
        }
        
        // Operación Enqueue
        else if (linea.includes(".Enqueue(")) {
            const partes = linea.split(/[.()]/);
            const nombreCola = partes[0].trim();

            const inicioValor = linea.indexOf("(") + 1;
            const finValor = linea.lastIndexOf(")");
            const valor = linea.substring(inicioValor, finValor).replace(/['"]/g, '');

            if (colas[nombreCola]) {
                const cola = colas[nombreCola];
                const estadoAnterior = cola.obtenerElementos();

                historialDeshacer.push(() => {
                    cola.restaurarElementos(estadoAnterior);
                });

                cola.enqueue(valor);
                return `Enqueue(${valor}) ejecutado en cola ${nombreCola}`;
            }
        }
        
        // Operación Dequeue
        else if (linea.includes(".Dequeue(")) {
            const partes = linea.split(/[.()]/);
            const nombreCola = partes[0].trim();

            if (colas[nombreCola]) {
                const cola = colas[nombreCola];
                const estadoAnterior = cola.obtenerElementos();

                historialDeshacer.push(() => {
                    cola.restaurarElementos(estadoAnterior);
                });

                try {
                    const valorRemovido = cola.dequeue();
                    return `Dequeue() ejecutado en cola ${nombreCola}, valor removido: ${valorRemovido}`;
                } catch (error) {
                    return `Error en Dequeue() de cola ${nombreCola}: ${error.message}`;
                }
            }
        }

        return null;
    }

    hayAnimacionesActivas() {
        return this.personasEnMovimiento.some(p => !p.haLlegado());
    }

    obtenerEstadoVisual() {
        return {
            tipo: 'cola',
            nombre: this.nombre,
            elementos: this.elementos,
            posicion: { x: 0, y: ColaVisual.PosicionYCola },
            personasEnMovimiento: this.personasEnMovimiento.length,
            hayAnimaciones: this.hayAnimacionesActivas()
        };
    }
}

export default ColaVisual;