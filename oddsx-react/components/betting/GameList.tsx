"use client";

import React from "react";
import GameCardLive from "./GameCardLive";
import GameCardScheduled from "./GameCardScheduled";
import type { GameCardData, Seleccion } from "./types";

export default function GameList({
  games,
  onPick,
  onOpenGame,
}: {
  games: GameCardData[];
  onPick: (s: Seleccion) => void;
  onOpenGame: (id: string) => void;
}) {
  return (
    <>
      <section className="game-list">
        {games.map((g) =>
          g.isLive ? (
            <GameCardLive
              key={g.id}
              game={g}
              onPick={onPick}
              onOpen={onOpenGame}
            />
          ) : (
            <GameCardScheduled
              key={g.id}
              game={g}
              onPick={onPick}
              onOpen={onOpenGame}
            />
          )
        )}
      </section>

      <style jsx>{`
        .game-list {
          display: grid;
          row-gap: 16px;
        }
      `}</style>
    </>
  );
}
