// light and dark mode themes
const darkmode = document.getElementById('dark-mode')
const lightmode = document.getElementById('light-mode')

function darkMode() {
    document.body.classList.toggle('dark-theme')
    if (document.body.classList.contains('dark-theme')) {
        lightmode.style.display = 'block';
        lightmode.classList.add('light-mode');
        darkmode.style.display = 'none';
        darkmode.classList.add('dark-mode');
    }
}

function lightMode() {
    document.body.classList.toggle('dark-theme')
    lightmode.style.display = 'none';
    lightmode.classList.add('light-mode');
    darkmode.style.display = 'block';
    darkmode.classList.add('dark-mode');
}


const queryParams = new URLSearchParams(window.location.search);
const name = decodeURIComponent(queryParams.get('name'));
const flag = decodeURIComponent(queryParams.get('flag'));
const population = Number(queryParams.get('population'));
const region = decodeURIComponent(queryParams.get('region'));
const subregion = decodeURIComponent(queryParams.get('subregion'));
const capital = decodeURIComponent(queryParams.get('capital'));
const tld = decodeURIComponent(queryParams.get('tld'));
const currencies = JSON.parse(decodeURIComponent(queryParams.get('currencies')));
const languages = JSON.parse(decodeURIComponent(queryParams.get('languages')));
const nativeName = decodeURIComponent(queryParams.get('nativeName'));

document.getElementById('flag').src = flag;
document.getElementById('name').textContent = name;
document.getElementById('nativeName').textContent = nativeName
document.getElementById('population').textContent = formatNumber(population);
document.getElementById('region').textContent = region;
document.getElementById('subregion').textContent = subregion;
document.getElementById('capital').textContent = capital;
document.getElementById('tld').textContent = tld;
document.getElementById('currencies').textContent = Object.values(currencies).map(currency => currency.name).join(', ');
document.getElementById('languages').textContent = Object.values(languages).join(', ');

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// Function to encode the object as a URL query string
function encodeQueryData(data) {
    const params = Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    return params;
}

document.addEventListener('DOMContentLoaded', function () {
    const queryParams = new URLSearchParams(window.location.search);
    const countryName = queryParams.get('name');

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countriesData => {
            let country;

            // Find the country by name
            country = countriesData.find(country => country.name.common === countryName);

            // If country not found by name, try finding it by cca3 code
            if (!country) {
                country = countriesData.find(country => country.cca3 === countryName);
            }

            if (!country) {
                console.error(`Country '${countryName}' not found in the API.`);
                return;
            }

            const borderCountries = country.borders;
            const borderCountriesContainer = document.querySelector('.border-countries');

            console.log('Border Countries:', borderCountries);


            borderCountries.forEach(border => {
                const borderCountry = countriesData.find(country => country.cca3 === border);
                if (borderCountry) {
                    const button = document.createElement('button');
                    button.classList.add('border-country-button');
                    button.textContent = borderCountry.name.common;
                    button.addEventListener('click', () => {
                        console.log(borderCountry.location)
                        const countryDetails = {
                            name: borderCountry.name.common,
                            nativeName: borderCountry.translations.nld.common,
                            flag: borderCountry.flags.svg,
                            population: Number(borderCountry.population),
                            region: borderCountry.region,
                            subregion: borderCountry.subregion,
                            capital: borderCountry.capital.join(', '),
                            tld: borderCountry.tld,
                            currencies: borderCountry.currencies ? encodeURIComponent(JSON.stringify(borderCountry.currencies)) : '',
                            languages: borderCountry.languages ? encodeURIComponent(JSON.stringify(borderCountry.languages)) : ''
                        };
                        const urlParams = encodeQueryData(countryDetails);
                        window.location.href = `country-detail.html?${urlParams}`;
                    });
                    borderCountriesContainer.appendChild(button);
                }
            });
        })
        .catch(error => {
            console.log('Error fetching country data:', error);
        });
});

function goBack() {
    window.history.back();
}
