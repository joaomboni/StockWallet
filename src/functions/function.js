// Função simples de SMA
function SMA(values, period) {
    return values.map((_, i) => {
        if (i < period - 1) return null;
        const subset = values.slice(i - period + 1, i + 1);
        return subset.reduce((a, b) => a + b, 0) / period;
    });
}

module.exports = {
    SMA,
};