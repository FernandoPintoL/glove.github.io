// ========================================
// FUNCIONES MATEMÁTICAS DE GLOVE
// ========================================

/**
 * Función de ponderación f(x)
 * Controla el peso de cada par de co-ocurrencia
 * @param {number} x - Frecuencia de co-ocurrencia
 * @param {number} xMax - Punto de saturación
 * @param {number} alpha - Parámetro de curvatura
 * @returns {number} - Peso entre 0 y 1
 */
function weightingFunction(x, xMax, alpha) {
    if (x >= xMax) return 1;
    if (x === 0) return 0;
    return Math.pow(x / xMax, alpha);
}

/**
 * Probabilidad de co-ocurrencia P(j|i)
 * @param {number} xij - Frecuencia de co-ocurrencia de i y j
 * @param {number} xi - Total de palabras en contexto de i
 * @returns {number} - Probabilidad entre 0 y 1
 */
function cooccurrenceProbability(xij, xi) {
    if (xi === 0) return 0;
    return xij / xi;
}

/**
 * Razón de probabilidades P(k|i) / P(k|j)
 * @param {number} pki - Probabilidad P(k|i)
 * @param {number} pkj - Probabilidad P(k|j)
 * @returns {number} - Razón
 */
function probabilityRatio(pki, pkj) {
    if (pkj === 0) return Infinity;
    return pki / pkj;
}

/**
 * Logaritmo natural de la frecuencia
 * @param {number} x - Frecuencia
 * @returns {number} - ln(x)
 */
function logFrequency(x) {
    if (x <= 0) return 0;
    return Math.log(x);
}

/**
 * Función de pérdida J de GloVe (para un par de palabras)
 * J = f(X_ij) * (w_i · w_j + b_i + b_j - log X_ij)^2
 * @param {number} xij - Frecuencia de co-ocurrencia
 * @param {number} dotProduct - w_i · w_j + b_i + b_j (producto punto + sesgos)
 * @param {number} xMax - Punto de saturación para f(x)
 * @param {number} alpha - Parámetro de curvatura para f(x)
 * @returns {number} - Valor de pérdida
 */
function gloveObjective(xij, dotProduct, xMax = 100, alpha = 0.75) {
    if (xij === 0) return 0;

    const f = weightingFunction(xij, xMax, alpha);
    const logX = logFrequency(xij);
    const difference = dotProduct - logX;

    return f * Math.pow(difference, 2);
}

/**
 * Construir matriz de co-ocurrencias desde un corpus
 * @param {string} corpus - Texto del corpus
 * @param {number} windowSize - Tamaño de ventana de contexto
 * @returns {Object} - Matriz de co-ocurrencias {palabra1: {palabra2: freq, ...}, ...}
 */
function buildCooccurrenceMatrix(corpus, windowSize = 2) {
    // Limpiar y tokenizar
    const words = corpus
        .toLowerCase()
        .match(/\b\w+\b/g) || [];

    if (words.length === 0) return {};

    const matrix = {};

    // Inicializar palabras únicas
    const uniqueWords = [...new Set(words)];
    uniqueWords.forEach(word => {
        matrix[word] = {};
        uniqueWords.forEach(w => {
            matrix[word][w] = 0;
        });
    });

    // Contar co-ocurrencias
    for (let i = 0; i < words.length; i++) {
        const target = words[i];

        // Ventana a la izquierda
        for (let j = Math.max(0, i - windowSize); j < i; j++) {
            const context = words[j];
            matrix[target][context]++;
        }

        // Ventana a la derecha
        for (let j = i + 1; j <= Math.min(words.length - 1, i + windowSize); j++) {
            const context = words[j];
            matrix[target][context]++;
        }
    }

    return matrix;
}

/**
 * Calcular distribuciones de probabilidad desde matriz
 * @param {Object} matrix - Matriz de co-ocurrencias
 * @returns {Object} - {palabra1: {palabra2: P(palabra2|palabra1), ...}, ...}
 */
function calculateProbabilities(matrix) {
    const probabilities = {};

    Object.keys(matrix).forEach(word => {
        probabilities[word] = {};

        // Total de contextos para esta palabra
        const total = Object.values(matrix[word]).reduce((a, b) => a + b, 0);

        Object.keys(matrix[word]).forEach(context => {
            probabilities[word][context] = cooccurrenceProbability(matrix[word][context], total);
        });
    });

    return probabilities;
}

/**
 * Calcular razones de probabilidades entre dos palabras
 * @param {Object} probabilities - Matriz de probabilidades
 * @param {string} word_i - Primera palabra
 * @param {string} word_j - Segunda palabra
 * @returns {Array} - Array de objetos {word, pki, pkj, ratio, type}
 */
function calculateRatios(probabilities, word_i, word_j) {
    const ratios = [];

    if (!probabilities[word_i] || !probabilities[word_j]) {
        return ratios;
    }

    const contextWords = Object.keys(probabilities[word_i]);

    contextWords.forEach(k => {
        const pki = probabilities[word_i][k] || 0;
        const pkj = probabilities[word_j][k] || 0;

        let ratio, type;

        if (pkj === 0) {
            ratio = pki > 0 ? Infinity : 1;
            type = "No comparable";
        } else {
            ratio = probabilityRatio(pki, pkj);

            if (ratio > 5) {
                type = "Fuertemente relacionado con " + word_i;
            } else if (ratio < 0.2) {
                type = "Fuertemente relacionado con " + word_j;
            } else if (ratio > 0.8 && ratio < 1.2) {
                type = "Relacionado con ambos por igual";
            } else {
                type = "Moderadamente relacionado";
            }
        }

        ratios.push({
            word: k,
            pki: parseFloat(pki.toFixed(4)),
            pkj: parseFloat(pkj.toFixed(4)),
            ratio: ratio === Infinity ? "∞" : parseFloat(ratio.toFixed(2)),
            type: type
        });
    });

    // Ordenar por razón descendente
    return ratios.sort((a, b) => {
        const ratioA = a.ratio === "∞" ? Infinity : parseFloat(a.ratio);
        const ratioB = b.ratio === "∞" ? Infinity : parseFloat(b.ratio);
        return ratioB - ratioA;
    });
}

/**
 * Generar datos de demostración para la función de ponderación
 * @param {number} xMax - Punto de saturación
 * @param {number} alpha - Parámetro de curvatura
 * @returns {Array} - Array de {x, weight}
 */
function generateWeightingFunctionData(xMax = 100, alpha = 0.75) {
    const data = [];
    const step = xMax / 50;

    for (let x = 0; x <= 300; x += step) {
        const weight = weightingFunction(x, xMax, alpha);
        data.push({ x, weight });
    }

    return data;
}

/**
 * Calcular estadísticas sobre matriz de co-ocurrencias
 * @param {Object} matrix - Matriz de co-ocurrencias
 * @returns {Object} - Estadísticas {totalPairs, averageCooccurrence, mostCommon, ...}
 */
function analyzeCooccurrenceMatrix(matrix) {
    const words = Object.keys(matrix);
    let totalCooccurrences = 0;
    let maxCooccurrence = 0;
    let nonZeroPairs = 0;
    let mostCommonPair = { word1: "", word2: "", count: 0 };

    words.forEach(word1 => {
        words.forEach(word2 => {
            const count = matrix[word1][word2];
            if (count > 0) {
                totalCooccurrences += count;
                nonZeroPairs++;
                if (count > maxCooccurrence) {
                    maxCooccurrence = count;
                    mostCommonPair = { word1, word2, count };
                }
            }
        });
    });

    const totalCells = words.length * words.length;

    return {
        totalWords: words.length,
        totalPairs: totalCooccurrences,
        averageCooccurrence: totalCooccurrences / (nonZeroPairs || 1),
        maxCooccurrence,
        mostCommonPair,
        sparsity: 1 - (nonZeroPairs / totalCells)
    };
}

// Exportar para Jest (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        weightingFunction,
        cooccurrenceProbability,
        probabilityRatio,
        logFrequency,
        gloveObjective,
        buildCooccurrenceMatrix,
        calculateProbabilities,
        calculateRatios,
        generateWeightingFunctionData,
        analyzeCooccurrenceMatrix
    };
}
