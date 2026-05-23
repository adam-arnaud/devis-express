import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app">
    <header>
      <h1>Devis Express</h1>
      <p>Créez une estimation rapide pour un site web</p>
    </header>

    <main class="container">
      <form id="devis-form">

        <label for="client-name">Nom du client</label>
        <input type="text" id="client-name" placeholder="Ex: Boucherie Dupont">

        <label for="site-type">Type de site</label>
        <select id="site-type">
          <option value="">Choisir...</option>
          <option value="portfolio">Portfolio</option>
          <option value="vitrine">Site vitrine</option>
          <option value="restaurant">Restaurant</option>
          <option value="ecommerce">E-commerce</option>
        </select>

        <label for="pages">Nombre de pages</label>
        <input type="number" id="pages" min="1" value="1">

        <button type="button" id="calculate-btn">
          Calculer le devis
        </button>

      </form>

      <section class="result">
        <h2>Résumé du devis</h2>
        <p>Le devis apparaîtra ici.</p>
      </section>
    </main>
  </div>
`

const button = document.querySelector('#calculate-btn')
const result = document.querySelector('.result p')

button.addEventListener('click', () => {
  const siteType = document.querySelector('#site-type').value
  const pages = Number(document.querySelector('#pages').value)

  let basePrice = 0

  if (!siteType) {
  result.textContent = 'Veuillez choisir un type de site.'
  return
}

  if (siteType === 'portfolio') {
    basePrice = 500
  } else if (siteType === 'vitrine') {
    basePrice = 800
  } else if (siteType === 'restaurant') {
    basePrice = 1200
  } else if (siteType === 'ecommerce') {
    basePrice = 2500
  }

  const extraPages = pages - 1
  const total = basePrice + (extraPages * 150)

  result.textContent = `Prix estimé : ${total} €`
})