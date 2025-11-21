export async function ensurePolygon(chainIdHex: string) {
  if (!(window as any).ethereum) {
    throw new Error("No wallet encontrada");
  }

  const eth = (window as any).ethereum;

  // Pídele a MetaMask que cambie a esa red
  await eth.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: chainIdHex }],
  });
}

/**
 * Llama 'approve' del ERC20 para permitir que tu contrato de apuestas
 * gaste los fondos del user.
 */
export async function approveSpend({
  tokenAddress,
  spenderAddress,
  amountWei,
}: {
  tokenAddress: string;
  spenderAddress: string; // tu smart contract de la casa / mercado
  amountWei: string;      // string en hex 0x..., cantidad en wei/6dec/18dec según token
}) {
  const eth = (window as any).ethereum;

  // ABI mínimo de ERC20 approve(spender, amount)
  const ERC20_APPROVE_IFACE = [
    "0x095ea7b3", // keccak("approve(address,uint256)") first 4 bytes
  ];

  // Tenemos que ABI-encode parámetros.
  // Para no depender de ethers.js aquí, te doy la idea:
  // Normalmente usarías ethers v6:
  // const iface = new ethers.Interface(["function approve(address,uint256)"]);
  // const data = iface.encodeFunctionData("approve", [spenderAddress, amountWei]);

  // Como aquí no importamos ethers directamente en el ejemplo,
  // asume que TÚ dentro de tu proyecto sí tienes ethers y harás eso.
  // Abajo en el botón yo te muestro la versión con ethers real.
}

/**
 * Ejecuta la apuesta en tu contrato de mercado (por ejemplo bet(marketId, outcomeId, amount)).
 * Igual: en la práctica usas ethers o viem.
 */
export async function placeBetTx({
  marketContract,
  abi,
  method,
  args,
  from,
}: {
  marketContract: string;
  abi: any[];
  method: string;
  args: any[];
  from: string;
}) {
  // Igual, con ethers/viem generas "data" y llamas eth_requestAccounts + eth_sendTransaction.
}
