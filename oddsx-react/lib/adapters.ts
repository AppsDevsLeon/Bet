export function adaptMatchToCard(m: any) {
  const leagueTitle =
    (m.league?.country ? m.league.country + " · " : "") + (m.league?.name ?? "League");

  const home = m.teams?.home?.name ?? "Home";
  const away = m.teams?.away?.name ?? "Away";
  const homeGoals = m.teams?.home?.goals ?? 0;
  const awayGoals = m.teams?.away?.goals ?? 0;

  const m1x2 = m.odds?.find((o: any) => /1x2|winner/i.test(o.name));
  const mDouble = m.odds?.find((o: any) => /double/i.test(o.name));
  const mTotal = m.odds?.find((o: any) => /total/i.test(o.name));

  const mapValues = (market: any) =>
    !market ? [] : (market.values ?? []).slice(0, 3).map((v: any) => ({
      label: v.value,       // "1", "X", "2" o "Over/Under"
      price: v.odd,
    }));

  return {
    title: leagueTitle,
    timeLabel: m.fixture?.status?.elapsed != null ? `${m.fixture.status.elapsed}′` : "Today",
    clubNameOne: home,
    clubNameTwo: away,
    homeGoals,
    awayGoals,
    markets: {
      x2: mapValues(m1x2),
      double: mapValues(mDouble),
      total: mapValues(mTotal),
    },
  };
}
