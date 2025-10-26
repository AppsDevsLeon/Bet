"use client";
import Image from "next/image";
import { useInPlay } from "@/hooks/useInPlay";
import { adaptMatchToCard } from "@/lib/adapters";

export default function SoccerLive() {
  const { data, loading, error } = useInPlay("soccer", 20000);

  if (loading) return <section className="top_matches"><p className="p-4">Cargando…</p></section>;
  if (error)   return <section className="top_matches"><p className="p-4">Error: {error}</p></section>;

  return (
    <section className="top_matches">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 gx-0 gx-sm-4">
            <div className="top_matches__main">
              <div className="row w-100 mb-4 mb-md-6">
                <div className="col-12">
                  <div className="top_matches__title d-flex align-items-center gap-2 mb-4 mb-md-6">
                    <Image src="/images/icon/live-match.png" width={32} height={32} alt="Icon" />
                    <h3>Live Matches</h3>
                  </div>

                  <div className="top_matches__content">
                    {data.map((raw: any) => {
                      const m = adaptMatchToCard(raw);
                      return (
                        <div className="top_matches__cmncard p2-bg p-4 rounded-3 mb-4" key={raw.fixture?.id}>
                          <div className="row gx-0 gy-xl-0 gy-7">
                            <div className="col-xl-5 col-xxl-4">
                              <div className="top_matches__clubname">
                                <div className="top_matches__cmncard-right d-flex align-items-start justify-content-between pb-4 mb-4 gap-4 ">
                                  <div className="d-flex align-items-center gap-1">
                                    <Image src="/images/icon/floorball.png" width={16} height={16} alt="Icon" />
                                    <span className="fs-eight cpoint">{m.title}</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-4 pe-xl-15 flex-nowrap flex-xl-wrap">
                                    <div className="d-flex align-items-center gap-1">
                                      <Image src="/images/icon/live.png" width={16} height={16} alt="Icon" />
                                      <Image src="/images/icon/play.png" width={16} height={16} alt="Icon" />
                                    </div>
                                    <span className="fs-eight cpoint">{m.timeLabel}</span>
                                  </div>
                                </div>

                                <div className="top_matches__cmncard-left d-flex align-items-center justify-content-between pe-xl-10">
                                  <div>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                      <Image src="/images/icon/cmn-footbal.png" width={24} height={24} alt="Icon" />
                                      <span className="fs-seven cpoint">{m.clubNameOne}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      <Image src="/images/icon/cmn-footbal.png" width={24} height={24} alt="Icon" />
                                      <span className="fs-seven cpoint">{m.clubNameTwo}</span>
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center gap-4 position-relative pe-xl-15">
                                    <div className="d-flex flex-column gap-1">
                                      <span className="top_matches__cmncard-countcercle rounded-17 fs-seven">{m.homeGoals}</span>
                                      <span className="top_matches__cmncard-countcercle rounded-17 fs-seven">{m.awayGoals}</span>
                                    </div>
                                    <span className="v-line lg d-none d-xl-block"></span>
                                    <div className="d-flex flex-column gap-5">
                                      <Image className="cpoint" src="/images/icon/line-chart.png" width={16} height={16} alt="Icon" />
                                      <Image className="cpoint" src="/images/icon/star2.png" width={16} height={16} alt="Icon" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tablas de mercados */}
                            <div className="col-xl-7 col-xxl-8">
                              <div className="top_matches__clubdata">
                                <div className="table-responsive maintaintwo">
                                  <table className="table mb-0 pb-0">
                                    <thead>
                                      <tr className="text-center">
                                        <th scope="col"><span className="fs-eight">1x2</span></th>
                                        <th scope="col"><span className="fs-eight">Double chance</span></th>
                                        <th scope="col"><span className="fs-eight">Total</span></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        {["x2","double","total"].map(key => (
                                          <td className="pt-4" key={key}>
                                            <div className="top_matches__innercount d-flex align-items-center gap-2">
                                              {(m.markets as any)[key].length
                                                ? (m.markets as any)[key].map((opt: any, i: number) => (
                                                    <div className="top_matches__innercount-item clickable-active py-1 px-7 rounded-3 n11-bg text-center" key={i}>
                                                      <span className="fs-seven d-block mb-2 text-nowrap">{opt.label}</span>
                                                      <span className="fw-bold d-block">{opt.price}</span>
                                                    </div>
                                                  ))
                                                : (<span className="fs-eight">—</span>)}
                                            </div>
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
