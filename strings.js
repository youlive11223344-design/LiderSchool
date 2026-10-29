const D = {
  uz: {
    pending: 'Tasdiqlanishi kutilmoqda',
    pendingNote: 'Kartangiz maktab ma’muriyati tasdiqlagandan keyin saytda hammaga ko‘rinadi.',
    profPending: 'Kartangiz tasdiqlanishini kutmoqda.'
  },
  ru: {
    pending: 'Ожидает подтверждения',
    pendingNote: 'Ваша карточка станет видна всем на сайте после подтверждения администрацией школы.',
    profPending: 'Ваша карточка ожидает подтверждения.'
  },
  en: {
    pending: 'Awaiting approval',
    pendingNote: 'Your card will be visible to everyone on the site once the school administration approves it.',
    profPending: 'Your card is awaiting approval.'
  }
};

export const S = k => {
  const l = (window.I18N && I18N.current && I18N.current()) || 'uz';
  return (D[l] && D[l][k]) || D.uz[k] || k;
};