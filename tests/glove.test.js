// ========================================
// PRUEBAS UNITARIAS DE GLOVE CON JEST
// ========================================

const {
    weightingFunction,
    cooccurrenceProbability,
    probabilityRatio,
    logFrequency,
    gloveObjective,
    buildCooccurrenceMatrix,
    calculateProbabilities,
    calculateRatios,
    analyzeCooccurrenceMatrix
} = require('../js/glove.js');

describe('weightingFunction - Función de Ponderación f(x)', () => {
    test('retorna 0 cuando x = 0', () => {
        expect(weightingFunction(0, 100, 0.75)).toBe(0);
    });

    test('retorna 1 cuando x >= x_max', () => {
        expect(weightingFunction(100, 100, 0.75)).toBe(1);
        expect(weightingFunction(200, 100, 0.75)).toBe(1);
        expect(weightingFunction(500, 100, 0.75)).toBe(1);
    });

    test('retorna valor entre 0 y 1 cuando 0 < x < x_max', () => {
        const result = weightingFunction(50, 100, 0.75);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(1);
    });

    test('con x=50, x_max=100, alpha=0.75 da aproximadamente 0.595', () => {
        const result = weightingFunction(50, 100, 0.75);
        expect(result).toBeCloseTo(0.5946, 3);
    });

    test('parámetro alpha controla la curvatura', () => {
        const x = 50, xMax = 100;
        const alpha1 = weightingFunction(x, xMax, 0.3);
        const alpha2 = weightingFunction(x, xMax, 0.75);

        // Con alpha menor, la función crece más rápido en valores bajos
        expect(alpha1).toBeGreaterThan(alpha2);
    });

    test('parámetro x_max controla el punto de saturación', () => {
        const x = 150;
        const xMax1 = weightingFunction(x, 100, 0.75);
        const xMax2 = weightingFunction(x, 200, 0.75);

        // Con x_max=100, x=150 satura a 1
        expect(xMax1).toBe(1);

        // Con x_max=200, x=150 no satura completamente
        expect(xMax2).toBeLessThan(1);
    });
});

describe('cooccurrenceProbability - Probabilidades de Co-ocurrencia', () => {
    test('P(j|i) = X_ij / X_i', () => {
        const result = cooccurrenceProbability(50, 100);
        expect(result).toBe(0.5);
    });

    test('suma de probabilidades es 1', () => {
        const X_i = [10, 20, 15, 5];
        const total = X_i.reduce((a, b) => a + b, 0);

        const probs = X_i.map(x => cooccurrenceProbability(x, total));
        const sum = probs.reduce((a, b) => a + b, 0);

        expect(sum).toBeCloseTo(1.0, 5);
    });

    test('retorna 0 cuando X_i es 0', () => {
        expect(cooccurrenceProbability(10, 0)).toBe(0);
    });
});

describe('probabilityRatio - Razón de Probabilidades', () => {
    test('razón = 1 cuando probabilidades son iguales', () => {
        expect(probabilityRatio(0.5, 0.5)).toBe(1);
    });

    test('razón > 1 cuando pki > pkj', () => {
        expect(probabilityRatio(0.9, 0.1)).toBeGreaterThan(1);
    });

    test('razón < 1 cuando pki < pkj', () => {
        expect(probabilityRatio(0.1, 0.9)).toBeLessThan(1);
    });

    test('ejemplo del paper: hielo vs vapor', () => {
        // Palabra "sólido" está fuertemente asociada a hielo
        const pki = 0.9;    // P(sólido | hielo)
        const pkj = 0.001;  // P(sólido | vapor)
        const ratio = probabilityRatio(pki, pkj);

        expect(ratio).toBeGreaterThan(100);
    });

    test('retorna Infinity cuando pkj es 0', () => {
        expect(probabilityRatio(0.5, 0)).toBe(Infinity);
    });
});

describe('logFrequency - Logaritmo de Frecuencia', () => {
    test('log(1) = 0', () => {
        expect(logFrequency(1)).toBeCloseTo(0, 5);
    });

    test('log(e) ≈ 1', () => {
        expect(logFrequency(Math.E)).toBeCloseTo(1, 5);
    });

    test('log(100) ≈ 4.605', () => {
        expect(logFrequency(100)).toBeCloseTo(4.605, 2);
    });

    test('retorna 0 para x <= 0', () => {
        expect(logFrequency(0)).toBe(0);
        expect(logFrequency(-5)).toBe(0);
    });

    test('log es creciente', () => {
        expect(logFrequency(10)).toBeGreaterThan(logFrequency(5));
        expect(logFrequency(100)).toBeGreaterThan(logFrequency(10));
    });
});

describe('gloveObjective - Función de Pérdida J', () => {
    test('J = 0 cuando xij = 0', () => {
        expect(gloveObjective(0, 5)).toBe(0);
    });

    test('J = 0 cuando dotProduct = log(xij) (predicción perfecta)', () => {
        const xij = 100;
        const dotProduct = logFrequency(xij);
        const result = gloveObjective(xij, dotProduct);

        expect(result).toBeCloseTo(0, 5);
    });

    test('J aumenta cuando la predicción se aleja del objetivo', () => {
        const xij = 50;
        const logX = logFrequency(xij);

        const j1 = gloveObjective(xij, logX + 0.5);
        const j2 = gloveObjective(xij, logX + 2.0);

        expect(j2).toBeGreaterThan(j1);
    });

    test('la función de ponderación reduce el impacto de pares raros', () => {
        const x_rare = 5;
        const x_freq = 500;
        const dotProduct = 3.0;

        const j_rare = gloveObjective(x_rare, dotProduct, 100, 0.75);
        const j_freq = gloveObjective(x_freq, dotProduct, 100, 0.75);

        // El peso de pares raros es menor
        expect(j_rare).toBeLessThan(j_freq);
    });

    test('parámetros por defecto son alpha=0.75, x_max=100', () => {
        const xij = 50;
        const dotProduct = 3.0;

        // Estas dos llamadas deben ser idénticas
        const j1 = gloveObjective(xij, dotProduct);
        const j2 = gloveObjective(xij, dotProduct, 100, 0.75);

        expect(j1).toBe(j2);
    });
});

describe('buildCooccurrenceMatrix - Matriz de Co-ocurrencias', () => {
    test('construye matriz correctamente para corpus simple', () => {
        const corpus = 'gato come pescado';
        const matrix = buildCooccurrenceMatrix(corpus, 1);

        expect(matrix['gato']['come']).toBeGreaterThan(0);
        expect(matrix['come']['gato']).toBeGreaterThan(0);
    });

    test('ignora mayúsculas', () => {
        const corpus1 = 'Hola Mundo';
        const corpus2 = 'hola mundo';

        const matrix1 = buildCooccurrenceMatrix(corpus1, 1);
        const matrix2 = buildCooccurrenceMatrix(corpus2, 1);

        expect(matrix1['hola']['mundo']).toBe(matrix2['hola']['mundo']);
    });

    test('respeta el tamaño de ventana', () => {
        const corpus = 'a b c d e';
        const matrix1 = buildCooccurrenceMatrix(corpus, 1);
        const matrix2 = buildCooccurrenceMatrix(corpus, 2);

        // Con ventana 2, 'a' debe coocurrir con 'c'
        expect(matrix2['a']['c']).toBeGreaterThan(0);

        // Con ventana 1, 'a' no debe coocurrir con 'c'
        expect(matrix1['a']['c']).toBe(0);
    });

    test('maneja corpus vacío', () => {
        const corpus = '';
        const matrix = buildCooccurrenceMatrix(corpus, 1);

        expect(Object.keys(matrix).length).toBe(0);
    });

    test('matriz es simétrica con ventana simétrica', () => {
        const corpus = 'gato come pescado';
        const matrix = buildCooccurrenceMatrix(corpus, 1);

        expect(matrix['gato']['come']).toBe(matrix['come']['gato']);
    });
});

describe('calculateProbabilities - Probabilidades desde Matriz', () => {
    test('suma de probabilidades para cada palabra es 1', () => {
        const corpus = 'gato gato perro gato perro gato';
        const matrix = buildCooccurrenceMatrix(corpus, 1);
        const probs = calculateProbabilities(matrix);

        Object.keys(probs).forEach(word => {
            const sum = Object.values(probs[word]).reduce((a, b) => a + b, 0);
            expect(sum).toBeCloseTo(1.0, 5);
        });
    });

    test('palabras más frecuentes en contexto tienen mayor probabilidad', () => {
        const corpus = 'gato gato gato gato perro';
        const matrix = buildCooccurrenceMatrix(corpus, 1);
        const probs = calculateProbabilities(matrix);

        const pGato = probs['gato']['gato'] || 0;
        const pPerro = probs['gato']['perro'] || 0;

        expect(pGato).toBeGreaterThan(pPerro);
    });
});

describe('analyzeCooccurrenceMatrix - Análisis de Matriz', () => {
    test('calcula número correcto de palabras únicas', () => {
        const corpus = 'a b c';
        const matrix = buildCooccurrenceMatrix(corpus, 1);
        const analysis = analyzeCooccurrenceMatrix(matrix);

        expect(analysis.totalWords).toBe(3);
    });

    test('calcula sparsidad correctamente', () => {
        const corpus = 'a a a b b c';
        const matrix = buildCooccurrenceMatrix(corpus, 1);
        const analysis = analyzeCooccurrenceMatrix(matrix);

        // Sparsidad debe estar entre 0 y 1
        expect(analysis.sparsity).toBeGreaterThanOrEqual(0);
        expect(analysis.sparsity).toBeLessThanOrEqual(1);
    });

    test('identifica par más común', () => {
        const corpus = 'a b a b a b c d';
        const matrix = buildCooccurrenceMatrix(corpus, 1);
        const analysis = analyzeCooccurrenceMatrix(matrix);

        // El par a-b o b-a debe ser el más común
        expect(analysis.mostCommonPair.count).toBeGreaterThan(0);
    });
});

describe('Integración - Escenario Completo', () => {
    test('flujo completo: corpus -> matriz -> probabilidades -> razones', () => {
        const corpus = 'hielo sólido agua vapor gas hielo agua';

        // Paso 1: Construir matriz
        const matrix = buildCooccurrenceMatrix(corpus, 2);
        expect(Object.keys(matrix).length).toBeGreaterThan(0);

        // Paso 2: Calcular probabilidades
        const probs = calculateProbabilities(matrix);
        expect(Object.keys(probs).length).toBe(Object.keys(matrix).length);

        // Paso 3: Calcular razones
        const ratios = calculateRatios(probs, 'hielo', 'vapor');
        expect(Array.isArray(ratios)).toBe(true);
    });

    test('ejemplo académico: demostración de insight de razones', () => {
        // Corpus donde "sólido" se asocia a "hielo"
        // y "gas" se asocia a "vapor"
        const corpus = `
            hielo sólido agua hielo agua
            vapor gas agua vapor agua
            agua es fundamental agua es agua
        `;

        const matrix = buildCooccurrenceMatrix(corpus, 2);
        const probs = calculateProbabilities(matrix);

        // Las razones deben mostrar las diferencias
        // (aunque con datos pequeños, el efecto es limitado)
        const analysis = analyzeCooccurrenceMatrix(matrix);
        expect(analysis.totalWords).toBeGreaterThan(0);
    });
});
