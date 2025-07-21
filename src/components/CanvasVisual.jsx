// CanvasVisual.jsx - Componente para visualizar estructuras de datos (incluye grafos mejorados)
import React, { useEffect, useRef } from 'react';

const CanvasVisual = ({ estadoVisualizacion }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
   
    // LIMPIEZA COMPLETA Y TOTAL DEL CANVAS
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
   
    // Crear un nuevo contexto limpio
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    // Resetear TODAS las propiedades de dibujo
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 10;
    ctx.setLineDash([]);
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.filter = 'none';
   
    // Configurar estilos base
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
   
    if (estadoVisualizacion && estadoVisualizacion.estructuras && estadoVisualizacion.estructuras.length > 0) {
      dibujarEstructuras(ctx, estadoVisualizacion.estructuras);
    } else {
      // Mensaje cuando no hay visualización
      ctx.fillStyle = '#666666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Ejecuta código para ver la visualización aquí', canvas.width / 2, canvas.height / 2);
    }
  }, [estadoVisualizacion]);

  const dibujarEstructuras = (ctx, estructuras) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const margen = 40;
    const espacioDisponible = canvasHeight - (margen * 2);
    const alturaPromedioPorEstructura = espacioDisponible / estructuras.length;
   
    let y = margen;
   
    estructuras.forEach((estructura, index) => {
      const alturaMaxima = alturaPromedioPorEstructura - 50; // Más espacio entre estructuras
     
      if (estructura.tipo === 'grafo') {
        y = dibujarGrafo(ctx, estructura, y, canvasWidth, alturaMaxima);
      } else if (estructura.tipo === 'arbol') {
        y = dibujarArbol(ctx, estructura, y, canvasWidth, alturaMaxima);
      } else if (estructura.tipo === 'listaDoble') {
        y = dibujarListaDoble(ctx, estructura, y, canvasWidth, alturaMaxima);
      } else if (estructura.elementos && Array.isArray(estructura.elementos) &&
          estructura.elementos.length > 0 && estructura.elementos[0].indice !== undefined) {
        y = dibujarVector(ctx, estructura, y, canvasWidth, alturaMaxima);
      } else if (estructura.elementos && Array.isArray(estructura.elementos) &&
                 estructura.elementos.length > 0 && estructura.elementos[0].fila !== undefined) {
        y = dibujarMatriz(ctx, estructura, y, canvasWidth, alturaMaxima);
      }
     
      y += 50; // Mayor separación entre estructuras
    });
  };

  const dibujarGrafo = (ctx, grafo, yInicio, canvasWidth, alturaMaxima) => {
    const margenLateral = 80;
    const centroX = canvasWidth / 2;
    const centroY = yInicio + alturaMaxima / 2 + 50; // Empuja el grafo hacia abajo
    const radioNodo = 35; // Nodos más grandes
    
    // Calcular el centro real de los nodos para mejor centrado
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    grafo.nodos.forEach(nodo => {
      if (nodo.posicion) {
        minX = Math.min(minX, nodo.posicion.x);
        maxX = Math.max(maxX, nodo.posicion.x);
        minY = Math.min(minY, nodo.posicion.y);
        maxY = Math.max(maxY, nodo.posicion.y);
      }
    });
    
    const centroRealX = (minX + maxX) / 2;
    const centroRealY = (minY + maxY) / 2;
    const anchoGrafo = maxX - minX;
    const altoGrafo = maxY - minY;
    
    // Factor de escala optimizado para mayor separación de nodos
    const escalaMaxima = Math.min(
      (canvasWidth * 0.7) / Math.max(anchoGrafo, 1),
      (alturaMaxima * 0.7) / Math.max(altoGrafo, 1)
    );
    const escala = Math.min(escalaMaxima, 2.5); // Escala mucho más grande

    // Título del grafo con mejor diseño
    ctx.save();
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${grafo.nombre} (${grafo.dirigido ? 'Dirigido' : 'No Dirigido'})`,
      centroX,
      yInicio + 1
    );
    
    // Subtítulo con información del grafo
    ctx.font = '18px Arial';
    ctx.fillStyle = '#7f8c8d';
    ctx.fillText(
      `${grafo.totalNodos} nodos, ${Math.floor(grafo.totalAristas / (grafo.dirigido ? 1 : 2))} aristas`,
      centroX,
      yInicio + 25
    );
    ctx.restore();

    // Información adicional sobre el estado del grafo
    if (grafo.tipoRecorrido || grafo.ultimaOperacion) {
      ctx.save();
      ctx.font = 'bold 15px Arial';
      ctx.fillStyle = '#e74c3c';
      
      let infoTexto = '';
      if (grafo.tipoRecorrido === 'dfs') {
        infoTexto = `DFS: ${grafo.estadoRecorrido.join(' → ')}`;
      } else if (grafo.tipoRecorrido === 'bfs') {
        infoTexto = `BFS: ${grafo.estadoRecorrido.join(' → ')}`;
      } else if (grafo.tipoRecorrido === 'dijkstra') {
        infoTexto = `Dijkstra ejecutado - Camino más corto encontrado`;
      } else if (grafo.ultimaOperacion) {
        infoTexto = grafo.ultimaOperacion;
      }
      
      ctx.fillText(infoTexto, centroX, yInicio + 65);
      ctx.restore();
    }

    // Dibujar aristas primero (para que queden detrás de los nodos)
    grafo.aristas.forEach(arista => {
      const origenPos = arista.posicionOrigen;
      const destinoPos = arista.posicionDestino;
      
      if (!origenPos || !destinoPos) return;

      // Ajustar posiciones al canvas con mayor escala
      const x1 = centroX + (origenPos.x - centroRealX) * escala;
      const y1 = centroY + (origenPos.y - centroRealY) * escala;
      const x2 = centroX + (destinoPos.x - centroRealX) * escala;
      const y2 = centroY + (destinoPos.y - centroRealY) * escala;

      ctx.save();
      
      // Color y grosor de la arista
      if (arista.resaltada) {
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 3;
      }

      // Calcular punto de conexión en el borde del nodo (no en el centro)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      
      if (distancia === 0) {
        ctx.restore();
        return;
      }
      
      const startX = x1 + (dx / distancia) * radioNodo;
      const startY = y1 + (dy / distancia) * radioNodo;
      const endX = x2 - (dx / distancia) * radioNodo;
      const endY = y2 - (dy / distancia) * radioNodo;

      // Dibujar línea con sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx.shadowBlur = 0;

      // Dibujar flecha si es dirigido - MÁS GRANDE Y VISIBLE
      if (grafo.dirigido) {
        const anguloFlecha = Math.atan2(dy, dx);
        const tamañoFlecha = 20; // Flecha más grande
        
        ctx.fillStyle = arista.resaltada ? '#e74c3c' : '#34495e';
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - tamañoFlecha * Math.cos(anguloFlecha - Math.PI / 6),
          endY - tamañoFlecha * Math.sin(anguloFlecha - Math.PI / 6)
        );
        ctx.lineTo(
          endX - tamañoFlecha * Math.cos(anguloFlecha + Math.PI / 6),
          endY - tamañoFlecha * Math.sin(anguloFlecha + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      // Dibujar peso de la arista con mejor diseño
      if (arista.peso !== 1) {
        const pesoX = (startX + endX) / 2;
        const pesoY = (startY + endY) / 2;
        
        // Fondo del peso
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = arista.resaltada ? '#e74c3c' : '#34495e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pesoX, pesoY, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Texto del peso
        ctx.fillStyle = arista.resaltada ? '#e74c3c' : '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(arista.peso.toString(), pesoX, pesoY);
      }

      ctx.restore();
    });

    // Dibujar nodos con mejor diseño
    grafo.nodos.forEach(nodo => {
      if (!nodo.posicion) return;

      // Ajustar posición al canvas con mayor escala
      const x = centroX + (nodo.posicion.x - centroRealX) * escala;
      const y = centroY + (nodo.posicion.y - centroRealY) * escala;

      ctx.save();

      // Determinar color del nodo según su estado
      let colorFondo = '#3498db'; // Azul por defecto
      let colorBorde = '#2980b9';
      let colorTexto = '#ffffff';

      if (nodo.encontrado) {
        colorFondo = '#27ae60'; // Verde para encontrado
        colorBorde = '#229954';
      } else if (nodo.visitado) {
        colorFondo = '#f39c12'; // Naranja para visitado
        colorBorde = '#d68910';
        colorTexto = '#ffffff';
      } else if (nodo.procesado) {
        colorFondo = '#9b59b6'; // Púrpura para procesado (Dijkstra)
        colorBorde = '#8e44ad';
      } else if (nodo.resaltado) {
        colorFondo = '#e74c3c'; // Rojo para resaltado
        colorBorde = '#c0392b';
      }

      // Dibujar sombra más pronunciada
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(x + 3, y + 3, radioNodo, 0, 2 * Math.PI);
      ctx.fill();

      // Dibujar nodo con gradiente (simulado con círculos concéntricos)
      // Círculo exterior (borde)
      ctx.fillStyle = colorBorde;
      ctx.beginPath();
      ctx.arc(x, y, radioNodo, 0, 2 * Math.PI);
      ctx.fill();
      
      // Círculo interior
      ctx.fillStyle = colorFondo;
      ctx.beginPath();
      ctx.arc(x, y, radioNodo - 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Highlight en la parte superior
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(x - 5, y - 5, radioNodo / 3, 0, 2 * Math.PI);
      ctx.fill();

      // Dibujar valor del nodo
      ctx.fillStyle = colorTexto;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 3;
      ctx.strokeText(nodo.valor.toString(), x, y);
      ctx.fillText(nodo.valor.toString(), x, y);

      // Mostrar distancia si está disponible (para Dijkstra)
      if (nodo.distancia !== undefined && nodo.distancia !== Infinity && grafo.tipoRecorrido === 'dijkstra') {
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeText(`d:${nodo.distancia}`, x, y + radioNodo + 18);
        ctx.fillText(`d:${nodo.distancia}`, x, y + radioNodo + 18);
      }

      ctx.restore();
    });

    return yInicio + alturaMaxima + 80;
  };

  const dibujarArbol = (ctx, arbol, startY, canvasWidth, alturaMaxima) => {
    let y = startY;
    const margen = 40;
    
    // Calcular tamaño de fuente para el título
    const fontSizeTitulo = Math.max(16, Math.min(24, canvasWidth * 0.02));
    
    // Dibujar título del árbol con información adicional
    ctx.fillStyle = '#2c3e50';
    ctx.font = `bold ${fontSizeTitulo}px Arial`;
    ctx.textAlign = 'center';
    
    let titulo = `Árbol Binario ${arbol.nombre} (Nodos: ${arbol.nodos ? arbol.nodos.length : 0})`;
    
    // Agregar información de la última operación
    if (arbol.ultimaBusqueda !== null && arbol.ultimaBusqueda !== undefined) {
      titulo += ` - Búsqueda: ${arbol.ultimaBusqueda}`;
    }
    if (arbol.ultimoRecorrido && arbol.ultimoRecorrido.length > 0) {
      titulo += ` - Recorrido: [${arbol.ultimoRecorrido.join(', ')}]`;
    }
    
    ctx.fillText(titulo, canvasWidth / 2, y + 15);
    
    // Mayor separación entre título y árbol
    y += fontSizeTitulo + 50;
    
    if (!arbol.raiz || !arbol.nodos || arbol.nodos.length === 0) {
      // Árbol vacío
      ctx.fillStyle = '#95a5a6';
      ctx.font = '18px Arial';
      ctx.fillText('Árbol vacío', canvasWidth / 2, y + 40);
      
      const rectVacio = {
        x: canvasWidth / 2 - 100,
        y: y,
        width: 200,
        height: 60
      };
      
      ctx.strokeStyle = '#bdc3c7';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(rectVacio.x, rectVacio.y, rectVacio.width, rectVacio.height);
      ctx.setLineDash([]);
      
      return y + 120;
    }
    
    // Calcular posiciones del árbol de manera centrada
    const radioNodo = 40; // ← forzar el tamaño del nodo, sin importar lo que venga en arbol
    const centroX = canvasWidth / 2;
    const inicioY = y + 30;
    
    // Calcular el ancho necesario para el árbol
    const profundidad = calcularProfundidadArbol(arbol.raiz);
    const anchoNivel = Math.pow(2, profundidad - 1) * 120; // Espacio entre nodos del último nivel
    const margenArbol = Math.max(50, (canvasWidth - anchoNivel) / 2);
    
    // Recalcular posiciones de los nodos para centrarlos
    if (arbol.nodos && arbol.nodos.length > 0) {
      calcularPosicionesNodos(arbol.raiz, centroX, inicioY, anchoNivel / 2, 80);
    }
    
    // Primero dibujar todas las conexiones
    if (arbol.nodos && arbol.nodos.length > 0) {
      arbol.nodos.forEach(nodo => {
        if (nodo.izquierdo) {
          dibujarConexion(
            ctx,
            nodo.posicion.x,
            nodo.posicion.y,
            nodo.izquierdo.posicion.x,
            nodo.izquierdo.posicion.y,
            '#34495e'
          );
        }
        if (nodo.derecho) {
          dibujarConexion(
            ctx,
            nodo.posicion.x,
            nodo.posicion.y,
            nodo.derecho.posicion.x,
            nodo.derecho.posicion.y,
            '#34495e'
          );
        }
      });
      
      // Luego dibujar todos los nodos
      arbol.nodos.forEach(nodo => {
        dibujarNodoArbol(ctx, nodo.posicion.x, nodo.posicion.y, radioNodo, nodo);
      });
    }
    
    // Calcular altura total usada por el árbol
    const maxY = arbol.nodos ? Math.max(...arbol.nodos.map(n => n.posicion.y + radioNodo)) : inicioY;
    let alturaFinal = maxY + 40;
    
    // Dibujar leyenda de estados si hay nodos con estados especiales
    const hayEstadosEspeciales = arbol.nodos && arbol.nodos.some(nodo => 
      nodo.resaltado || nodo.visitado || nodo.encontrado || nodo.esNuevo
    );
    
    if (hayEstadosEspeciales) {
      alturaFinal = dibujarLeyendaEstados(ctx, canvasWidth, alturaFinal + 20);
    }
    
    return alturaFinal;
  };

  // Nueva función para calcular la profundidad del árbol
  const calcularProfundidadArbol = (nodo) => {
    if (!nodo) return 0;
    
    const profundidadIzquierda = nodo.izquierdo ? calcularProfundidadArbol(nodo.izquierdo) : 0;
    const profundidadDerecha = nodo.derecho ? calcularProfundidadArbol(nodo.derecho) : 0;
    
    return Math.max(profundidadIzquierda, profundidadDerecha) + 1;
  };

  // Nueva función para calcular posiciones de nodos de manera recursiva
  const calcularPosicionesNodos = (nodo, x, y, separacionHorizontal, separacionVertical) => {
    if (!nodo) return;
    
    // Asignar posición al nodo actual
    nodo.posicion = { x, y };
    
    // Calcular posiciones de los hijos
    if (nodo.izquierdo) {
      calcularPosicionesNodos(
        nodo.izquierdo, 
        x - separacionHorizontal, 
        y + separacionVertical,
        separacionHorizontal / 2,
        separacionVertical
      );
    }
    
    if (nodo.derecho) {
      calcularPosicionesNodos(
        nodo.derecho, 
        x + separacionHorizontal, 
        y + separacionVertical,
        separacionHorizontal / 2,
        separacionVertical
      );
    }
  };

  const dibujarNodoArbol = (ctx, x, y, radio, nodo) => {
    // Validar parámetros
    if (!nodo || typeof x !== 'number' || typeof y !== 'number' || 
        isNaN(x) || isNaN(y) || radio <= 0) {
      console.warn('Parámetros inválidos para dibujar nodo árbol:', { x, y, radio, nodo });
      return;
    }
    
    ctx.save();
    
    // Configurar colores según el estado del nodo
    let colorFondo = '#ffffff';
    let colorBorde = '#34495e';
    let colorTexto = '#2c3e50';
    
    // Priorizar estados (el orden importa)
    if (nodo.encontrado) {
      // Nodo encontrado en búsqueda
      colorFondo = '#d1ecf1';
      colorBorde = '#17a2b8';
      colorTexto = '#0c5460';
    } else if (nodo.visitado) {
      // Nodo visitado en recorrido
      colorFondo = '#d4edda';
      colorBorde = '#28a745';
      colorTexto = '#155724';
    } else if (nodo.resaltado) {
      // Nodo resaltado (camino de búsqueda)
      colorFondo = '#fff3cd';
      colorBorde = '#ffc107';
      colorTexto = '#856404';
    } else if (nodo.esNuevo) {
      // Nodo recién insertado
      colorFondo = '#f8d7da';
      colorBorde = '#dc3545';
      colorTexto = '#721c24';
    }
    
    // Agregar sombra al nodo
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Dibujar círculo del nodo
    ctx.fillStyle = colorFondo;
    ctx.beginPath();
    ctx.arc(x, y, radio, 0, 2 * Math.PI);
    ctx.fill();
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Dibujar borde
    ctx.strokeStyle = colorBorde;
    ctx.lineWidth = nodo.encontrado ? 3 : 2; // Borde más grueso para nodo encontrado
    ctx.beginPath();
    ctx.arc(x, y, radio, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Dibujar valor del nodo
    ctx.fillStyle = colorTexto;
    ctx.font = `bold 28px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const valorTexto = nodo.valor !== undefined && nodo.valor !== null ? nodo.valor.toString() : '';
    const valorRecortado = valorTexto.length > 4 ? valorTexto.substring(0, 4) + '...' : valorTexto;
    ctx.fillText(valorRecortado, x, y);
    
    // Dibujar indicador especial para nodo encontrado
    if (nodo.encontrado) {
      ctx.fillStyle = '#17a2b8';
      ctx.font = 'bold 25px Arial';
      ctx.fillText('●', x + radio + 10, y - radio);
    }
    
    // Dibujar número de orden para recorridos
    if (nodo.visitado && nodo.ordenVisita !== undefined) {
      ctx.fillStyle = '#28a745';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(nodo.ordenVisita.toString(), x - radio - 10, y - radio - 10);
    }
    
    ctx.restore();
  };

  const dibujarConexion = (ctx, x1, y1, x2, y2, color = '#34495e') => {
    // Validar parámetros
    if (typeof x1 !== 'number' || typeof y1 !== 'number' || 
        typeof x2 !== 'number' || typeof y2 !== 'number' ||
        isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      return;
    }
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    ctx.restore();
  };

  const dibujarLeyendaEstados = (ctx, canvasWidth, startY) => {
    const legendItems = [
      { color: '#ffffff', border: '#34495e', text: 'Normal', textColor: '#2c3e50' },
      { color: '#f8d7da', border: '#dc3545', text: 'Nuevo', textColor: '#721c24' },
      { color: '#fff3cd', border: '#ffc107', text: 'Búsqueda', textColor: '#856404' },
      { color: '#d4edda', border: '#28a745', text: 'Visitado', textColor: '#155724' },
      { color: '#d1ecf1', border: '#17a2b8', text: 'Encontrado', textColor: '#0c5460' }
    ];
    
    ctx.save();
    
    // Fondo de la leyenda
    const legendWidth = 750;
    const legendHeight = 70;
    const legendX = (canvasWidth - legendWidth) / 2;
    const legendY = startY;
    
    ctx.fillStyle = 'rgba(248, 249, 250, 0.9)';
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
    
    // Título de la leyenda
    ctx.fillStyle = '#495057';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Estados de los Nodos', canvasWidth / 2, legendY + 15);
    
    // Dibujar items de la leyenda
    const itemWidth = legendWidth / legendItems.length;
    legendItems.forEach((item, index) => {
      const itemX = legendX + (index * itemWidth) + (itemWidth / 2);
      const itemY = legendY + 35;
      
      // Desfase vertical que baja los círculos
      const desplazamientoY = 7; // Ajusta este valor si quieres bajarlos más o menos

// Círculo de color (relleno)
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(itemX - 15, itemY + desplazamientoY, 8, 0, 2 * Math.PI); // Bajado
      ctx.fill();

      // Círculo de borde
      ctx.strokeStyle = item.border;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(itemX - 15, itemY + desplazamientoY, 8, 0, 2 * Math.PI); // Bajado
      ctx.stroke();

      // Texto (queda en la línea base original)
      ctx.fillStyle = item.textColor;
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic'; // Línea base normal de texto
      ctx.fillText(item.text, itemX + -2, itemY + 12); // No se cambia

    });
    
    ctx.restore();
    
    return startY + legendHeight + 20;
  };

  const dibujarListaDoble = (ctx, lista, startY, canvasWidth, alturaMaxima) => {
    let y = startY;
    const margen = 40;
    const anchoDisponible = canvasWidth - (margen * 2);
    
    // Calcular tamaño de fuente para el título
    const fontSizeTitulo = Math.max(20, Math.min(32, canvasWidth * 0.025));
    
    // Dibujar título de la lista
    ctx.fillStyle = '#2c3e50';
    ctx.font = `bold ${fontSizeTitulo}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(
      `Lista Doble ${lista.nombre} (Tamaño: ${lista.nodos ? lista.nodos.length : 0})`,
      canvasWidth / 2,
      y
    );
    
    y += fontSizeTitulo + 30;
    
    if (!lista.nodos || lista.nodos.length === 0) {
      // Lista vacía
      ctx.fillStyle = '#95a5a6';
      ctx.font = '18px Arial';
      ctx.fillText('Lista vacía', canvasWidth / 2, y + 40);
      
      const rectVacio = {
        x: canvasWidth / 2 - 100,
        y: y,
        width: 200,
        height: 60
      };
      
      ctx.strokeStyle = '#bdc3c7';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(rectVacio.x, rectVacio.y, rectVacio.width, rectVacio.height);
      ctx.setLineDash([]);
      
      return y + 120;
    }
    
    // CORRECCIÓN PRINCIPAL: Calcular dimensiones correctamente
    const numNodos = lista.nodos.length;
    const anchoNodo = 220; // Ancho fijo para consistencia
    const espacioEntre = 220; // Espacio fijo entre nodos
    const altoNodo = Math.max(90, Math.min(110, alturaMaxima * 0.6));
    
    // Calcular el ancho total necesario
    const totalAncho = numNodos * anchoNodo + (numNodos - 1) * espacioEntre;
    
    // Verificar si cabe en el canvas, si no, ajustar
    let anchoNodoFinal = anchoNodo;
    let espacioEntreFinal = espacioEntre;
    
    if (totalAncho > anchoDisponible) {
      // Recalcular para que quepa
      const espacioTotal = anchoDisponible - (numNodos * 120); // Mínimo 120px por nodo
      espacioEntreFinal = Math.max(20, espacioTotal / (numNodos - 1));
      anchoNodoFinal = Math.min(180, (anchoDisponible - ((numNodos - 1) * espacioEntreFinal)) / numNodos);
    }
    
    // Calcular posición inicial centrada
    const totalAnchoFinal = numNodos * anchoNodoFinal + (numNodos - 1) * espacioEntreFinal;
    const inicioX = Math.max(margen, (canvasWidth - totalAnchoFinal) / 2);
    
    // Calcular tamaños de fuente adaptativos
   const fontSizeValor = 28; // Tamaño fijo grande
    const fontSizeFlecha = Math.max(12, Math.min(16, espacioEntreFinal * 0.15));
    
    // USAR SOLO POSICIONES CALCULADAS (no animación)
    lista.nodos.forEach((nodo, indice) => {
      const posX = inicioX + indice * (anchoNodoFinal + espacioEntreFinal);
      const posY = y;
      
      // Dibujar nodo principal usando SOLO posiciones calculadas
      dibujarNodoDoble(
        ctx, 
        posX, 
        posY, 
        anchoNodoFinal, 
        altoNodo, 
        nodo, 
        fontSizeValor, 
        indice === 0, 
        indice === numNodos - 1
      );
      
      // Dibujar flechas entre nodos consecutivos
      if (numNodos > 1 && indice < numNodos - 1) {
        const siguientePosX = inicioX + (indice + 1) * (anchoNodoFinal + espacioEntreFinal);
        
        dibujarFlechasDobles(
          ctx, 
          posX + anchoNodoFinal, 
          posY + altoNodo / 2, 
          siguientePosX, 
          posY + altoNodo / 2, 
          fontSizeFlecha
        );
      }
    });
    
    return y + altoNodo + 80;
  };

  const dibujarNodoDoble = (ctx, x, y, ancho, alto, nodo, fontSize, esPrimero, esUltimo) => {
    // Validar parámetros
    if (!nodo || typeof x !== 'number' || typeof y !== 'number' || 
        isNaN(x) || isNaN(y) || ancho <= 0 || alto <= 0) {
      console.warn('Parámetros inválidos para dibujar nodo:', { x, y, ancho, alto, nodo });
      return;
    }
    
    const anchoSeccion = ancho / 3;
    
    // Configurar colores según el estado del nodo
    let colorFondo = '#ffffff';
    let colorBorde = '#34495e';
    let colorTexto = '#2c3e50';
    let colorSecundario = '#7f8c8d';
    
    if (nodo.resaltado) {
      colorFondo = '#fff3cd';
      colorBorde = '#f39c12';
      colorTexto = '#856404';
    }
    
    if (nodo.esNuevo) {
      colorFondo = '#d4edda';
      colorBorde = '#28a745';
      colorTexto = '#155724';
    }
    
    ctx.save();
    
    // Agregar sombra al nodo
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Dibujar el nodo completo
    ctx.fillStyle = colorFondo;
    dibujarRectanguloRedondeado(ctx, x, y, ancho, alto, 8);
    ctx.fill();
    
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = colorBorde;
    ctx.lineWidth = 2;
    dibujarRectanguloRedondeado(ctx, x, y, ancho, alto, 8);
    ctx.stroke();
    
    // Dibujar divisiones del nodo
    ctx.strokeStyle = colorSecundario;
    ctx.lineWidth = 1;
    
    // Línea vertical izquierda
    ctx.beginPath();
    ctx.moveTo(x + anchoSeccion, y + 5);
    ctx.lineTo(x + anchoSeccion, y + alto - 5);
    ctx.stroke();
    
    // Línea vertical derecha
    ctx.beginPath();
    ctx.moveTo(x + 2 * anchoSeccion, y + 5);
    ctx.lineTo(x + 2 * anchoSeccion, y + alto - 5);
    ctx.stroke();
    
    // Dibujar contenido
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Sección anterior
    ctx.fillStyle = esPrimero ? '#e74c3c' : colorSecundario;
    ctx.font = `${fontSize - 4}px Arial`;
    ctx.fillText(
      esPrimero ? 'NULL' : '🡨', 
      x + anchoSeccion / 2, 
      y + alto / 2
    );
    
    // Sección del valor
    ctx.fillStyle = colorTexto;
    ctx.font = `bold ${fontSize}px Arial`; // antes: Math.max(12, fontSize)
    const valorTexto = nodo.valor !== undefined && nodo.valor !== null ? nodo.valor.toString() : '';
    const valorRecortado = valorTexto.length > 6 ? valorTexto.substring(0, 6) + '...' : valorTexto;
    ctx.fillText(valorRecortado, x + anchoSeccion + anchoSeccion / 2, y + alto / 2);
    
    // Sección siguiente
    ctx.fillStyle = esUltimo ? '#e74c3c' : colorSecundario;
    ctx.font = `${fontSize - 4}px Arial`; // antes: Math.max(10, fontSize - 2)
    ctx.fillText(
      esUltimo ? 'NULL' : '🡪', 
      x + 2 * anchoSeccion + anchoSeccion / 2, 
      y + alto / 2
    );
    
    ctx.restore();
  };

  const dibujarRectanguloRedondeado = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  };

  const dibujarFlechasDobles = (ctx, x1, y1, x2, y2, fontSize) => {
    // Validar parámetros
    if (typeof x1 !== 'number' || typeof y1 !== 'number' || 
        typeof x2 !== 'number' || typeof y2 !== 'number' ||
        isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      return;
    }
    
    ctx.save();
    
    const separacion = 15;
    const longitudFlecha = 17;
    const anchoFlecha = 9;
    const colorFlecha = '#3498db';
    const colorFlechaRetorno = '#9b59b6';
    
    ctx.lineWidth = 5;
    
    // Flecha hacia adelante (arriba) - NEXT
    const yAdelante = y1 - separacion;
    ctx.strokeStyle = colorFlecha;
    ctx.fillStyle = colorFlecha;
    
    // Línea principal
    ctx.beginPath();
    ctx.moveTo(x1 + 5, yAdelante);
    ctx.lineTo(x2 - 5, yAdelante);
    ctx.stroke();
    
    // Punta de flecha
    ctx.beginPath();
    ctx.moveTo(x2 - 5, yAdelante);
    ctx.lineTo(x2 - 5 - longitudFlecha, yAdelante - anchoFlecha);
    ctx.lineTo(x2 - 5 - longitudFlecha + 3, yAdelante);
    ctx.lineTo(x2 - 5 - longitudFlecha, yAdelante + anchoFlecha);
    ctx.closePath();
    ctx.fill();
    
    // Etiqueta "next"
    ctx.fillStyle = colorFlecha;
    ctx.font = `${Math.max(28, fontSize)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('next', (x1 + x2) / 2, yAdelante - 12);
    
    // Flecha hacia atrás (abajo) - PREV
    const yAtras = y1 + separacion;
    ctx.strokeStyle = colorFlechaRetorno;
    ctx.fillStyle = colorFlechaRetorno;
    
    // Línea principal
    ctx.beginPath();
    ctx.moveTo(x2 - 5, yAtras);
    ctx.lineTo(x1 + 5, yAtras);
    ctx.stroke();
    
    // Punta de flecha
    ctx.beginPath();
    ctx.moveTo(x1 + 5, yAtras);
    ctx.lineTo(x1 + 5 + longitudFlecha, yAtras - anchoFlecha);
    ctx.lineTo(x1 + 5 + longitudFlecha - 3, yAtras);
    ctx.lineTo(x1 + 5 + longitudFlecha, yAtras + anchoFlecha);
    ctx.closePath();
    ctx.fill();
    
    // Etiqueta "prev"
    ctx.fillStyle = colorFlechaRetorno;
    ctx.font = `${Math.max(28, fontSize)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('prev', (x1 + x2) / 2, yAtras + 18);
    
    ctx.restore();
  };

  // Funciones de vector y matriz sin cambios
  const dibujarVector = (ctx, vector, startY, canvasWidth, alturaMaxima) => {
    let y = startY;
    const margen = 20;
    const anchoDisponible = canvasWidth - (margen * 2);
    
    const numElementos = vector.elementos.length;
    const espacioEntre = Math.min(10, anchoDisponible * 0.02);
    const anchoRect = Math.min(100, (anchoDisponible - ((numElementos - 1) * espacioEntre)) / numElementos);
    const altoRect = Math.min(80, alturaMaxima * 0.6);
    
    const fontSizeTitulo = Math.max(18, Math.min(28, canvasWidth * 0.025));
    const fontSizeValor = Math.max(16, Math.min(32, anchoRect * 0.35));
    const fontSizeIndice = Math.max(14, Math.min(22, anchoRect * 0.25));
    
    ctx.fillStyle = '#000';
    ctx.font = `30px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(
      `Vector ${vector.nombre} (Tamaño: ${vector.tamaño})`,
      canvasWidth / 2,
      y
    );
     
    y += fontSizeTitulo + 15;
     
    const totalAncho = numElementos * anchoRect + (numElementos - 1) * espacioEntre;
    const inicioX = (canvasWidth - totalAncho) / 2;
     
    vector.elementos.forEach((elemento, indice) => {
      const x = inicioX + indice * (anchoRect + espacioEntre);
      const rectY = y;
       
      ctx.strokeStyle = '#000';
      ctx.lineWidth = Math.max(1, canvasWidth * 0.001);
      ctx.strokeRect(x, rectY, anchoRect, altoRect);
       
      if (elemento.modificadoRecientemente) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(x, rectY, anchoRect, altoRect);
      }
       
      ctx.fillStyle = elemento.asignado ? '#0066cc' : '#cc0000';
      ctx.font = `${fontSizeValor}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(elemento.valor, x + anchoRect / 2, rectY + altoRect / 2);
       
      ctx.fillStyle = '#cc0000';
      ctx.font = `23px Arial`;
      ctx.fillText(`[${elemento.indice}]`, x + anchoRect / 2, rectY + altoRect + fontSizeIndice + 5);
    });
     
    return y + altoRect + fontSizeIndice + 40;
  };

  const dibujarMatriz = (ctx, matriz, startY, canvasWidth, alturaMaxima) => {
    let y = startY;
    const margen = 20;
    const anchoDisponible = canvasWidth - (margen * 2);
    
    const espacioEntre = Math.min(5, canvasWidth * 0.005);
    const anchoCelda = Math.min(100, (anchoDisponible - ((matriz.columnas - 1) * espacioEntre)) / matriz.columnas);
    const altoCelda = Math.min(80, (alturaMaxima * 0.7) / matriz.filas);
    
    const fontSizeTitulo = Math.max(16, Math.min(24, canvasWidth * 0.02));
    const fontSizeValor = Math.max(14, Math.min(28, anchoCelda * 0.3));
    
    ctx.fillStyle = '#000';
    ctx.font = `30px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(
      `Matriz ${matriz.nombre} (${matriz.filas}x${matriz.columnas})`,
      canvasWidth / 2,
      y
    );

    y += fontSizeTitulo + 25;
    
    const totalAncho = matriz.columnas * anchoCelda + (matriz.columnas - 1) * espacioEntre;
    const inicioX = Math.max(100, (canvasWidth - totalAncho) / 2);
    
    ctx.fillStyle = '#666';
    ctx.font = `23px Arial`;
    ctx.textAlign = 'center';
    for (let j = 0; j < matriz.columnas; j++) {
      const x = inicioX + j * (anchoCelda + espacioEntre);
      ctx.fillText(`Col ${j}`, x + anchoCelda / 2, y - 15);
    }
    
    matriz.elementos.forEach((filaData, i) => {
      const filaY = y + i * (altoCelda + espacioEntre);
      
      ctx.fillStyle = '#666';
      ctx.font = `23px Arial`;
      ctx.textAlign = 'right';
      ctx.fillText(`Fila ${i}`, inicioX - 10, filaY + altoCelda / 2);
      
      filaData.columnas.forEach((celda, j) => {
        const x = inicioX + j * (anchoCelda + espacioEntre);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(1, canvasWidth * 0.0005);
        ctx.strokeRect(x, filaY, anchoCelda, altoCelda);
        
        if (celda.modificadoRecientemente) {
          ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
          ctx.fillRect(x, filaY, anchoCelda, altoCelda);
        }
        
        ctx.fillStyle = celda.asignado ? '#0066cc' : '#cc0000';
        ctx.font = `${fontSizeValor}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(celda.valor, x + anchoCelda / 2, filaY + altoCelda / 2);
      });
    });
    
    const matrizAltura = matriz.filas * (altoCelda + espacioEntre) + 40;
    return y + matrizAltura;
  };

  return (
    <div className="canvas-container" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
      <canvas
        ref={canvasRef}
        width={1800}
        height={600}
        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
      />
    </div>
  );
};

export default CanvasVisual;