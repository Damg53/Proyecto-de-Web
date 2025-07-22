// components/PanelInformacion.jsx
// Importa React para crear el componente
import React from 'react';

// Función que genera la teoría específica según la estructura y el paso actual
const generarTeoriaPaso = (estadoVisualizacion, estructuraSeleccionada) => {
  // Debug para ver qué datos están llegando
  console.log('Debug - EstadoVisualizacion:', estadoVisualizacion);
  console.log('Debug - EstructuraSeleccionada:', estructuraSeleccionada);

  if (!estadoVisualizacion || !estructuraSeleccionada) {
    return null;
  }

  const { pasoActual, totalPasos, lineaActual, estructuras } = estadoVisualizacion;

  // Debug para ver las estructuras disponibles
  console.log('Debug - Estructuras:', estructuras);

  // TEORÍA PARA VECTORES (ARRAYS)
  if (estructuraSeleccionada === 'Vector') {
    // Buscar vector con diferentes posibles tipos
    let vector = estructuras?.find(e => e.tipo === 'vector' || e.tipo === 'array' || e.tipo === 'Vector');
    
    // Si no encontramos por tipo, buscar por estructura que contenga elementos array-like
    if (!vector && estructuras?.length > 0) {
      vector = estructuras.find(e => e.elementos || e.datos || Array.isArray(e.valor));
    }

    // Mostrar teoría genérica si no encontramos estructura específica
    const nombre = vector?.nombre || 'arr';
    const tamaño = vector?.tamaño || vector?.elementos?.length || 5;
    const elementos = vector?.elementos || vector?.datos || [];
    
    const teorias = [
      {
        titulo: "🔧 Declaración de Vector",
        teoria: `Se está declarando un vector llamado "${nombre}" con capacidad para ${tamaño} elementos. En memoria, esto reserva ${tamaño} espacios contiguos de memoria, cada uno capaz de almacenar un entero.`,
        complejidad: "O(1) - Tiempo constante para la declaración",
        detalle: `Los vectores son estructuras de datos fundamentales que almacenan elementos del mismo tipo en posiciones consecutivas de memoria. Esto permite acceso directo por índice.`
      },
      {
        titulo: "📝 Asignación por Índice",
        teoria: `Se está asignando un valor en la posición específica del vector "${nombre}". El acceso directo por índice es la operación más eficiente en vectores.`,
        complejidad: "O(1) - Acceso y asignación en tiempo constante",
        detalle: `La fórmula para calcular la dirección de memoria es: dirección_base + (índice * tamaño_elemento). Esta es la razón de la eficiencia O(1).`
      },
      {
        titulo: "🔍 Operación de Acceso",
        teoria: `Se está accediendo al elemento en la posición indicada del vector "${nombre}". Los vectores permiten acceso aleatorio instantáneo a cualquier elemento.`,
        complejidad: "O(1) - Acceso directo por índice",
        detalle: `A diferencia de las listas enlazadas, no necesitamos recorrer elementos previos para llegar al deseado.`
      }
    ];

    // Determinar qué teoría mostrar
    if (pasoActual === 1) {
      return teorias[0];
    } else if (pasoActual === 2 || elementos.length > 0) {
      return {
        ...teorias[1],
        teoria: `${teorias[1].teoria} ${vector ? `Actualmente "${nombre}" tiene elementos asignados.` : ''}`
      };
    } else {
      return teorias[2];
    }
  }

  // TEORÍA PARA MATRICES (ARRAYS 2D)
  if (estructuraSeleccionada === 'Matriz') {
    let matriz = estructuras?.find(e => e.tipo === 'matriz' || e.tipo === 'matrix' || e.tipo === 'Matriz');
    
    if (!matriz && estructuras?.length > 0) {
      matriz = estructuras.find(e => e.filas || e.columnas || (e.elementos && Array.isArray(e.elementos[0])));
    }

    const nombre = matriz?.nombre || 'mat';
    const filas = matriz?.filas || 3;
    const columnas = matriz?.columnas || 3;
    const elementos = matriz?.elementos || [];
    const elementosAsignados = Array.isArray(elementos) ? elementos.filter(e => e.valor !== undefined).length : 0;
    
    const teorias = [
      {
        titulo: "🏗️ Declaración de Matriz",
        teoria: `Se está declarando una matriz "${nombre}" de ${filas}×${columnas} (${filas} filas por ${columnas} columnas). Esto reserva ${filas * columnas} espacios contiguos en memoria.`,
        complejidad: "O(1) - Declaración en tiempo constante",
        detalle: `Las matrices son vectores bidimensionales. En memoria, se almacenan como un vector lineal donde mat[i][j] se mapea a la posición (i * columnas + j).`
      },
      {
        titulo: "📍 Asignación Bidimensional",
        teoria: `Se está asignando un valor en la posición [fila][columna] de la matriz "${nombre}". El sistema calcula automáticamente la posición real en memoria.`,
        complejidad: "O(1) - Acceso directo bidimensional",
        detalle: `Para matriz[i][j], la dirección real es: base + (i * número_columnas + j) * tamaño_elemento. ${matriz ? `Actualmente hay ${elementosAsignados} elementos asignados.` : ''}`
      },
      {
        titulo: "🎯 Navegación Matricial",
        teoria: `Se está accediendo a un elemento específico en la matriz "${nombre}". Las matrices permiten navegación eficiente en dos dimensiones.`,
        complejidad: "O(1) - Acceso aleatorio bidimensional",
        detalle: `Las matrices son ideales para representar tablas, imágenes, o cualquier estructura de datos bidimensional donde necesites acceso directo por coordenadas.`
      }
    ];

    if (pasoActual === 1) {
      return teorias[0];
    } else if (pasoActual === 2 || elementosAsignados > 0) {
      return teorias[1];
    } else {
      return teorias[2];
    }
  }

  // TEORÍA PARA LISTAS ENLAZADAS
  if (estructuraSeleccionada === 'Lista') {
    let lista = estructuras?.find(e => 
      e.tipo === 'lista' || 
      e.tipo === 'ListaDoble' || 
      e.tipo === 'LinkedList' ||
      e.tipo === 'DoublyLinkedList'
    );
    
    if (!lista && estructuras?.length > 0) {
      lista = estructuras.find(e => e.nodos || e.cabeza || e.head || e.primer || e.ultimo);
    }

    const nombre = lista?.nombre || 'miLista';
    const tamaño = lista?.tamaño || lista?.nodos?.length || 0;
    const nodos = lista?.nodos || [];
    const tipoLista = lista?.tipo?.includes('Doble') || lista?.dobleEnlace ? 'doblemente enlazada' : 'simplemente enlazada';
    
    const teorias = [
      {
        titulo: "🔗 Declaración de Lista Enlazada",
        teoria: `Se está declarando una lista ${tipoLista} llamada "${nombre}". A diferencia de los vectores, las listas no requieren reservar memoria contigua inicialmente.`,
        complejidad: "O(1) - Declaración en tiempo constante",
        detalle: `Las listas enlazadas almacenan elementos (nodos) en ubicaciones arbitrarias de memoria, conectándolos mediante punteros. Esto permite crecimiento dinámico sin desperdicio de memoria.`
      },
      {
        titulo: "➕ Inserción de Nodo",
        teoria: `Se está insertando un nodo en la lista "${nombre}". ${tipoLista === 'doblemente enlazada' ? 'En listas dobles, cada nodo tiene punteros al anterior y al siguiente.' : 'En listas simples, cada nodo apunta solo al siguiente.'}`,
        complejidad: tamaño <= 1 ? "O(1) - Inserción al inicio" : "O(n) - Inserción en posición específica",
        detalle: `${tipoLista === 'doblemente enlazada' ? 'Las listas dobles permiten navegación bidireccional pero requieren más memoria (2 punteros por nodo).' : 'Las listas simples usan menos memoria pero solo permiten navegación hacia adelante.'} Actualmente hay ${tamaño} elemento${tamaño !== 1 ? 's' : ''}.`
      },
      {
        titulo: "🗑️ Eliminación de Nodo",
        teoria: `Se está eliminando un nodo de la lista "${nombre}". La eliminación requiere actualizar los punteros de los nodos adyacentes para mantener la conectividad.`,
        complejidad: pasoActual <= 2 ? "O(1) - Eliminación al inicio" : "O(n) - Eliminación en posición específica",
        detalle: `${tipoLista === 'doblemente enlazada' ? 'En listas dobles, se actualizan tanto el puntero "siguiente" del nodo anterior como el "anterior" del nodo posterior.' : 'En listas simples, se debe recorrer hasta el nodo anterior para actualizar su puntero.'} Lista actual: ${tamaño} elemento${tamaño !== 1 ? 's' : ''}.`
      },
      {
        titulo: "🔍 Búsqueda en Lista",
        teoria: `Se está buscando un elemento en la lista "${nombre}". Las listas requieren recorrido secuencial desde el inicio hasta encontrar el elemento deseado.`,
        complejidad: "O(n) - Búsqueda secuencial",
        detalle: `A diferencia de los vectores, las listas no permiten acceso directo por índice. Debemos seguir los punteros nodo por nodo hasta encontrar el elemento buscado.`
      }
    ];

    // Determinar teoría basada en la operación detectada
    if (pasoActual === 1 || tamaño === 0) {
      return teorias[0];
    } else if (pasoActual <= 3 && tamaño > 0) {
      return teorias[1];
    } else if (tamaño > 0) {
      // Intentar detectar si es eliminación o búsqueda basado en el contexto
      return teorias[2]; // Por defecto eliminación
    } else {
      return teorias[3];
    }
  }

  // TEORÍA PARA ÁRBOLES BINARIOS
  if (estructuraSeleccionada === 'Arboles') {
    let arbol = estructuras?.find(e => 
      e.tipo === 'arbol' || 
      e.tipo === 'ArbolBinario' || 
      e.tipo === 'BinaryTree' ||
      e.tipo === 'BST'
    );
    
    if (!arbol && estructuras?.length > 0) {
      arbol = estructuras.find(e => e.raiz || e.root || e.nodos);
    }

    const nombre = arbol?.nombre || 'BOF';
    const nodos = arbol?.nodos || [];
    const cantidadNodos = nodos.length;
    const raiz = arbol?.raiz || (nodos.length > 0 ? nodos[0] : null);
    const altura = arbol?.altura || Math.floor(Math.log2(cantidadNodos + 1));
    
    const teorias = [
      {
        titulo: "🌳 Declaración de Árbol Binario",
        teoria: `Se está declarando un árbol binario llamado "${nombre}". Un árbol binario es una estructura jerárquica donde cada nodo puede tener máximo 2 hijos: izquierdo y derecho.`,
        complejidad: "O(1) - Declaración en tiempo constante",
        detalle: `Los árboles binarios organizan datos de forma jerárquica, permitiendo operaciones eficientes de búsqueda, inserción y eliminación cuando están balanceados.`
      },
      {
        titulo: "🌱 Inserción en Árbol",
        teoria: `Se está insertando un nodo con valor en el árbol "${nombre}". En un árbol binario de búsqueda, los valores menores van a la izquierda y los mayores a la derecha.`,
        complejidad: cantidadNodos <= 4 ? "O(log n) - Inserción eficiente en árbol balanceado" : "O(n) - Peor caso en árbol desbalanceado",
        detalle: `La inserción mantiene la propiedad de BST: para cada nodo, todos los valores en el subárbol izquierdo son menores, y todos en el derecho son mayores. Nodos actuales: ${cantidadNodos}, altura aproximada: ${altura}.`
      },
      {
        titulo: "🔍 Búsqueda en Árbol",
        teoria: `Se está buscando un valor en el árbol "${nombre}". La búsqueda aprovecha la propiedad de ordenamiento para descartar la mitad del árbol en cada comparación.`,
        complejidad: "O(log n) - Búsqueda eficiente en árbol balanceado",
        detalle: `La búsqueda binaria en árboles es mucho más eficiente que en listas. En cada nodo, comparamos el valor buscado y decidimos ir a la izquierda (menor) o derecha (mayor).`
      },
      {
        titulo: "🚶 Recorrido de Árbol",
        teoria: `Se está realizando un recorrido del árbol "${nombre}". Los recorridos sistemáticos permiten visitar todos los nodos en un orden específico.`,
        complejidad: "O(n) - Se debe visitar cada nodo exactamente una vez",
        detalle: `Existen tres recorridos principales: Inorden (izq-raíz-der) da elementos ordenados en BST, Preorden (raíz-izq-der) útil para copiar, Postorden (izq-der-raíz) para eliminar árbol.`
      },
      {
        titulo: "⚖️ Balanceo del Árbol",
        teoria: `Se está evaluando o manteniendo el balance del árbol "${nombre}". Un árbol balanceado mantiene operaciones eficientes O(log n).`,
        complejidad: "O(log n) - Operaciones en árbol bien balanceado",
        detalle: `Un árbol está balanceado cuando la diferencia de altura entre subárboles izquierdo y derecho no excede 1. Árboles desbalanceados se comportan como listas enlazadas (O(n)).`
      }
    ];

    // Determinar teoría basada en el paso y estado del árbol
    if (pasoActual === 1 || cantidadNodos === 0) {
      return teorias[0];
    } else if (pasoActual <= 3 || (pasoActual <= cantidadNodos && cantidadNodos <= 8)) {
      return teorias[1];
    } else if (pasoActual > cantidadNodos || (cantidadNodos > 3 && pasoActual > cantidadNodos / 2)) {
      // Probablemente búsqueda o recorrido
      return cantidadNodos > 5 ? teorias[3] : teorias[2];
    } else {
      return teorias[4];
    }
  }

  // TEORÍA PARA PILAS (STACKS)
  if (estructuraSeleccionada === 'Pila') {
    let pila = estructuras?.find(e => 
      e.tipo === 'pila' || 
      e.tipo === 'Pila' || 
      e.tipo === 'Stack'
    );
    
    if (!pila && estructuras?.length > 0) {
      pila = estructuras.find(e => e.elementos || e.tope || e.top);
    }

    const nombre = pila?.nombre || 'miPila';
    const tamaño = pila?.tamaño || pila?.elementos?.length || 0;
    const elementos = pila?.elementos || [];
    
    const teorias = [
      {
        titulo: "📚 Declaración de Pila (Stack)",
        teoria: `Se está declarando una pila llamada "${nombre}". Las pilas siguen el principio LIFO (Last In, First Out): el último elemento en entrar es el primero en salir.`,
        complejidad: "O(1) - Declaración en tiempo constante",
        detalle: `Las pilas son como una pila de platos: solo puedes agregar o quitar elementos desde la parte superior (tope). Son fundamentales en la gestión de memoria y llamadas a funciones.`
      },
      {
        titulo: "⬆️ Operación Push",
        teoria: `Se está insertando un elemento en el tope de la pila "${nombre}". La operación push agrega un nuevo elemento encima de todos los demás.`,
        complejidad: "O(1) - Inserción en tiempo constante",
        detalle: `El push actualiza el puntero del tope y coloca el nuevo elemento en esa posición. Actualmente la pila tiene ${tamaño} elemento${tamaño !== 1 ? 's' : ''}.`
      },
      {
        titulo: "⬇️ Operación Pop",
        teoria: `Se está extrayendo el elemento del tope de la pila "${nombre}". La operación pop remueve y retorna el último elemento insertado.`,
        complejidad: "O(1) - Extracción en tiempo constante",
        detalle: `El pop devuelve el elemento del tope y actualiza el puntero. Si la pila está vacía, genera un error de underflow. Elementos restantes: ${tamaño}.`
      },
      {
        titulo: "👀 Operación Peek/Top",
        teoria: `Se está consultando el elemento del tope de la pila "${nombre}" sin removerlo. Peek permite ver el próximo elemento a extraer.`,
        complejidad: "O(1) - Consulta en tiempo constante",
        detalle: `Peek/Top es útil para verificar qué elemento se extraerá sin modificar la pila. Es seguro usar cuando se necesita tomar decisiones basadas en el tope.`
      }
    ];

    if (pasoActual === 1 || tamaño === 0) {
      return teorias[0];
    } else if (pasoActual <= 3) {
      return teorias[1]; // Push
    } else if (pasoActual <= 5) {
      return teorias[2]; // Pop
    } else {
      return teorias[3]; // Peek
    }
  }

  // TEORÍA PARA COLAS (QUEUES)
  if (estructuraSeleccionada === 'Cola') {
    let cola = estructuras?.find(e => 
      e.tipo === 'cola' || 
      e.tipo === 'Cola' || 
      e.tipo === 'Queue'
    );
    
    if (!cola && estructuras?.length > 0) {
      cola = estructuras.find(e => e.elementos || e.frente || e.front || e.rear);
    }

    const nombre = cola?.nombre || 'miCola';
    const tamaño = cola?.tamaño || cola?.elementos?.length || 0;
    const elementos = cola?.elementos || [];
    
    const teorias = [
      {
        titulo: "🚶‍♀️ Declaración de Cola (Queue)",
        teoria: `Se está declarando una cola llamada "${nombre}". Las colas siguen el principio FIFO (First In, First Out): el primer elemento en entrar es el primero en salir.`,
        complejidad: "O(1) - Declaración en tiempo constante",
        detalle: `Las colas simulan filas de espera: los elementos se agregan por un extremo (rear) y se remueven por el otro (front). Son esenciales en sistemas de colas de procesos y algoritmos BFS.`
      },
      {
        titulo: "➡️ Operación Enqueue",
        teoria: `Se está insertando un elemento al final de la cola "${nombre}". Enqueue agrega el elemento al rear (parte trasera) de la cola.`,
        complejidad: "O(1) - Inserción en tiempo constante",
        detalle: `El nuevo elemento se coloca después del último elemento existente. Mantiene el orden de llegada. Cola actual: ${tamaño} elemento${tamaño !== 1 ? 's' : ''}.`
      },
      {
        titulo: "⬅️ Operación Dequeue",
        teoria: `Se está extrayendo el primer elemento de la cola "${nombre}". Dequeue remueve y retorna el elemento del front (parte delantera).`,
        complejidad: "O(1) - Extracción en tiempo constante",
        detalle: `Se remueve el elemento que más tiempo lleva esperando. Si la cola está vacía, genera un error de underflow. Elementos restantes: ${tamaño}.`
      },
      {
        titulo: "🔍 Operación Front",
        teoria: `Se está consultando el primer elemento de la cola "${nombre}" sin removerlo. Front permite ver el próximo elemento a procesar.`,
        complejidad: "O(1) - Consulta en tiempo constante",
        detalle: `Front es útil para verificar qué elemento se procesará a continuación sin modificar la cola. Ideal para toma de decisiones en sistemas de colas.`
      }
    ];

    if (pasoActual === 1 || tamaño === 0) {
      return teorias[0];
    } else if (pasoActual <= 3) {
      return teorias[1]; // Enqueue
    } else if (pasoActual <= 5) {
      return teorias[2]; // Dequeue
    } else {
      return teorias[3]; // Front
    }
  }

  // TEORÍA PARA GRAFOS
  if (estructuraSeleccionada === 'Grafos') {
    let grafo = estructuras?.find(e => 
      e.tipo === 'grafo' || 
      e.tipo === 'Grafo' || 
      e.tipo === 'Graph'
    );
    
    if (!grafo && estructuras?.length > 0) {
      grafo = estructuras.find(e => e.nodos || e.vertices || e.aristas || e.edges);
    }

    const nombre = grafo?.nombre || 'miGrafo';
    const nodos = grafo?.nodos || [];
    const aristas = grafo?.aristas || [];
    const cantidadNodos = nodos.length;
    const cantidadAristas = aristas.length;
    const esDirigido = grafo?.dirigido || false;
    
    const teorias = [
      {
        titulo: "🕸️ Declaración de Grafo",
        teoria: `Se está declarando un grafo ${esDirigido ? 'dirigido' : 'no dirigido'} llamado "${nombre}". Los grafos modelan relaciones complejas entre entidades.`,
        complejidad: "O(1) - Declaración en tiempo constante",
        detalle: `Los grafos consisten en nodos (vértices) conectados por aristas (edges). ${esDirigido ? 'En grafos dirigidos, las aristas tienen dirección.' : 'En grafos no dirigidos, las conexiones son bidireccionales.'}`
      },
      {
        titulo: "🔵 Adición de Nodo",
        teoria: `Se está agregando un nodo al grafo "${nombre}". Los nodos representan entidades o estados en el problema modelado.`,
        complejidad: "O(1) - Inserción de nodo en tiempo constante",
        detalle: `Cada nodo puede tener un identificador único y propiedades asociadas. Actualmente el grafo tiene ${cantidadNodos} nodo${cantidadNodos !== 1 ? 's' : ''}.`
      },
      {
        titulo: "🔗 Adición de Arista",
        teoria: `Se está agregando una arista entre dos nodos en el grafo "${nombre}". Las aristas representan relaciones o conexiones.`,
        complejidad: "O(1) - Inserción de arista en tiempo constante",
        detalle: `${esDirigido ? 'En grafos dirigidos, la arista va desde el nodo origen hasta el destino.' : 'En grafos no dirigidos, la arista conecta ambos nodos mutuamente.'} Total de aristas: ${cantidadAristas}.`
      },
      {
        titulo: "🔍 Búsqueda BFS",
        teoria: `Se está ejecutando una búsqueda en anchura (BFS) en el grafo "${nombre}". BFS explora nivel por nivel desde el nodo inicial.`,
        complejidad: "O(V + E) - Donde V son vértices y E son aristas",
        detalle: `BFS usa una cola para mantener el orden de exploración. Garantiza encontrar el camino más corto en grafos no ponderados. Es ideal para problemas de camino mínimo.`
      },
      {
        titulo: "🕳️ Búsqueda DFS",
        teoria: `Se está ejecutando una búsqueda en profundidad (DFS) en el grafo "${nombre}". DFS explora tan profundo como sea posible antes de retroceder.`,
        complejidad: "O(V + E) - Donde V son vértices y E son aristas",
        detalle: `DFS usa una pila (o recursión) para la exploración. Es útil para detectar ciclos, componentes conexas, y ordenamiento topológico.`
      },
      {
        titulo: "🛤️ Algoritmo de Dijkstra",
        teoria: `Se está ejecutando el algoritmo de Dijkstra en el grafo "${nombre}" para encontrar el camino más corto entre dos nodos.`,
        complejidad: "O((V + E) log V) - Con cola de prioridad",
        detalle: `Dijkstra encuentra el camino de menor costo en grafos con pesos positivos. Mantiene un conjunto de nodos visitados y actualiza las distancias mínimas iterativamente.`
      }
    ];

    // Determinar teoría basada en la operación y estado
    if (pasoActual === 1 || (cantidadNodos === 0 && cantidadAristas === 0)) {
      return teorias[0];
    } else if (pasoActual <= 5 && cantidadAristas === 0) {
      return teorias[1]; // Agregando nodos
    } else if (pasoActual <= 10 && cantidadAristas < cantidadNodos) {
      return teorias[2]; // Agregando aristas
    } else if (pasoActual <= 12) {
      return teorias[3]; // BFS
    } else if (pasoActual <= 14) {
      return teorias[4]; // DFS
    } else {
      return teorias[5]; // Dijkstra
    }
  }

  // Si llegamos aquí, mostrar teoría genérica
  return null;
};

// Componente funcional que muestra información contextual sobre el paso actual
// Recibe como props:
// - descripcion: texto descriptivo básico del paso
// - estadoVisualizacion: objeto con información completa del estado actual
// - estructuraSeleccionada: tipo de estructura que se está visualizando
const PanelInformacion = ({ descripcion, estadoVisualizacion, estructuraSeleccionada }) => {
  
  // Generar teoría específica para el paso actual
  const teoriaActual = generarTeoriaPaso(estadoVisualizacion, estructuraSeleccionada);

  return (
    // Contenedor principal del panel de información
    <div className="info-panel">
      
      {/* Sección de información básica del paso */}
      <div id="stepInfo" className="step-info">
        <h5>Información del paso:</h5>
        <p id="stepDescription">{descripcion}</p>
      </div>

      {/* Sección de teoría avanzada si está disponible */}
      {teoriaActual && (
        <div className="teoria-panel mt-3 p-3 border-left border-primary bg-light">
          <h6 className="text-primary">
            <i className="fas fa-graduation-cap me-2"></i>
            {teoriaActual.titulo}
          </h6>
          
          <p className="mb-2">
            <strong>Teoría:</strong> {teoriaActual.teoria}
          </p>
          
          <p className="mb-2 text-success">
            <strong>Complejidad:</strong> {teoriaActual.complejidad}
          </p>
          
          <p className="mb-0 text-muted">
            <strong>Detalle técnico:</strong> {teoriaActual.detalle}
          </p>
        </div>
      )}

      {/* Información de progreso si hay ejecución paso a paso */}
      {estadoVisualizacion && estadoVisualizacion.pasoActual && (
        <div className="progreso-panel mt-2 p-2 bg-info text-white rounded">
         
            📊 Progreso: {estadoVisualizacion.pasoActual}/{estadoVisualizacion.totalPasos}
            {estadoVisualizacion.lineaActual && (
              <span> | Línea: {estadoVisualizacion.lineaActual}</span>
            )}
         
        </div>
      )}
    </div>
  );
};

// Exporta el componente como default para poder importarlo en otros archivos
export default PanelInformacion;
