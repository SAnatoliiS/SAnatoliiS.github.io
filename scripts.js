function file_get_contents( url ) {
  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);
  return req.responseText;
}

function getTrend(current, previous) {
    const diff = (current - previous);
    const diffFormated = diff.toFixed(2).replace('.', ',');
    if (diff > 0) return ` ▲${diffFormated}`;
    if (diff < 0) return ` ▼${diffFormated}`;
    return '';
  }
  
function printCourse(rates, valute) {
  
  const nextElem = document.createElement('p');
  const valuteName = rates.Valute[valute].Name;
  const nominal = rates.Valute[valute].Nominal;
  const currentRate = rates.Valute[valute].Value;
  const previousRate = rates.Valute[valute].Previous;
  const currentRateFormated = currentRate.toFixed(2).replace('.', ',');
  const currentTrend = getTrend(currentRate, previousRate);
  nextElem.innerHTML = `${nominal} ${valuteName} = ${currentRateFormated} руб. ${currentTrend}`;
  document.getElementById('output').appendChild(nextElem);
}

let timerID;

function course(...valutes) {
  
  if (valutes.length === 0) {
    clearTimeout(timerID);
    document.getElementById('output').innerHTML = '';
    return;
  }
  text = file_get_contents("https://www.cbr-xml-daily.ru/daily_json.js");
  rates = JSON.parse(text);
  document.getElementById('output').innerHTML = '';
  valutes.map(valute => {
    try {printCourse(rates, valute);} catch(e) {}
  });
  timerID = setTimeout(course, 5000, ...valutes);
}
  
function processedForm(form) {
  const valutes = [...form.elements.valute];
  const checkedValutes = valutes.reduce((acc, val) => {
    if (val.checked) {
      return [...acc, val.value];
    }
    return acc;
  }, []);
  clearTimeout(timerID);
  course(...checkedValutes);
}
