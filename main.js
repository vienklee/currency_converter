const currentRates = {
  USD: 1,
  BYN: 3.22,
  EUR: 0.96,
  CNY: 7.39,
  RUB: 89.48,
};

const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("choice_currency");
const resultItems = document.querySelectorAll(".result_item");
const dateInput = document.getElementById("datepicker");

const history = (() => {
  const history = {};
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    if (i === 0) {
      history[dateStr] = { ...currentRates };
      continue;
    }

    history[dateStr] = {};
    for (const [currency, rate] of Object.entries(currentRates)) {
      const change = 0.9 + Math.random() * 0.2;
      history[dateStr][currency] = Number((rate * change).toFixed(4));
    }
  }

  return history;
})();

function updateResults() {
  const amount = Math.max(0, parseFloat(amountInput.value) || 0);
  const selectedCurrency = currencySelect.value;
  const selectedDate = dateInput.value;

  let rates = history[selectedDate] || currentRates;

  if (!history[selectedDate]) {
    const oldestDate = Object.keys(history).sort()[0];
    rates = history[oldestDate];
  }

  resultItems.forEach((item) => {
    const currency = item.dataset.currency;
    item.hidden = currency === selectedCurrency;

    if (!item.hidden) {
      const result = (
        (amount * rates[currency]) /
        rates[selectedCurrency]
      ).toFixed(2);
      item.querySelector(".result_value").textContent = result;
    }
  });
}

dateInput.addEventListener("change", () => {
  if (new Date(dateInput.value) > new Date()) {
    alert(
      "Невозможно предсказать курс в будущем, показываем на данный момент;)"
    );
    dateInput.value = new Date().toISOString().split("T")[0];
  }
  updateResults();
});

currencySelect.addEventListener("change", updateResults);
amountInput.addEventListener("input", updateResults);

updateResults();
