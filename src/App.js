import { useState, useEffect, useRef } from 'react';
import Block from './components/Block';
import './index.scss';

function App() {
  const [inputValue, setInputValue] = useState(0);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [items, setItems] = useState();
  const [currentCurrencies, setCurrentCurrencies] = useState({ first: "RUB", second: "USD" });
  const [error, setError] = useState();

  const inputFromRef = useRef(null);
  const inputToRef = useRef(null);

  const url = 'https://cdn.cur.su/api/latest.json';

  // Получение курсов валют
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          setDataIsLoaded(true);
          setItems(result.rates);
        },
        (error) => {
          setDataIsLoaded(true);
          setError(error);
        }
      )
  }, [url]);
  // Получение курсов валют END

  // Функции
  function handleInput() {
    // Очищаю <input> от букв и разделяю число по разрядам
    inputFromRef.current.value = numberWithSpaces(inputFromRef.current.value.replace(/\D/g, ''));

    const currencyFrom = inputFromRef.current.dataset.currency;
    const currencyTo = inputToRef.current.dataset.currency;
    const valueFrom = backToNumber(inputFromRef.current.value);

    // Получаю новое значение и привожу его к виду "xyz,qw"
    let valueTo = Number(items[currencyTo]) * valueFrom / Number(items[currencyFrom]);
    valueTo = numberWithSpaces(Math.round(valueTo * 100) / 100);

    setInputValue(valueTo);
  }

  function swapBlocks() {
    const currenciesArray = [inputFromRef.current.dataset.currency, inputToRef.current.dataset.currency];
    // Меняю активные валюты местами
    setCurrentCurrencies({ first: currenciesArray[1], second: currenciesArray[0] });
  }
  // Функции END

  if (error) {
    return (
      <h1 style={{ color: "white" }}>{error}</h1>
    );
  } else if (!dataIsLoaded) {
    return <h1 style={{ color: "white" }}>Загрузка...</h1>
  } else {
    return (
      <div className="App">
        <Block handleInput={handleInput} items={items} activeCurrencies={currentCurrencies}
          listNumber={1} currentCurrency={currentCurrencies["first"]}
          changeCurrency={setCurrentCurrencies} inputRef={inputFromRef}
        />

        <span className='swap-btn' onClick={swapBlocks}></span>

        <Block handleInput={handleInput} items={items} activeCurrencies={currentCurrencies}
          listNumber={2} currentCurrency={currentCurrencies["second"]}
          changeCurrency={setCurrentCurrencies} inputRef={inputToRef}
          inputValue={inputValue} readonly={true}
        />
      </div>
    );
  }
}


// Вспомогательные функции
function numberWithSpaces(x) { // "15000" -> "15 000"
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function backToNumber(x) { // "15 000" -> "15000"
  return Number(x.replace(/\s/g, ''));
}

export default App;