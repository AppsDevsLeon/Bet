// /lib/marketMetrics.ts
import { BigNumber, ethers } from "ethers";
import { getMarketsContract } from "./oddsx";

export type PoolTokenInfo = {
  symbol: "USDT" | "USDC" | "WETH" | "WBTC";
  address: string;
  decimals: number; // para formatear
};

export type MarketMetrics = {
  outcomeCount: number;
  perToken: {
    [symbol: string]: {
      totalsByOutcome: string[]; // en unidades humanas (ej. "123.45")
      totalToken: string;        // suma por token
    };
  };
  totalsByOutcome: string[];      // suma cross-token por outcome
  grandTotal: string;             // suma total
};

function fmt(bn: BigNumber, decimals: number) {
  return ethers.utils.formatUnits(bn, decimals);
}

export async function fetchMarketMetrics(
  contractAddress: string,
  marketIdBytes32: string,
  tokens: PoolTokenInfo[]
): Promise<MarketMetrics> {
  const provider = (window as any).ethereum
    ? new ethers.providers.Web3Provider((window as any).ethereum)
    : new ethers.providers.JsonRpcProvider(); // fallback si defines RPC

  const contract = getMarketsContract(provider, contractAddress);
  const info = await contract.getMarketInfo(marketIdBytes32);
  const outcomeCount: number = Number(info[2]);

  // Inicializar acumuladores
  const perToken: MarketMetrics["perToken"] = {};
  const totalsByOutcomeBN: BigNumber[] = Array(outcomeCount).fill(ethers.constants.Zero);
  let grandBN = ethers.constants.Zero;

  // Por token y outcome, pedir getPool
  for (const tk of tokens) {
    const outTotalsBN: BigNumber[] = [];
    for (let i = 0; i < outcomeCount; i++) {
      const pool: BigNumber = await contract.getPool(marketIdBytes32, tk.address, i);
      outTotalsBN.push(pool);
      totalsByOutcomeBN[i] = totalsByOutcomeBN[i].add(pool);
      grandBN = grandBN.add(pool);
    }
    const tokenSumBN = outTotalsBN.reduce((a, b) => a.add(b), ethers.constants.Zero);

    perToken[tk.symbol] = {
      totalsByOutcome: outTotalsBN.map((bn) => fmt(bn, tk.decimals)),
      totalToken: fmt(tokenSumBN, tk.decimals),
    };
  }

  // Para los cross-token por outcome usamos DECIMALS 18 como texto (solo display);
  // si quieres una suma exacta multi-decimals, normaliza a 18 con factor por token.
  const totalsByOutcome = totalsByOutcomeBN.map((bn) => ethers.utils.formatUnits(bn, 18));
  const grandTotal = ethers.utils.formatUnits(grandBN, 18);

  return { outcomeCount, perToken, totalsByOutcome, grandTotal };
}
