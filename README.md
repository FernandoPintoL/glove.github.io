# GloVe — Global Vectors for Word Representation

Una página web educativa que explica el algoritmo **GloVe** de Stanford de forma clara, con visualizaciones interactivas y prácticas ejecutables.

## 📚 Contenido

### Secciones Expositivas
- **¿Qué es GloVe?** — Definición y concepto central
- **Historia** — Evolución desde Word2Vec (2013) hasta GloVe (2014)
- **Matemáticas** — Explicación paso a paso de las fórmulas con ejemplos
  - Matriz de co-ocurrencias
  - Probabilidades de co-ocurrencia
  - Razones de probabilidades (el insight clave)
  - Función objetivo J
  - Función de ponderación f(x)
- **Comparativa** — Word2Vec vs GloVe en tabla detallada
- **Importancia** — Por qué GloVe fue revolucionario

### Prácticas Interactivas
1. **Función de Ponderación f(x)**
   - Ajusta α (alpha) y x_max en tiempo real
   - Visualiza cómo cambia la función

2. **Matriz de Co-ocurrencias**
   - Ingresa un corpus de texto
   - Genera la matriz de co-ocurrencias automáticamente
   - Calcula estadísticas de sparsidad

3. **Razones de Probabilidades**
   - Selecciona dos palabras
   - Calcula P(k|i)/P(k|j) para todas las palabras k
   - Entiende cómo capturan diferencias semánticas

4. **Función Objetivo J**
   - Ajusta parámetros
   - Calcula pérdida en tiempo real
   - Comprende el impacto de la función de ponderación

## 🚀 Inicio Rápido

### Opción 1: Abrir localmente
```bash
# Simplemente abre index.html en tu navegador
# No necesita servidor, es HTML + CSS + JavaScript puro
```

### Opción 2: Con un servidor local (recomendado)
```bash
# Python 3
python -m http.server 8000

# Node.js (si tienes npx)
npx serve .
```

Luego abre `http://localhost:8000` en tu navegador.

## 🧪 Ejecutar Pruebas

Las pruebas verifican que las fórmulas matemáticas sean correctas.

```bash
# Instalar dependencias (solo una vez)
npm install

# Ejecutar todas las pruebas
npm test

# Modo watch (se actualizan al cambiar código)
npm run test:watch

# Ver cobertura de código
npm run test:coverage
```

### Pruebas Incluidas
- ✅ Función de ponderación f(x)
- ✅ Probabilidades de co-ocurrencia
- ✅ Razones de probabilidades
- ✅ Logaritmo de frecuencia
- ✅ Función objetivo J de GloVe
- ✅ Construcción de matriz de co-ocurrencias
- ✅ Análisis de matriz
- ✅ Escenarios de integración

Todas las pruebas son **independientes de Node.js**, las funciones funcionan en navegador también.

## 📂 Estructura del Proyecto

```
glove-explicativo/
├── index.html              # Página principal (la única que necesitas para GitHub Pages)
├── css/
│   └── style.css          # Estilos responsivos y profesionales
├── js/
│   ├── glove.js           # Funciones matemáticas de GloVe (reutilizable)
│   └── interactive.js     # Lógica de prácticas interactivas
├── tests/
│   └── glove.test.js      # Suite de pruebas con Jest (30+ tests)
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

### Archivo `glove.js` (Reutilizable)
Este archivo contiene todas las funciones matemáticas de GloVe:
- `weightingFunction(x, xMax, alpha)` — Función de ponderación
- `cooccurrenceProbability(xij, xi)` — P(j|i)
- `probabilityRatio(pki, pkj)` — Razón de probabilidades
- `logFrequency(x)` — ln(x)
- `gloveObjective(...)` — Función de pérdida J
- `buildCooccurrenceMatrix(corpus, windowSize)` — Construir matriz
- `calculateProbabilities(matrix)` — Calcular distribuciones
- `calculateRatios(probabilities, word_i, word_j)` — Razones
- `analyzeCooccurrenceMatrix(matrix)` — Análisis estadístico

Todas estas funciones se exportan y pueden reutilizarse en otros proyectos.

## 🌐 Publicar en GitHub Pages

### Paso 1: Crear repositorio en GitHub
```bash
# Inicializar repo (si no lo has hecho)
git init
git add .
git commit -m "Initial commit: GloVe explicativo"

# Crear repo en GitHub (en web), luego:
git remote add origin https://github.com/tu-usuario/glove-explicativo.git
git branch -M main
git push -u origin main
```

### Paso 2: Habilitar GitHub Pages
1. Ve a `Settings` → `Pages`
2. Branch: `main`
3. Carpeta: `/ (root)`
4. ¡Listo! Tu sitio estará en `https://tu-usuario.github.io/glove-explicativo`

### Paso 3: Actualizar el footer
Edita `index.html` línea ~750, cambia:
```html
<a href="https://github.com/tu-usuario/glove-explicativo" target="_blank">Ver en GitHub</a>
```

## 💻 Tecnología Usada

- **HTML5** — Semántica
- **CSS3** — Gradientes, flexbox, grid, responsive
- **JavaScript Vanilla** — Sin dependencias en el navegador
- **Canvas API** — Para gráficos de la función de ponderación
- **Jest** — Para pruebas unitarias (dev dependency)

**Ventajas:**
- ✅ Cero dependencias en producción
- ✅ Funciona directo en GitHub Pages
- ✅ Compatible con todos los navegadores modernos
- ✅ Rápido y ligero

## 📖 Referencias

### Paper Original
> Pennington, J., Socher, R., & Manning, C. D. (2014). GloVe: Global Vectors for Word Representation. In Proceedings of the 2014 Conference on Empirical Methods in Natural Language Processing (pp. 1532-1543).

[Leer paper →](https://nlp.stanford.edu/pubs/glove.pdf)

### Recursos Relacionados
- [Stanford NLP Group](https://nlp.stanford.edu/)
- [Word2Vec (Mikolov et al., 2013)](https://arxiv.org/abs/1301.3781)
- [BERT (Devlin et al., 2018)](https://arxiv.org/abs/1810.04805) — Sucesor contextual

## 🎓 Créditos

**Sitio creado con:**
- Contenido educativo basado en el paper de Stanford
- Ejemplos adaptados del paper original
- Diseño responsive y prácticas interactivas

## 📝 Licencia

MIT — Libre para usar, modificar y distribuir

## 🐛 Problemas o Sugerencias

Si encuentras un error o tienes sugerencias:
1. Abre un issue en GitHub
2. Sugiere cambios con un pull request
3. Contacta al autor

---

**Made with ❤️ for learning NLP**

Último actualizado: 2026-04-21
