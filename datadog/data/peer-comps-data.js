window.PEER_COMPS = {
  meta: {
    valuationDate: "2026-08-06",
    actualsThrough: "Datadog Q2 2026; peer actuals through the latest reported quarter",
    currency: "USD",
    reliability: "Screening-grade",
    historicalProvider: "Fiscal.ai via StockAnalysis",
    forwardProvider: "S&P Global MI via StockAnalysis",
    marketProvider: "StockAnalysis market snapshot",
  },
  buckets: {
    target: {label: "Datadog", shortLabel: "DDOG", color: "#7c6bf5"},
    direct: {label: "Direct observability", shortLabel: "Direct", color: "#33c6e6"},
    infrastructure: {label: "Consumption & infrastructure", shortLabel: "Infra", color: "#f5b13f"},
    adjacent: {label: "Platform adjacencies", shortLabel: "Adjacent", color: "#ff5c8a"},
  },
  methodology: {
    ntmGrowth: "Calendarized proxy: current-FY growth × months remaining / 12 + next-FY growth × the balance of 12 months / 12.",
    standardizedFcf: "Cash from operations less purchases of property and equipment and capitalized software or intangibles.",
    gaapRule40: "LTM revenue growth plus GAAP operating margin; stock-based compensation remains in operating expenses.",
    fcfRule40: "LTM revenue growth plus standardized LTM FCF margin.",
    sbcAdjustedRule40: "Analyst-adjusted sensitivity: LTM revenue growth plus (standardized FCF less SBC) / revenue; equivalently FCF Rule of 40 less SBC / revenue. This is not a standardized industry KPI.",
    enterpriseValue: "Market capitalization plus debt less cash and short-term investments.",
    valuation: "EV / LTM revenue uses reported trailing revenue. EV / NTM revenue uses the calendarized revenue-growth proxy; Equity / NTM FCF holds the latest standardized FCF margin constant.",
    gross_profit_multiple: "EV / NTM gross profit uses the NTM revenue proxy multiplied by the latest LTM gross margin; it is a margin-normalized proxy, not consensus gross profit.",
    cash_yields: "NTM FCF yield holds the latest standardized FCF margin constant. Owner FCF yield additionally subtracts SBC / revenue and is an analyst-adjusted sensitivity.",
    dilution: "Latest LTM basic weighted-average shares divided by the prior-year LTM basic weighted-average shares, less one.",
  },
  primaryCrosscheck: "https://investors.datadoghq.com/news-releases/news-release-details/datadog-announces-second-quarter-2026-financial-results",
  companies: [
    ["DDOG","Datadog","target","2026-06-30",229.29,81620000000,4985438000,985545000,3966725000,3016056000,3154033000,16329000,1182108000,109340000,823036000,356253000,346185000,.3047,.2136,5,4470000000,5430000000,"2026-08-07"],
    ["DT","Dynatrace","direct","2026-03-31",48.87,14355269280,1172101000,164324000,2018387000,1698683000,1646183000,245387000,529677000,194000,299626000,297544000,299441000,.1539,.1462,8,2330000000,2670000000,"2026-07-28"],
    ["ESTC","Elastic","direct","2026-04-30",69.95,7428386837,1372035000,591563000,1739331000,1483296000,1323059000,-33476000,321802000,0,298435000,104256173,105084869,.147,.1445,9,1990000000,2280000000,"2026-07-22"],
    ["NET","Cloudflare","infrastructure","2026-03-31",284.43,100783219620,4163878000,3524536000,2328605000,1770111000,1707498000,-215952000,320701000,28932000,470160000,352625000,345723000,.2974,.2764,5,2810000000,3590000000,"2026-07-29"],
    ["MDB","MongoDB","infrastructure","2026-04-30",370.00,30185113190,2427153000,30427000,2602399000,2104896000,1872941000,-108218000,591182000,0,555853000,80357498,81060822,.2019,.1764,6,2960000000,3480000000,"2026-07-27"],
    ["SNOW","Snowflake","infrastructure","2026-04-30",318.00,109834338000,2954998000,2772095000,5032823000,3839761000,3379304000,-1314062000,1169702000,3101000,1622557000,345391000,332657000,.3024,.2535,6,6100000000,7650000000,"2026-07-22"],
    ["CRWD","CrowdStrike","adjacent","2026-04-30",207.39,53481940590,4552801000,821343000,5094200000,4136022000,3817922000,-219922000,1505198000,73885000,1146721000,1014928000,993728000,.2355,.217,6,5950000000,7240000000,"2026-07-27"],
    ["ZS","Zscaler","adjacent","2026-04-30",162.60,26136486600,3539107000,1861184000,3173564000,2546757000,2432659000,-150017000,963460000,73160000,782986000,160741000,154909000,.2464,.1702,0,3330000000,3900000000,"2026-07-28"],
    ["GTLB","GitLab","adjacent","2026-04-30",35.68,6063744640,1357512000,0,1004873000,804571000,871677000,-51620000,263443000,0,209185000,169948000,164491000,.1692,.1559,6,1120000000,1290000000,"2026-07-22"],
  ],
  fields: [
    "ticker","name","bucket","latestQuarter","price","marketCap","cash","debt","ltmRevenue","ltmPriorRevenue","ltmGrossProfit","ltmOperatingIncome","ltmCfoLessCapex","ltmCapitalizedSoftware","ltmSbc","latestBasicShares","priorBasicShares","currentFyGrowth","nextFyGrowth","monthsCurrentFy","currentFyRevenue","nextFyRevenue","forwardUpdated"
  ],
  sourceFor(ticker, statement = "overview") {
    const symbol = ticker.toLowerCase();
    if(statement === "overview") return `https://stockanalysis.com/stocks/${symbol}/`;
    if(statement === "forecast") return `https://stockanalysis.com/stocks/${symbol}/forecast/`;
    const page = statement === "cash-flow" ? "cash-flow-statement" : statement === "balance-sheet" ? "balance-sheet" : "income-statement";
    return `https://stockanalysis.com/stocks/${symbol}/financials/${page}/?p=quarterly`;
  },
};
