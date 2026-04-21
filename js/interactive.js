// ========================================
// LÓGICA INTERACTIVA DE PRÁCTICAS
// ========================================

// =================================
// PRÁCTICA 1: Función de Ponderación
// =================================

const alphaSlider = document.getElementById('alpha');
const xmaxSlider = document.getElementById('xmax');
const alphaValue = document.getElementById('alphaValue');
const xmaxValue = document.getElementById('xmaxValue');
const weightingCanvas = document.getElementById('weightingCanvas');

function updateWeightingChart() {
    const alpha = parseFloat(alphaSlider.value);
    const xMax = parseFloat(xmaxSlider.value);

    alphaValue.textContent = alpha.toFixed(2);
    xmaxValue.textContent = Math.round(xMax);

    drawWeightingFunction(alpha, xMax);
}

function drawWeightingFunction(alpha, xMax) {
    const ctx = weightingCanvas.getContext('2d');
    const width = weightingCanvas.width;
    const height = weightingCanvas.height;
    const padding = 40;

    // Limpiar canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Dibujar ejes
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;

    // Eje X
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Etiquetas de ejes
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x (Frecuencia)', width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('f(x) (Peso)', 0, 0);
    ctx.restore();

    // Escala
    const maxX = 250;
    const scaleX = (width - 2 * padding) / maxX;
    const scaleY = (height - 2 * padding);

    // Dibujar grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= maxX; x += 50) {
        const screenX = padding + x * scaleX;
        ctx.beginPath();
        ctx.moveTo(screenX, padding);
        ctx.lineTo(screenX, height - padding);
        ctx.stroke();
    }

    for (let y = 0; y <= 1; y += 0.2) {
        const screenY = height - padding - y * scaleY;
        ctx.beginPath();
        ctx.moveTo(padding, screenY);
        ctx.lineTo(width - padding, screenY);
        ctx.stroke();
    }

    // Dibujar etiquetas de escala X
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    for (let x = 0; x <= maxX; x += 50) {
        const screenX = padding + x * scaleX;
        ctx.textAlign = 'center';
        ctx.fillText(x, screenX, height - padding + 15);
    }

    // Dibujar etiquetas de escala Y
    ctx.textAlign = 'right';
    for (let y = 0; y <= 1; y += 0.2) {
        const screenY = height - padding - y * scaleY;
        ctx.fillText(y.toFixed(1), padding - 10, screenY + 4);
    }

    // Dibujar línea vertical en x_max
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const xMaxScreen = padding + xMax * scaleX;
    ctx.beginPath();
    ctx.moveTo(xMaxScreen, padding);
    ctx.lineTo(xMaxScreen, height - padding);
    ctx.stroke();

    // Etiqueta x_max
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x_max=' + Math.round(xMax), xMaxScreen, padding - 10);

    ctx.setLineDash([]);

    // Dibujar función
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let x = 0; x <= maxX; x += 1) {
        const weight = weightingFunction(x, xMax, alpha);
        const screenX = padding + x * scaleX;
        const screenY = height - padding - weight * scaleY;

        if (first) {
            ctx.moveTo(screenX, screenY);
            first = false;
        } else {
            ctx.lineTo(screenX, screenY);
        }
    }

    ctx.stroke();

    // Leyenda
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`f(x) con α=${alpha.toFixed(2)}, x_max=${Math.round(xMax)}`, padding + 10, padding + 20);
}

// Event listeners para Práctica 1
alphaSlider.addEventListener('input', updateWeightingChart);
xmaxSlider.addEventListener('input', updateWeightingChart);

// Inicializar gráfico
updateWeightingChart();

// =================================
// PRÁCTICA 2: Matriz de Co-ocurrencias
// =================================

function calculateCooccurrence() {
    const corpus = document.getElementById('corpusInput').value;

    if (corpus.trim().length === 0) {
        alert('Por favor ingresa un corpus de texto');
        return;
    }

    const matrix = buildCooccurrenceMatrix(corpus);
    const probabilities = calculateProbabilities(matrix);
    const analysis = analyzeCooccurrenceMatrix(matrix);

    // Mostrar resultado
    const resultDiv = document.getElementById('cooccurrenceResult');
    resultDiv.style.display = 'block';

    // Generar tabla
    const tableDiv = document.getElementById('cooccurrenceTable');
    const words = Object.keys(matrix).slice(0, 10); // Limitar a 10 palabras

    let html = '<table><tr><th>Palabra</th>';
    words.forEach(w => {
        html += `<th>${w}</th>`;
    });
    html += '</tr>';

    words.forEach(word1 => {
        html += `<tr><td><strong>${word1}</strong></td>`;
        words.forEach(word2 => {
            const count = matrix[word1][word2] || 0;
            html += `<td>${count}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    tableDiv.innerHTML = html;

    // Análisis
    const analysisDiv = document.getElementById('cooccurrenceAnalysis');
    analysisDiv.innerHTML = `
        <p><strong>Palabras únicas:</strong> ${analysis.totalWords}</p>
        <p><strong>Total de co-ocurrencias:</strong> ${analysis.totalPairs}</p>
        <p><strong>Co-ocurrencia promedio:</strong> ${analysis.averageCooccurrence.toFixed(3)}</p>
        <p><strong>Máxima co-ocurrencia:</strong> ${analysis.mostCommonPair.word1} & ${analysis.mostCommonPair.word2} = ${analysis.mostCommonPair.count}</p>
        <p><strong>Sparsidad:</strong> ${(analysis.sparsity * 100).toFixed(1)}% (cuántas celdas son 0)</p>
    `;
}

// =================================
// PRÁCTICA 3: Razones de Probabilidades
// =================================

function calculateRatios() {
    const corpus = document.getElementById('corpusInput').value;

    if (corpus.trim().length === 0) {
        alert('Por favor ingresa un corpus de texto');
        return;
    }

    const word_i = document.getElementById('word_i').value.toLowerCase();
    const word_j = document.getElementById('word_j').value.toLowerCase();

    if (!word_i || !word_j) {
        alert('Por favor ingresa ambas palabras');
        return;
    }

    const matrix = buildCooccurrenceMatrix(corpus);
    const probabilities = calculateProbabilities(matrix);

    if (!probabilities[word_i] || !probabilities[word_j]) {
        alert(`Una de las palabras no aparece en el corpus. Palabras disponibles: ${Object.keys(matrix).join(', ')}`);
        return;
    }

    const ratios = calculateRatios(probabilities, word_i, word_j).slice(0, 10);

    const resultDiv = document.getElementById('ratiosResult');
    resultDiv.style.display = 'block';

    const table = document.getElementById('ratiosTable');
    let html = `<tr>
        <th>Palabra k</th>
        <th>P(k | ${word_i})</th>
        <th>P(k | ${word_j})</th>
        <th>Razón</th>
        <th>Tipo de Relación</th>
    </tr>`;

    ratios.forEach(r => {
        html += `<tr>
            <td>${r.word}</td>
            <td>${r.pki.toFixed(3)}</td>
            <td>${r.pkj.toFixed(3)}</td>
            <td><strong>${r.ratio}</strong></td>
            <td>${r.type}</td>
        </tr>`;
    });

    table.innerHTML = html;
}

// =================================
// PRÁCTICA 4: Función Objetivo
// =================================

const xijSlider = document.getElementById('x_ij');
const dotProductSlider = document.getElementById('dot_product');
const xijValue = document.getElementById('x_ijValue');
const dotProductValue = document.getElementById('dotProductValue');

function updateLossDisplay() {
    xijValue.textContent = Math.round(xijSlider.value);
    dotProductValue.textContent = parseFloat(dotProductSlider.value).toFixed(1);
}

function calculateLoss() {
    const xij = parseFloat(xijSlider.value);
    const dotProduct = parseFloat(dotProductSlider.value);
    const xMax = 100;
    const alpha = 0.75;

    const loss = gloveObjective(xij, dotProduct, xMax, alpha);
    const f = weightingFunction(xij, xMax, alpha);
    const logX = logFrequency(xij);
    const difference = dotProduct - logX;

    const resultDiv = document.getElementById('lossResult');
    resultDiv.style.display = 'block';

    const lossValue = document.getElementById('lossValue');
    lossValue.textContent = loss.toFixed(4);

    const explanation = document.getElementById('lossExplanation');
    explanation.innerHTML = `
        <p><strong>Fórmula:</strong> J = f(X_ij) · (w_i·w̃_j + sesgo − log X_ij)²</p>
        <p><strong>f(${Math.round(xij)}):</strong> ${f.toFixed(4)} (función de ponderación)</p>
        <p><strong>log(${Math.round(xij)}):</strong> ${logX.toFixed(4)}</p>
        <p><strong>Diferencia:</strong> ${dotProduct.toFixed(1)} − ${logX.toFixed(4)} = ${difference.toFixed(4)}</p>
        <p><strong>Pérdida:</strong> ${f.toFixed(4)} × (${difference.toFixed(4)})² = <strong>${loss.toFixed(4)}</strong></p>
        <hr>
        <p><strong>Interpretación:</strong> ${getInterpretation(loss, difference, f)}</p>
    `;
}

function getInterpretation(loss, difference, f) {
    if (loss < 0.01) {
        return "✅ Muy bueno - El vector predice bien la frecuencia de co-ocurrencia";
    } else if (loss < 0.1) {
        return "✓ Bien - El vector tiene una predicción razonable";
    } else if (loss < 1) {
        return "⚠️ Regular - Hay margen para mejorar la predicción";
    } else {
        return "❌ Pobre - El vector predice mal la frecuencia";
    }
}

// Event listeners para Práctica 4
xijSlider.addEventListener('input', updateLossDisplay);
dotProductSlider.addEventListener('input', updateLossDisplay);

// Inicializar
updateLossDisplay();

// =================================
// UTILIDADES
// =================================

// Hacer funciones globales para botones
window.calculateCooccurrence = calculateCooccurrence;
window.calculateRatios = calculateRatios;
window.calculateLoss = calculateLoss;
