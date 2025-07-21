// index.js - Archivo principal de exportación
import VectorVisual from './VectorVisual.js';
import MatrizVisual from './MatrizVisual.js';
import ListaVisual from './ListaVisual.js'; // Nueva importación
import NodoDL from './NodoDL.js';  
import ArbolVisual from './ArbolVisual.js';
import NodoArbol from './NodoArbol.js';         // Nueva importación
import GrafoVisual from './GrafoVisual.js';
import NodoGrafo from './NodoGrafo.js';
import InterpretadorEstructuras from './InterpretadorEstructuras.js';

export {
    VectorVisual,
    MatrizVisual,
    ListaVisual,   // Exportar nueva clase
    NodoDL, 
    ArbolVisual,       // Exportar nueva clase
    NodoArbol,
    GrafoVisual,
    NodoGrafo,
    InterpretadorEstructuras
};