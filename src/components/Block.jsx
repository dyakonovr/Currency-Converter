import { useEffect, useRef } from 'react';

const Block = (props) => {
  const { handleInput, inputValue, items, listNumber, currentCurrency, changeCurrency, inputRef, readonly, activeCurrencies } = props;
  let mainCurrencies = ['RUB', 'EUR', 'USD'];
  const lastCurrencyBtn = useRef(null); // Ссылка на кнопку со стрелкой
  const listRef = useRef(null);

  // Если выбрана валюта, которая после swapBlocks не будет рендерится в списке активных
  if (!mainCurrencies.includes(currentCurrency)) mainCurrencies.push(currentCurrency);
  // Иначе в будущем рендерить первую валюту из JSON 
  else mainCurrencies.push(Object.keys(items)[0]);

  // Создаю список главных валют
  const currenciesList = mainCurrencies.map((el, i) => {
    if (i === mainCurrencies.length - 1) {
      return <li
        className={currentCurrency === el ? "currencies__main currency currency--active" : "currencies__main currency"}
        ref={lastCurrencyBtn}
        key={i}
      >{el}</li>
    }

    return <li
      className={currentCurrency === el ? "currencies__main currency currency--active" : "currencies__main currency"} key={i}
      data-currency={el}
    >{el}</li>
  });
  // Создаю список главных валют END

  // Создание листа с курсами всех валют
  let allCurrenciesList = Object.keys(items).map((el, index) => { return <li className="currencies__item" key={index}>{el}</li>; });
  // Создание листа с курсами всех валют END

  // Обновляю валюты в INPUT'ах
  useEffect(handleInput, [handleInput]);
  // Обновляю валюты в INPUT'ах END

  // Функции
  function toggleInnerList(btn) {
    // Убираю все активные классы
    const activeBtn = document.querySelector('.btn--active');
    const activeList = document.querySelector('.inner-list.show');
    const innerList = btn.querySelector('.inner-list');

    if (activeBtn && activeBtn !== btn) activeBtn.classList.remove('btn--active');
    if (activeList && activeList !== innerList) activeList.classList.remove('show');

    // Добавляю классы у активных элементов
    if (btn) btn.classList.toggle('btn--active');
    if (innerList) innerList.classList.toggle('show');
  }

  function pickCurrency(e) {
    if (["RUB", "EUR", "USD"].includes(e.target.innerHTML)) { // Если выбранная валюта (из списка всех валют) является одной из главных
      // То с помощью querySelector я получаю нужную мне кнопку с валютой (из списка главных валют)
      // и передаю её в toggleCurrencyBtn()
      toggleCurrencyBtn(listRef.current.querySelector(`.currency[data-currency=${e.target.innerHTML}]`));
    } else {
      lastCurrencyBtn.current.innerHTML = e.target.innerHTML;
      toggleCurrencyBtn(lastCurrencyBtn.current);
    }
  }

  function toggleCurrencyBtn(currentElem) {
    const activeElem = currentElem.parentElement.querySelector('.currency--active');

    activeElem.classList.remove('currency--active');
    currentElem.classList.add('currency--active');

    // Изменяю State активных валют
    if (listNumber === 1) { // Если изменилась активная валюта в 1-ом списке
      changeCurrency({ first: currentElem.innerHTML, second: activeCurrencies.second });
    } else {
      changeCurrency({ first: activeCurrencies.first, second: currentElem.innerHTML });
    }
  }

  // Функции END

  return (
    <div>
      <ul className="currencies" data-number={listNumber} ref={listRef} onClick={(e) => {
        if (!e.target.classList.contains('btn') && e.target.classList.contains('currency')) toggleCurrencyBtn(e.target)
      }}>
        {currenciesList}
        <li className="currencies__btn btn" onClick={(e) => { if (e.target.tagName === 'LI') toggleInnerList(e.target); }}>
          <ul className="currencies__inner-list inner-list" data-number={listNumber} onClick={(e) => { if (e.target.tagName === 'LI') pickCurrency(e) }}>
            {allCurrenciesList}
          </ul>
        </li>
      </ul>
      <input type="text" className="input" onChange={handleInput} value={inputValue}
        data-currency={currentCurrency} ref={inputRef} placeholder={0} readOnly={readonly || false} />
      <span className='value'>{

        // Если наша валюта - это USD, то мы получаем курс напрямую из списка
        // Иначе мы возвращаем 1 / курс валюты (относительно доллара) из списка
        listNumber === 1 ? `1 ${activeCurrencies.first} = ${activeCurrencies.first === "USD" ? items[activeCurrencies.second] : 1 / items[activeCurrencies.first]} ${activeCurrencies.second}`
          : `1 ${activeCurrencies.second} = ${activeCurrencies.second === "USD" ? items[activeCurrencies.first] : 1 / items[activeCurrencies.second]} ${activeCurrencies.first}`

      }</span>
    </div >
  );

};

export default Block;
