// Note: yahoo-finance2 v3 expõe uma classe; é necessário instanciar antes de usar
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

class yahoo {

    async  fetchFundamentals(symbol){
        if (!symbol) {
            throw new Error("Parâmetro 'symbol' é obrigatório");
        }
        const result = await yahooFinance.quoteSummary(symbol, {
            modules: [
                "defaultKeyStatistics",
                "financialData",
                "summaryDetail",
                //"earnings"
            ]
        });

        const stats = result.defaultKeyStatistics ?? {};
        const fin = result.financialData ?? {};
        const summary = result.summaryDetail ?? {};
        //const earnings = result.earnings ?? {};

        // SEGUNDA CHAMADA → earnings (LPA real)
        let earningsData = {};
        try {
            earningsData = await yahooFinance.earnings(symbol);
        } catch (e) {
            earningsData = {};
        }

        const epsFromEarnings =
            earningsData?.financialsChart?.yearly?.[0]?.earnings ?? null;

        // ------------------------------
        // CALCULAR LPA MANUALMENTE
        // ------------------------------

        const lucroLiquido =
            fin.netIncomeToCommon ??
            (fin.revenue && fin.profitMargins
                ? fin.revenue * fin.profitMargins
                : null);

        const numeroAcoes = stats.sharesOutstanding ?? null;

        const lpaCalculado =
            lucroLiquido && numeroAcoes
                ? lucroLiquido / numeroAcoes
                : null;

        // ------------------------------
        // RETORNO FINAL
        // ------------------------------
        return {
            pl:
                summary?.trailingPE ??
                summary?.forwardPE ??
                summary?.peRatio ??
                stats?.trailingPE ??
                stats?.forwardPE ??
                null,

            pvp: stats?.priceToBook ?? null,

            lpa:
                stats?.epsTrailingTwelveMonths ??
                stats?.epsForward ??
                fin?.earningsPerShare ??
                epsFromEarnings ??
                lpaCalculado ??      // <—— AGORA TEMOS LPA PARA A B3
                null,

            vpa: stats?.bookValue ?? null,

            dividendYield:
                summary?.dividendYield ??
                fin?.dividendYield ??
                null
        };
    }
}

module.exports = yahoo;


