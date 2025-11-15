// Note: yahoo-finance2 v3 expõe uma classe; é necessário instanciar antes de usar
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

class yahoo {

    async fetchFundamentals(symbol) {
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: ["defaultKeyStatistics", "summaryDetail", "price"]
        });

        const stats = result.defaultKeyStatistics ?? {};
        const summary = result.summaryDetail ?? {};
        const priceData = result.price ?? {};


        const pl =
            summary?.trailingPE ??
            stats?.trailingPE ??
            null;

        const price =
            result.price?.regularMarketPrice ??
            result.price?.postMarketPrice ??
            result.price?.preMarketPrice ??
            result.price?.currentPrice ??
            null;

        const lpaCalculado = (pl && price) ? (price / pl) : null;

        return {
            pl,
            lpa: lpaCalculado,
            pvp: stats?.priceToBook ?? null,
            vpa: stats?.bookValue ?? null,
            dividendYield: summary?.dividendYield ?? null,
            price
        };
    }
}

module.exports = yahoo;


