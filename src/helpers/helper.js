// Função simples de SMA
function SMA(values, period) {
    return values.map((_, i) => {
        if (i < period - 1) return null;
        const subset = values.slice(i - period + 1, i + 1);
        return subset.reduce((a, b) => a + b, 0) / period;
    });
}

// Função (Média Exponencial)
function EMA(values, period) {
    const alpha = 2 / (period + 1);
    let ema = values[0];
    const result = [ema];

    for (let i = 1; i < values.length; i++) {
        ema = (values[i] * alpha) + (ema * (1 - alpha));
        result.push(ema);
    }

    return result;
}

module.exports = {
    SMA,
    EMA,
};