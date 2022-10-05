import { useState, useEffect, useRef } from 'react';
import Block from './components/Block';
import './index.scss';

function App() {
  const [inputValue, setInputValue] = useState(0);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [items, setItems] = useState();
  const [error, setError] = useState();
  const [firstBlockCurrency, setFirstBlockCurrency] = useState('RUB');
  const [secondBlockCurrency, setSecondBlockCurrency] = useState('USD');

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
  function numberWithSpaces(x) { // "15000" -> "15 000"
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function backToNumber(x) { // "15 000" -> "15000"
    return Number(x.replace(/\s/g, ''));
  }

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

  // function swapBlocks() {
  //   const inputsValue = [inputFromRef.current.value || "0", inputToRef.current.value];
  //   const currenciesArray = [inputFromRef.current.dataset.currency, inputToRef.current.dataset.currency];
  // }
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
        <Block handleInput={handleInput} items={items}
          listNumber={1} currentCurrency={firstBlockCurrency}
          changeCurrency={setFirstBlockCurrency} inputRef={inputFromRef}
        />

        {/* <span className='swap-btn' onClick={swapBlocks}></span> */}

        <Block handleInput={handleInput} items={items}
          listNumber={2} currentCurrency={secondBlockCurrency}
          changeCurrency={setSecondBlockCurrency} inputRef={inputToRef}
          inputValue={inputValue} readonly={true}
        />
      </div>
    );
  }
}

export default App;
