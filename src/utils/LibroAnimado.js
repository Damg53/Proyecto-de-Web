import LibroRojo from '../assets/LibroRojo.webp';
import LibroAzul from '../assets/LibroAzul.webp';
import LibroAmarillo from '../assets/LibroAmarillo.webp';
import LibroMorado from '../assets/LibroMorado.webp';
import LibroVerde from '../assets/LibroVerde.webp';

class LibroAnimado {
    static imagenesLibros = [];
    static imagenesCargadas = false;

    static cargarImagenes() {
        if (this.imagenesCargadas) return Promise.resolve();
        
        const imagenes = [
            LibroRojo, LibroAzul, LibroAmarillo, LibroMorado, LibroVerde
        ].map(src => {
            const img = new Image();
            img.src = src;
            return new Promise((resolve) => {
                img.onload = () => resolve(img);
            });
        });

        return Promise.all(imagenes).then(imgs => {
            this.imagenesLibros = imgs;
            this.imagenesCargadas = true;
        });
    }

    constructor(valor) {
        this.valor = valor;
        this.posicion = { x: 0, y: 0 };
        this.destino = { x: 0, y: 0 };
        this.velocidadBase = 4; // Aumentada de 1 a 4
        this.velocidadActual = this.velocidadBase;
        this.aceleracion = 0.3; // Nueva propiedad para acelerar la caída
        this.velocidadMaxima = 12; // Velocidad máxima de caída
        this.enMovimiento = false;
        this.conManos = false;
        this.ANCHO_LIBRO = 160;
        this.ALTO_LIBRO = 80;
        this.imagenLibro = null;
        this.imagenCargada = false;
        
        // Propiedades para animación mejorada
        this.balanceoX = 0;
        this.amplitudBalanceo = Math.random() * 2 + 1; // Entre 1 y 3
        this.frecuenciaBalanceo = Math.random() * 0.1 + 0.05; // Entre 0.05 y 0.15
        this.tiempo = 0;
        this.sombra = { offsetX: 0, offsetY: 0, blur: 0 };

        // Cargar imagen para este libro
        LibroAnimado.cargarImagenes().then(() => {
            this.imagenLibro = LibroAnimado.obtenerImagenAleatoria();
            this.imagenCargada = true;
        });
    }

    static obtenerImagenAleatoria() {
        if (!this.imagenesCargadas || this.imagenesLibros.length === 0) {
            return null;
        }
        const indice = Math.floor(Math.random() * this.imagenesLibros.length);
        return this.imagenesLibros[indice];
    }
    
    get haLlegado() {
        return Math.abs(this.posicion.y - this.destino.y) < this.velocidadActual &&
               Math.abs(this.posicion.x - this.destino.x) < this.velocidadActual;
    }
    
    iniciarCaida(inicio, destino) {
        this.posicion = { ...inicio };
        this.destino = { ...destino };
        this.enMovimiento = true;
        this.velocidadActual = this.velocidadBase;
        this.tiempo = 0;
        this.balanceoX = 0;
    }
    
    actualizarPosicion() {
        if (!this.enMovimiento || this.haLlegado) {
            this.enMovimiento = false;
            return false;
        }
        
        this.tiempo++;
        
        // Acelerar la caída gradualmente
        if (this.velocidadActual < this.velocidadMaxima) {
            this.velocidadActual += this.aceleracion;
        }
        
        // Calcular balanceo horizontal (movimiento de péndulo)
        this.balanceoX = Math.sin(this.tiempo * this.frecuenciaBalanceo) * this.amplitudBalanceo;
        
        // Calcular desplazamiento hacia el destino
        const deltaX = Math.sign(this.destino.x - this.posicion.x) * 
                      Math.min(this.velocidadActual * 0.3, Math.abs(this.destino.x - this.posicion.x));
        const deltaY = Math.sign(this.destino.y - this.posicion.y) * 
                      Math.min(this.velocidadActual, Math.abs(this.destino.y - this.posicion.y));
        
        // Aplicar movimiento con balanceo
        this.posicion.x += deltaX + this.balanceoX;
        this.posicion.y += deltaY;
        
        // Actualizar sombra basada en la velocidad
        const factorVelocidad = this.velocidadActual / this.velocidadMaxima;
        this.sombra.offsetX = factorVelocidad * 5;
        this.sombra.offsetY = factorVelocidad * 8;
        this.sombra.blur = factorVelocidad * 10;
        
        return true;
    }
    
    dibujar(ctx) {
        ctx.save();
        
        // Dibujar sombra
        if (this.enMovimiento) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.filter = `blur(${this.sombra.blur}px)`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            
            if (this.imagenLibro && this.imagenCargada) {
                ctx.drawImage(this.imagenLibro, 
                    this.posicion.x + this.sombra.offsetX, 
                    this.posicion.y + this.sombra.offsetY, 
                    this.ANCHO_LIBRO, this.ALTO_LIBRO);
            } else {
                ctx.fillRect(
                    this.posicion.x + this.sombra.offsetX, 
                    this.posicion.y + this.sombra.offsetY, 
                    this.ANCHO_LIBRO, this.ALTO_LIBRO);
            }
            ctx.restore();
        }
        
        // Dibujar imagen del libro si está disponible
        if (this.imagenLibro && this.imagenCargada) {
            ctx.drawImage(this.imagenLibro, this.posicion.x, this.posicion.y, 
                         this.ANCHO_LIBRO, this.ALTO_LIBRO);
            
            // Agregar brillo mejorado con animación
            const pulsoBrillo = Math.sin(this.tiempo * 0.1) * 0.2 + 0.8;
            const tamañoBrillo = 15;
            const gradient = ctx.createRadialGradient(
                this.posicion.x + 20, this.posicion.y + 15, 0,
                this.posicion.x + 20, this.posicion.y + 15, tamañoBrillo
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${0.6 * pulsoBrillo})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.3 * pulsoBrillo})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(this.posicion.x + 20, this.posicion.y + 15, 
                       tamañoBrillo, tamañoBrillo * 0.6, 0, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            // Dibujar libro por defecto si no hay imagen con gradiente mejorado
            const gradient = ctx.createLinearGradient(
                this.posicion.x, this.posicion.y,
                this.posicion.x + this.ANCHO_LIBRO, this.posicion.y + this.ALTO_LIBRO
            );
            gradient.addColorStop(0, 'rgba(120, 70, 70, 0.9)');
            gradient.addColorStop(1, 'rgba(80, 40, 40, 0.9)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.posicion.x, this.posicion.y, this.ANCHO_LIBRO, this.ALTO_LIBRO);
            
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.posicion.x, this.posicion.y, this.ANCHO_LIBRO, this.ALTO_LIBRO);
            
            // Dibujar líneas de páginas con animación
            ctx.strokeStyle = '#F5DEB3';
            ctx.lineWidth = 1;
            for (let i = 3; i < this.ALTO_LIBRO - 5; i += 4) {
                const desplazamiento = Math.sin(this.tiempo * 0.05 + i * 0.1) * 2;
                ctx.beginPath();
                ctx.moveTo(this.posicion.x + 3, this.posicion.y + i);
                ctx.lineTo(this.posicion.x + this.ANCHO_LIBRO - 3 + desplazamiento, this.posicion.y + i);
                ctx.stroke();
            }
        }
        
        // Dibujar texto del valor con TAMAÑO MÁS GRANDE sin fondo blanco
        const nombreMostrado = this.valor.length > 12 ? 
                              this.valor.substring(0, 12) + ".." : this.valor;
        
        ctx.font = 'bold 20px Arial'; // Aumentado a 20px
        const medidas = ctx.measureText(nombreMostrado);
        const x = this.posicion.x + (this.ANCHO_LIBRO / 1.5) - (medidas.width / 1.5);
        const y = this.posicion.y + (this.ALTO_LIBRO / 2) + 7; // Ajustado verticalmente
        
        // Texto con múltiples sombras para mejor legibilidad sin fondo
        // Sombra más difusa y grande
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(nombreMostrado, x + 2, y + 2);
        ctx.fillText(nombreMostrado, x - 1, y + 1);
        ctx.fillText(nombreMostrado, x + 1, y - 1);
        ctx.fillText(nombreMostrado, x - 1, y - 1);
        
        // Contorno para mayor contraste
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.lineWidth = 3;
        ctx.strokeText(nombreMostrado, x, y);
        
        // Texto principal en blanco para mejor contraste
        ctx.fillStyle = 'white';
        ctx.fillText(nombreMostrado, x, y);
        
        ctx.restore();
    }
}

export default LibroAnimado;