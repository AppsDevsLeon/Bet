// /lib/evm.ts
import { ethers } from "ethers";

/* =========================
   Chain / Provider / Signer
========================= */

/** ChainId Polygon Mainnet en hex */
export const CHAIN_ID_HEX = "0x89";

/** Asegura que la wallet esté en la chain especificada (por defecto Polygon) */
export async function ensureChain(
  ethereum: any,
  chainIdHex: string = CHAIN_ID_HEX
) {
  if (!ethereum) throw new Error("No ethereum provider (MetaMask) detectado.");
  await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: chainIdHex }],
  });
}

/** Crea Web3Provider (ethers v5) desde window.ethereum */
export function getWeb3Provider(ethereum: any) {
  if (!ethereum) throw new Error("No ethereum provider.");
  return new ethers.providers.Web3Provider(ethereum);
}

/** Pide cuentas y devuelve signer actual */
export async function getSigner(provider: ethers.providers.Web3Provider) {
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

/* =========================
   Identificadores / Utils
========================= */

/** Hash estable (bytes32) para tu marketId a partir de un slug/string */
export function marketIdHash(input: string): string {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input || ""));
}

/** Parsear "10.5" → unidades del token con N decimales */
export function parseAmount(amountStr: string, decimals: number) {
  const n = (amountStr || "").trim();
  if (!n) throw new Error("Monto vacío");
  return ethers.utils.parseUnits(n, decimals);
}

/** Formatear BigNumber → string humana con N decimales */
export function formatAmount(bn: ethers.BigNumber, decimals: number) {
  return ethers.utils.formatUnits(bn, decimals);
}

/** Suma de BigNumbers (mismo tipo) */
export function sumBNs(list: ethers.BigNumber[]) {
  return list.reduce((acc, x) => acc.add(x), ethers.constants.Zero);
}

export const bnZero = ethers.constants.Zero;

/* =========================
   Tokens (Polygon Mainnet)
========================= */
/**
 * Direcciones comunes en Polygon mainnet:
 * - USDT (6 dec):  0xC2132D05D31c914a87C6611C10748AEb04B58e8F
 * - USDC.e (6 dec):0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
 * - WETH (18 dec): 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619
 * - WBTC (8 dec):  0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6
 * Si usas USDC “nativo”, cambia la address por la tuya.
 */
export const TOKENS = {
  USDT: { symbol: "USDT", address: "0xC2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
  USDC: { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
  WETH: { symbol: "WETH", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
  WBTC: { symbol: "WBTC", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", decimals: 8 },
} as const;

export type TokenKey = keyof typeof TOKENS;

/* =========================
   ABIs mínimos
========================= */

export const ERC20_MIN_ABI = [
  "function decimals() external view returns (uint8)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
];

/** ABI para tu contrato de mercados (métodos usados por el front) */
export const MARKETS_ABI = [
  // Compras
  "function buyOutcome(bytes32 marketId, address token, uint8 outcome, uint256 amount) external",
  // Compat (si mantuviste el alias)
  "function placeBet(bytes32 marketId, address token, uint8 outcome, uint256 amount) external",

  // Claims
  "function claim(bytes32 marketId, address token) external",

  // Vistas de totales
  "function getOutcomeTotals(bytes32 marketId, address token) external view returns (uint256[] memory)",
  "function getUserOutcomeTotals(bytes32 marketId, address user, address token) external view returns (uint256[] memory)",
  "function getMarketVolumeByToken(bytes32 marketId, address token) external view returns (uint256)",

  // (Opcional) Estado basado en schedule
  "function getComputedStatus(bytes32 marketId) external view returns (uint8)",
  "function getMarketSchedule(bytes32 marketId) external view returns (uint64 startTs, uint64 endTs)",
];

/* =========================
   Factories de contratos
========================= */

export function getErc20(
  tokenAddress: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) {
  return new ethers.Contract(tokenAddress, ERC20_MIN_ABI, signerOrProvider);
}

export function getContract<T = ethers.Contract>(
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.providers.Provider
): T {
  // @ts-ignore
  return new ethers.Contract(address, abi, signerOrProvider);
}

/* =========================
   OddsX SDK helpers (front)
========================= */

/** Asegura allowance suficiente; si falta, hace approve(amount) */
export async function ensureAllowanceAndApprove(
  tokenAddress: string,
  owner: string,
  spender: string,
  needed: ethers.BigNumber,
  signer: ethers.Signer
) {
  const erc20 = getErc20(tokenAddress, signer);
  const allowance: ethers.BigNumber = await erc20.allowance(owner, spender);
  if (allowance.gte(needed)) return;
  const tx = await erc20.approve(spender, needed);
  await tx.wait();
}

/** Flujo completo de compra: approve (si hace falta) + buyOutcome */
export async function buyOutcomeTx(
  ethereum: any,
  marketsAddress: string,
  marketSlugOrId: string, // el slug que usas en MARKETS.id
  tokenKey: TokenKey,      // "USDT"|"USDC"|"WETH"|"WBTC"
  outcomeIndex: number,
  amountStr: string        // "25.5" etc
) {
  await ensureChain(ethereum, CHAIN_ID_HEX);
  const provider = getWeb3Provider(ethereum);
  const signer = await getSigner(provider);

  const user = await signer.getAddress();
  const { address: tokenAddress, decimals } = TOKENS[tokenKey];

  const amount = parseAmount(amountStr, decimals);
  if (amount.lte(0)) throw new Error("Monto inválido");

  await ensureAllowanceAndApprove(tokenAddress, user, marketsAddress, amount, signer);

  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, signer);
  const tx = await markets.buyOutcome(marketId, tokenAddress, outcomeIndex, amount);
  return tx.wait();
}

/** Reclamar pagos (tras resolución) para un token concreto */
export async function claimTx(
  ethereum: any,
  marketsAddress: string,
  marketSlugOrId: string,
  tokenKey: TokenKey
) {
  await ensureChain(ethereum, CHAIN_ID_HEX);
  const provider = getWeb3Provider(ethereum);
  const signer = await getSigner(provider);

  const { address: tokenAddress } = TOKENS[tokenKey];
  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, signer);
  const tx = await markets.claim(marketId, tokenAddress);
  return tx.wait();
}

/** Lee acumulados por outcome para un token (array de BN) */
export async function readOutcomeTotalsBN(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string,
  tokenKey: TokenKey
): Promise<ethers.BigNumber[]> {
  const { address: tokenAddress } = TOKENS[tokenKey];
  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, providerOrSigner);
  const arr: ethers.BigNumber[] = await markets.getOutcomeTotals(marketId, tokenAddress);
  return arr;
}

/** Igual que arriba pero formateado a string humano */
export async function readOutcomeTotals(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string,
  tokenKey: TokenKey
): Promise<string[]> {
  const { decimals } = TOKENS[tokenKey];
  const arr = await readOutcomeTotalsBN(providerOrSigner, marketsAddress, marketSlugOrId, tokenKey);
  return arr.map((bn) => formatAmount(bn, decimals));
}

/** Posición del usuario por outcome (BN) */
export async function readUserOutcomeTotalsBN(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string,
  user: string,
  tokenKey: TokenKey
): Promise<ethers.BigNumber[]> {
  const { address: tokenAddress } = TOKENS[tokenKey];
  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, providerOrSigner);
  const arr: ethers.BigNumber[] = await markets.getUserOutcomeTotals(marketId, user, tokenAddress);
  return arr;
}

/** Volumen del market para un token (BN / string) */
export async function readMarketVolumeByTokenBN(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string,
  tokenKey: TokenKey
) {
  const { address: tokenAddress } = TOKENS[tokenKey];
  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, providerOrSigner);
  const v: ethers.BigNumber = await markets.getMarketVolumeByToken(marketId, tokenAddress);
  return v;
}

export async function readMarketVolumeByToken(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string,
  tokenKey: TokenKey
) {
  const { decimals } = TOKENS[tokenKey];
  const v = await readMarketVolumeByTokenBN(providerOrSigner, marketsAddress, marketSlugOrId, tokenKey);
  return formatAmount(v, decimals);
}

/** (Opcional) Estado del mercado calculado on-chain (0:upcoming,1:live,2:ended,3:resolved) */
export async function readComputedStatus(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string
) {
  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, providerOrSigner);
  const code: number = await markets.getComputedStatus(marketId);
  return code; // mapea en UI a "upcoming/live/ended/resolved"
}

/** (Opcional) Schedule del mercado */
export async function readMarketSchedule(
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
  marketsAddress: string,
  marketSlugOrId: string
) {
  const marketId = marketIdHash(marketSlugOrId);
  const markets = getContract(marketsAddress, MARKETS_ABI, providerOrSigner);
  const [startTs, endTs]: [number, number] = await markets.getMarketSchedule(marketId);
  return { startTs, endTs };
}
