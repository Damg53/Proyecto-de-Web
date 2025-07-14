// tutorialConfig.js
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Configuración personalizada para el tutorial
const tutorialConfig = {
  // Configuración general del driver
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  
  // Textos personalizados en español
  nextBtnText: 'Siguiente →',
  prevBtnText: '← Anterior',
  doneBtnText: '¡Terminado!',
  closeBtnText: '×',
  
  // Configuración de animación
  animate: true,
  smoothScroll: true,
  
  // Configuración de overlay
  overlayColor: 'rgba(0, 0, 0, 0.7)',
  
  // Pasos del tutorial
  steps: [
    {
      element: '.control-panel h3',
      popover: {
        title: '¡Bienvenido al Tutor de Estructuras de Datos! 🎓',
        description: 'Este es tu espacio de aprendizaje interactivo donde podrás visualizar y entender diferentes estructuras de datos mientras programas.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '.selector-estructura',
      popover: {
        title: 'Selector de Estructuras 📊',
        description: 'Aquí puedes elegir qué estructura de datos quieres estudiar: Vector, Matriz, Pila, Cola, Lista, Árboles o Grafos. Cada una tiene sus propias características y casos de uso.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '.code-editor',
      popover: {
        title: 'Editor de Código 💻',
        description: 'Escribe tu código aquí. Este editor soporta sintaxis básica y te permite implementar operaciones sobre la estructura de datos seleccionada.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '.button-group:first-of-type',
      popover: {
        title: 'Controles de Ejecución ⚡',
        description: 'Usa "Ejecutar" para correr tu código y ver la visualización en tiempo real. "Reiniciar" te permite volver al estado inicial.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '.button-group:last-of-type',
      popover: {
        title: 'Navegación Paso a Paso 🔍',
        description: 'Estos botones te permiten navegar línea por línea a través de la ejecución de tu código, perfecto para entender cada paso del algoritmo.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '.visualization-panel',
      popover: {
        title: 'Panel de Visualización 🎨',
        description: 'Aquí aparecerá la representación visual de tu estructura de datos. Podrás ver cómo cambia en tiempo real mientras ejecutas tu código.',
        side: 'left',
        align: 'center'
      }
    },
    {
      element: '.info-panel',
      popover: {
        title: 'Panel de Información 📋',
        description: 'Este panel te mostrará información detallada sobre la línea de código que se está ejecutando, incluyendo explicaciones y consejos útiles.',
        side: 'left',
        align: 'center'
      }
    }
  ]
};

// Función para inicializar el tutorial
export const iniciarTutorial = () => {
  const driverObj = driver(tutorialConfig);
  driverObj.drive();
};

// Función para mostrar un paso específico del tutorial
export const mostrarPaso = (stepIndex) => {
  const driverObj = driver(tutorialConfig);
  driverObj.drive(stepIndex);
};

// Tutorial específico para diferentes estructuras de datos
export const tutorialEstructura = (tipoEstructura) => {
  const tutorialesEspecificos = {
    Vector: {
      ...tutorialConfig,
      steps: [
        {
          element: '.code-editor',
          popover: {
            title: 'Programando con Vectores 📈',
            description: 'Los vectores son estructuras lineales donde puedes acceder a elementos por índice. Prueba operaciones como push(), pop(), o acceso directo arr[i].',
            side: 'right'
          }
        }
      ]
    },
    Pila: {
      ...tutorialConfig,
      steps: [
        {
          element: '.code-editor',
          popover: {
            title: 'Trabajando con Pilas 📚',
            description: 'Las pilas siguen el principio LIFO (Last In, First Out). Implementa push() para agregar y pop() para quitar elementos.',
            side: 'right'
          }
        }
      ]
    },
    Cola: {
      ...tutorialConfig,
      steps: [
        {
          element: '.code-editor',
          popover: {
            title: 'Implementando Colas 🚶‍♂️',
            description: 'Las colas siguen el principio FIFO (First In, First Out). Usa enqueue() para agregar y dequeue() para quitar elementos.',
            side: 'right'
          }
        }
      ]
    }
  };

  const configEspecifica = tutorialesEspecificos[tipoEstructura] || tutorialConfig;
  const driverObj = driver(configEspecifica);
  driverObj.drive();
};

// Función para mostrar consejos contextuales
export const mostrarConsejo = (elemento, titulo, descripcion) => {
  const driverObj = driver({
    animate: true,
    overlayColor: 'rgba(99, 102, 241, 0.4)',
    steps: [
      {
        element: elemento,
        popover: {
          title: titulo,
          description: descripcion,
          side: 'bottom',
          align: 'center'
        }
      }
    ]
  });
  driverObj.drive();
};

export default tutorialConfig;