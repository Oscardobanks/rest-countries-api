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



const searchInput = document.getElementById('searchInput');
const countriesContainer = document.getElementById('countries-container');
const dropbtn = document.getElementById('dropbtn');
const btntext = document.getElementById('btntext');
const dropdownContent = document.getElementById('dropdown-content');
const dropdownIcon = document.getElementById('dropdown-icon');

searchInput.addEventListener('input', filterCountries);

function toggleDropdown() {
    dropdownContent.classList.toggle('show');
    dropdownIcon.classList.toggle('rotate');
}

function selectContinent(continent) {
    btntext.textContent = continent;
    dropdownContent.classList.remove('show');
    filterCountries();
}

window.addEventListener('click', function (event) {
    if (!dropbtn.contains(event.target) && !dropdownContent.contains(event.target)) {
        if (dropdownContent.classList.contains('show')) {
            toggleDropdown();
        }
    }
});

let countries;

fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,subregion,capital,tld,currencies,languages,nativeName')
    .then(response => response.json())
    .then(data => {
        countries = data.map(country => {
            return {
                name: country.name.common,
                nativeName: country.name.official,
                flag: country.flags.svg,
                population: country.population,
                region: country.region,
                subregion: country.subregion,
                capital: country.capital,
                tld: country.tld,
                currencies: country.currencies,
                languages: country.languages
            };
        });
        displayCountries(countries);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function displayCountries(countries) {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';

    countries.forEach((country, index) => {
        const formattedPopulation = formatNumber(country.population);

        const countryElement = document.createElement('div');
        countryElement.classList.add('country-card');
        countryElement.addEventListener('click', () => openCountryDetails(country));
        countryElement.innerHTML = `
            <div class="card">
                <img src="${country.flag}" alt="Flag">
                <div class="country-details">
                    <h2>${country.name}</h2>
                    <p><span>Population: </span>${formattedPopulation}</p>
                    <p class="region"><span>Region: </span>${country.region}</p>
                    <p><span>Capital: </span>${country.capital}</p>
                </div>
            </div>
        `;
        container.appendChild(countryElement);
    });
}

function filterCountries() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedRegion = btntext.textContent.toLowerCase();

    const filteredCountries = countries.filter(country => {
        const nameMatch = country.name.toLowerCase().includes(searchValue) || country.region.toLowerCase().includes(searchValue);
        const regionMatch = selectedRegion === 'filter by region' || country.region.toLowerCase() === selectedRegion;
        return nameMatch && regionMatch;
    });

    displayCountries(filteredCountries);
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function openCountryDetails(country) {
    const queryParams = new URLSearchParams();
    queryParams.set('name', encodeURIComponent(country.name));
    queryParams.set('nativeName', encodeURIComponent(country.nativeName));
    queryParams.set('flag', encodeURIComponent(country.flag));
    queryParams.set('population', country.population);
    queryParams.set('region', encodeURIComponent(country.region));
    queryParams.set('subregion', encodeURIComponent(country.subregion));
    queryParams.set('capital', encodeURIComponent(country.capital));
    queryParams.set('tld', encodeURIComponent(country.tld));
    queryParams.set('currencies', encodeURIComponent(JSON.stringify(country.currencies)));
    queryParams.set('languages', encodeURIComponent(JSON.stringify(country.languages)));
    window.location.href = `country-detail.html?${queryParams.toString()}`;
}



