"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconX, IconArrowBadgeUpFilled, IconTrash, IconSettings } from "@tabler/icons-react";
import { Tab } from "@headlessui/react";
import CryptoSelectorWizard, { ChainConfig, Token, OnDonePayload } from "@/components/generic/CryptoSelectorModal";

/* ===== Redes/tokens permitidos ===== */
const CHAINS: ChainConfig[] = [
  {
    chainId: 1,
    name: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.ankr.com/eth"],
    blockExplorerUrls: ["https://etherscan.io"],
    tokens: [
      { symbol: "ETH", decimals: 18 },
      { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
      { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    ],
  },
  {
    chainId: 137,
    name: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    tokens: [
      { symbol: "MATIC", decimals: 18 },
      { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
      { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
    ],
  },
];

export default function FooterCard() {
  // expand/collapse
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleCard = useCallback(() => setIsCardExpanded((v) => !v), []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isCardExpanded) return;
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) setIsCardExpanded(false);
    };
    document.addEventListener("click", handleClickOutside, { passive: true });
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isCardExpanded]);

  // tabs
  const items = useMemo(() => ["Single", "Multiple", "System"], []);
  const [activeItem, setActiveItem] = useState(items[0]);
  const getItemStyle = useCallback((itemName: string) => ({
    backgroundColor: activeItem === itemName ? "#0F1B42" : "#0A1436",
    cursor: "pointer",
  }) as React.CSSProperties, [activeItem]);

  // estado que viene del wizard
  const [openWizard, setOpenWizard] = useState(false);
  const [selectedChain, setSelectedChain] = useState<ChainConfig | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [amount, setAmount] = useState<string>("");

  const canPlaceBet = useMemo(() => {
    if (!selectedToken || !amount) return false;
    const amt = Number(amount.replace(",", "."));
    const bal = Number(balance);
    return Number.isFinite(amt) && Number.isFinite(bal) && amt > 0 && bal >= amt;
  }, [selectedToken, amount, balance]);

  return (
    <>
      <div
        ref={containerRef}
        className={`fixed_footer p3-bg rounded-5 ${isCardExpanded ? "expandedtexta" : "expanded2"}`}
        aria-label="Betslip"
        role="region"
      >
        {/* Header */}
        <div className="fixed_footer__head py-3 px-4">
          <div className="d-flex justify-content-between">
            <div className="fixed_footer__head-betslip d-flex align-items-center gap-2">
              <span className="fw-bold">Betslip</span>
              <span className="fixed_footer__head-n1">1</span>
              <button onClick={toggleCard} className="footfixedbtn" type="button" aria-expanded={isCardExpanded} aria-label={isCardExpanded ? "Collapse betslip" : "Expand betslip"}>
                <IconArrowBadgeUpFilled className="ti ti-arrow-badge-down-filled n5-color fs-four fixediconstyle" />
              </button>
            </div>
            <div className="fixed_footer__head-quickbet d-flex align-items-center gap-1">
              <span className="fw-bold">Betslip Bet</span>
              <input type="checkbox" id="switch" aria-labelledby="quickbet-label" />
              <label id="quickbet-label" htmlFor="switch">Toggle</label>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="fixed_footer__content position-relative">
          <Tab.Group>
            <Tab.List className="tab-list">
              {items.map((item) => (
                <Tab className="tab-item" key={item} onClick={() => setActiveItem(item)} style={getItemStyle(item)}>
                  <span className="tab-trigger cpoint">{item}</span>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="tab-container n11-bg">
              {/* PANEL 1 */}
              <Tab.Panel className="">
                <div className="fixed_footer__content-live px-4 py-5 mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-content-center gap-1">
                      <Image src="/images/icon/sports-salzburg.png" width={20} height={20} alt="Icon" />
                      <span className="fs-seven cpoint">Salzburg</span>
                      <span className="fs-seven">vs.</span>
                      <span className="fs-seven cpoint">Union Berlin</span>
                    </div>
                    <span className="r1-color fs-seven">Live</span>
                    <IconX className="ti ti-x n4-color cpoint" aria-hidden="true" />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fixed_footer__content-scr py-1 px-2 fs-seven">3.80</span>
                    <div>
                      <span className="fs-seven d-block">over 132.5</span>
                      <span className="fs-nine d-block">Total (incl. overtime)</span>
                    </div>
                  </div>
                </div>

                {/* Wizard trigger */}
                <div className="px-4 mb-3 d-flex flex-wrap align-items-center gap-3">
                  <button type="button" className="cmn-btn px-3 py-2" onClick={() => setOpenWizard(true)}>
                    {selectedToken ? `Cambiar cripto/red` : "Elegir cripto y red"}
                  </button>

                  {selectedToken && (
                    <>
                      <span className="fs-eight"><b>{selectedToken.symbol}</b> • <i>{selectedChain?.name}</i></span>
                      <span className="fs-eight">Saldo: <b>{balance}</b> {selectedToken.symbol}</span>
                      {account && <span className="fs-eight text-truncate" title={account}>{account.slice(0,6)}...{account.slice(-4)}</span>}
                    </>
                  )}
                </div>

                {/* Form monto (editable) */}
                <div className="fixed_footer__content-formarea px-4">
                  <form onSubmit={(e) => e.preventDefault()} autoComplete="off" noValidate>
                    <div className="border-four d-flex align-items-center justify-content-between pe-2 rounded-3 mb-4">
                      <input
                        placeholder="Bet amount (en token seleccionado)"
                        className="place-style"
                        type="text"
                        inputMode="decimal"
                        pattern="^\\d+(?:[.,]\\d{0,18})?$"
                        aria-label="Bet amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.trim())}
                      />
                      <button className="cmn-btn p-1 fs-seven fw-normal" type="button" onClick={() => setAmount("100")} aria-label="Set max amount">Max</button>
                    </div>

                    <div className="fixed_footer__content-possible d-flex align-items-center justify-content-between gap-2 mb-7">
                      <span className="fs-seven">Possible win</span>
                      <span className="fs-seven fw-bold">$300</span>
                    </div>

                    <button
                      type="button"
                      className="cmn-btn px-5 py-3 w-100 mb-4"
                      disabled={!canPlaceBet}
                      aria-disabled={!canPlaceBet}
                      onClick={() => {
                        if (!canPlaceBet) return;
                        alert("Saldo verificado. Procede a tu contrato.");
                      }}
                    >
                      Place Bet
                    </button>

                    <button type="button" className="cmn-btn third-alt px-5 py-3 w-100 mb-6">Book</button>
                  </form>
                </div>

                <div className="fixed_footer__content-bottom d-flex align-items-center justify-content-between">
                  <div className="right-border d-flex align-items-center gap-2">
                    <IconTrash height={20} width={20} className="ti ti-trash n3-color fs-five cpoint" />
                    <Link href="#" className="n3-color fs-seven">Sign In &amp; Bet</Link>
                  </div>
                  <div className="right-border2 d-flex align-items-center justify-content-end gap-2">
                    <IconSettings height={20} width={20} className="ti ti-settings n3-color fs-five cpoint" />
                    <Link href="#" className="n3-color fs-seven">Settings</Link>
                  </div>
                </div>
              </Tab.Panel>

              {/* Paneles 2 y 3: tu UI original */}
              <Tab.Panel className="">{/* … */}</Tab.Panel>
              <Tab.Panel className="">{/* … */}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* Wizard con tipos estrictos en onDone */}
      <CryptoSelectorWizard
        open={openWizard}
        onClose={() => setOpenWizard(false)}
        chains={CHAINS}
        iconCatalogUrl={
          // tu JSON público de íconos:
          "https://tu-dominio.com/path/a/icons.json"
        }
        onDone={(payload: OnDonePayload) => {
          const { chain, token, account, balance, amount } = payload;
          setSelectedChain(chain);
          setSelectedToken(token);
          setAccount(account);
          setBalance(balance);
          setAmount(amount);
        }}
      />
    </>
  );
}
