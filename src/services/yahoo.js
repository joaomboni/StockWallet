// Note: In CommonJS, yahoo-finance2 exposes its functions on the default export
const yahooFinance = require("yahoo-finance2").default;

class yahoo {

    async  fetchFundamentals(symbol){
        if (!symbol) {
            throw new Error("Parâmetro 'symbol' é obrigatório");
        }
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: [
                "defaultKeyStatistics",
                "financialData",
                "summaryDetail"
            ]
        });

        const stats = result.defaultKeyStatistics;
        const fin = result.financialData;
        const summary = result.summaryDetail;

        return {
            pl: stats?.trailingPE ?? null,
            pvp: stats?.priceToBook ?? null,
            lpa: stats?.earningsPerShare ?? null,
            vpa: stats?.bookValue ?? null,
            dividendYield: summary?.dividendYield ?? fin?.dividendYield ?? null
        };
    }
}

module.exports = yahoo;