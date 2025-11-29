
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
            priceData?.regularMarketPrice ??
            priceData?.postMarketPrice ??
            priceData?.preMarketPrice ??
            priceData?.currentPrice ??
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

    async getFundamentalsTable(symbol) {
        const fetchFundamentals = await this.fetchFundamentals(symbol);

        const result = await yahooFinance.quoteSummary(symbol, {
            modules:[
                "price",
                "summaryDetail",
                "defaultKeyStatistics",
                "quoteType",
                "summaryProfile",
                "financialData"
            ]
        });

        const priceData = result.price ?? {};
        const summary = result.summaryDetail ?? {};
        const stats = result.defaultKeyStatistics ?? {};
        const type = result.quoteType ?? {};
        const profile = result.summaryProfile ?? {};
        const fin = result.financialData ?? {};

        // const cotacao =
        //     priceData?.regularMarketPrice ??
        //     priceData?.postMarketPrice ??
        //     priceData?.preMarketPrice ??
        //     null;
        return {
            papel: symbol,
            tipo: type.quoteType ?? null,
            empresa: priceData.longName ?? priceData.shortName ?? null,
            setor: profile.sector ?? null,
            cotacao: fetchFundamentals.price,
            valorMercado: priceData.marketCap ?? null,

            // P/L
            pl: fetchFundamentals.pl ?? null,

            // P/VP
            pvp: fetchFundamentals.pvp ?? null,

            // // P/EBIT — não existe diretamente
            // pebit: null,

            // PSR
            psr: summary.priceToSalesTrailing12Months ?? null,

            // Dividend Yield
            dividendYield: fetchFundamentals.dividendYield ?? null,

            // EV/EBITDA
            evEbitda: stats.enterpriseToEbitda ?? null,

            // // EV/EBIT — não disponível
            // evEbit: null,

            // LPA
            lpa: fetchFundamentals.lpa ?? null,

            // VPA
            vpa: fetchFundamentals.vpa ?? null,

            // // ROIC — não existe
            // roic: null,

            // ROE
            roe: fin.returnOnEquity ?? null

            // // Liquidez Corrente — não existe
            // liquidezCorrente: null,
            //
            // // Div Br/ Patrim — não disponível
            // divBrPatrim: null
        };

    }
}

module.exports = yahoo;


