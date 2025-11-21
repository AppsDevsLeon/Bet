// /lib/solana.ts
// Nota: usamos imports dinámicos para evitar problemas de SSR en Next.js.

export type Cluster = "mainnet-beta" | "devnet" | "testnet";

/** Conecta Phantom y devuelve su objeto + publicKey */
export async function connectPhantom() {
  const w = window as any;
  const solana = w?.solana;
  if (!solana || !solana.isPhantom) {
    throw new Error("Phantom no detectado. Instálalo para operar con SOL.");
  }
  const resp = await solana.connect(); // puede abrir el popup
  return { solana, publicKey: resp.publicKey as { toBase58: () => string } };
}

/** Connection al cluster indicado (por defecto mainnet-beta) */
export async function getConnection(cluster: Cluster = "mainnet-beta") {
  const web3 = await import("@solana/web3.js");
  return new web3.Connection(web3.clusterApiUrl(cluster), "confirmed");
}

/** Constante LAMPORTS_PER_SOL (expuesta para cálculos) */
export async function lamportsPerSol(): Promise<number> {
  const web3 = await import("@solana/web3.js");
  return web3.LAMPORTS_PER_SOL;
}

/**
 * Envía SOL a una tesorería con un memo (para identificar market/outcome/stake).
 * Devuelve la firma/txId.
 */
export async function sendSolWithMemo(params: {
  toBase58: string;
  amountSol: number; // en SOL
  memo?: string;
  cluster?: Cluster;
}) {
  const { toBase58, amountSol, memo = "", cluster = "mainnet-beta" } = params;

  const web3 = await import("@solana/web3.js");
  const { solana, publicKey } = await connectPhantom();
  const connection = await getConnection(cluster);

  const to = new web3.PublicKey(toBase58);
  const LPS = web3.LAMPORTS_PER_SOL;
  if (!(amountSol > 0)) throw new Error("Monto SOL inválido");

  const ixTransfer = web3.SystemProgram.transfer({
    fromPubkey: publicKey,
    toPubkey: to,
    lamports: Math.floor(amountSol * LPS),
  });

  const memoIx =
    memo && memo.length
      ? new web3.TransactionInstruction({
          keys: [],
          programId: new web3.PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
          data: Buffer.from(memo, "utf8"),
        })
      : undefined;

  const tx = new web3.Transaction().add(ixTransfer, ...(memoIx ? [memoIx] : []));
  tx.feePayer = publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signed = await solana.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(sig, "confirmed");

  return sig as string;
}
