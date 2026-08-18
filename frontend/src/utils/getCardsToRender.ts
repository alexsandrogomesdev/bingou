import type { Cards, Goods } from "../types/pack";

export const getCardsToRender = async (
  cards: Cards[],
  goods: Goods[],
): Promise<Cards[]> => {
  const _cardsToRender: Cards[] = [];

  const goodCards: Set<number> = new Set(goods.map((item) => item.card));
  for (let a = 0; a < cards.length; a++) {
    const card = cards[a];
    if (goodCards.has(card.id)) {
      _cardsToRender.push(card);
    }
    if (_cardsToRender.length === 250) break;
  }

  for (let a = 0; a < cards.length; a++) {
    if (_cardsToRender.length === 250) break;
    const card = cards[a];
    if (!goodCards.has(card.id)) {
      _cardsToRender.push(card);
    }
  }

  return _cardsToRender;
};
