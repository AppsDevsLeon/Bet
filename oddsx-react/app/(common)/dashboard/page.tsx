import React from 'react'
import Dashboard from '@/components/Pages/Dashboard/Dashboard'
import HeaderTwo from '@/components/Shared/HeaderTwo'
import WalletSummary from "@/components//Pages/Dashboard/WalletSummary";

export default function page() {
  return (
      <>   
          <HeaderTwo />
          <WalletSummary />
          <Dashboard />
          
      </>
  )
}
