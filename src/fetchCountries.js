import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (response.status === 500 || response.status === 404) {
      Notify.failure('Oops, there is no country with that name');
      throw new Error(response.status);
    }
    return response.json();
  });
}
