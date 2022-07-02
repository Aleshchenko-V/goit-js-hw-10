import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputSearchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const controller = new AbortController();

inputSearchBox.addEventListener(
  'input',
  debounce(onInputSearchBox, DEBOUNCE_DELAY)
);

function onInputSearchBox(e) {
  const trimedQuery = e.target.value.trim();
  if (trimedQuery) {
    clearField(countryList);
    clearField(countryInfo);
  }
  if (!trimedQuery) {
    controller.abort();
    return;
  }
  fetchCountries(trimedQuery)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length === 1) {
        const markup = createCountryInfo(data);
        drowInfo(markup);
        return;
      }
      const markup = createListOfCountries(data);
      drowInfo(markup);
    })
    .catch(e => {
      clearField(countryList);
      clearField(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

function createListOfCountries(array) {
  return array
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li><img src="${svg}" alt="${official}" width="30" height="20"></img><p>&nbsp;${official}</p></li>`;
    })
    .join('');
}
function createCountryInfo(array) {
  const { flags, name, capital, population, languages } = array[0];
  return `<h1><img src="${flags.svg}" alt="${
    name.official
  }" width="30" height="30">&nbsp;${name.official}</h1>
      <p><b>Capital:</b> ${capital}</p><br>
      <p><b>Population:</b> ${population}</p><br>
      <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
}

function drowInfo(arg) {
  countryList.insertAdjacentHTML('beforeend', arg);
}

function clearField(field) {
  field.innerHTML = '';
}
