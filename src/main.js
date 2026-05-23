import './style.css'
import jsPDF from 'jspdf'
import logo from './assets/logo-symbol.png'
import logoFull from './assets/logo.png'

document.querySelector('#app').innerHTML = `
  <div class="app">
    <header>
  <img src="${logo}" alt="Logo Arnaud Adam" class="app-logo">
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
        <button type="button" id="reset-btn" class="secondary">
          Réinitialiser
        </button>
        <button type="button" id="pdf-btn" class="secondary">
          Télécharger PDF
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

const savedClientName = localStorage.getItem('clientName')
const savedSiteType = localStorage.getItem('siteType')
const savedPages = localStorage.getItem('pages')

if (savedClientName) {
  document.querySelector('#client-name').value = savedClientName
}

if (savedSiteType) {
  document.querySelector('#site-type').value = savedSiteType
}

if (savedPages) {
  document.querySelector('#pages').value = savedPages
}

button.addEventListener('click', () => {
  const siteSelect = document.querySelector('#site-type')
  const siteType = siteSelect.value
  const pages = Number(document.querySelector('#pages').value)

  if (pages < 1) {
    result.textContent = 'Le nombre de pages doit être au minimum de 1.'
    return
  }

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
  const extraPagesPrice = extraPages * 150

  const clientName = document.querySelector('#client-name').value || 'Client non renseigné'

  localStorage.setItem('clientName', clientName)
  localStorage.setItem('siteType', siteType)
  localStorage.setItem('pages', pages)

  result.innerHTML = `
  <strong>Client :</strong> ${clientName}<br>
  <strong>Type de site :</strong> ${siteSelect.options[siteSelect.selectedIndex].text}<br>
  <strong>Nombre de pages :</strong> ${pages}<br><br>

  <strong>Prix de base :</strong> ${basePrice} €<br>
  <strong>Pages supplémentaires :</strong> ${extraPages} × 150 € = ${extraPagesPrice} €<br><br>

  <strong>Total estimé :</strong> ${total} €
`
})

const resetButton = document.querySelector('#reset-btn')

resetButton.addEventListener('click', () => {
  document.querySelector('#client-name').value = ''
  document.querySelector('#site-type').value = ''
  document.querySelector('#pages').value = 1
  localStorage.removeItem('clientName')
  localStorage.removeItem('siteType')
  localStorage.removeItem('pages')

  result.textContent = 'Le devis apparaîtra ici.'
})

const pdfButton = document.querySelector('#pdf-btn')

pdfButton.addEventListener('click', () => {
  const clientName = document.querySelector('#client-name').value || 'Client non renseigné'
  const siteSelect = document.querySelector('#site-type')
  const siteLabel = siteSelect.options[siteSelect.selectedIndex].text
  const pages = document.querySelector('#pages').value

  const doc = new jsPDF()
 doc.addImage(logo, 'PNG', 122, 10, 26, 26)

doc.setFontSize(14)
doc.setFont(undefined, 'bold')
doc.text('ARNAUD ADAM', 140, 20)

doc.setFontSize(8)
doc.setFont(undefined, 'normal')
doc.text('Création de sites web & solutions digitales', 140, 26)

  doc.setFontSize(8)
  doc.setFont(undefined, 'normal')
  const today = new Date().toLocaleDateString('fr-BE')
  const quoteRef = `DEV-${new Date().getFullYear()}-001`

  doc.setFontSize(22)
  doc.text('DEVIS CLIENT', 20, 45)

  doc.setFontSize(10)
  doc.text(`Date : ${today}`, 20, 55)
  doc.text(`Référence : ${quoteRef}`, 20, 62)

  doc.line(20, 68, 190, 68)

  doc.setFontSize(12)
  let basePrice = 0

  if (siteSelect.value === 'portfolio') {
    basePrice = 500
  } else if (siteSelect.value === 'vitrine') {
    basePrice = 800
  } else if (siteSelect.value === 'restaurant') {
    basePrice = 1200
  } else if (siteSelect.value === 'ecommerce') {
    basePrice = 2500
  }

  const extraPages = Number(pages) - 1
  const extraPagesPrice = extraPages * 150
  const total = basePrice + extraPagesPrice

  doc.text(`Client : ${clientName}`, 20, 85)
  doc.text(`Type de site : ${siteLabel}`, 20, 95)
  doc.text(`Nombre de pages : ${pages}`, 20, 105)

  doc.text(`Prix de base : ${basePrice} €`, 20, 125)
  doc.text(`Pages supplémentaires : ${extraPages} x 150 € = ${extraPagesPrice} €`, 20, 135)
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text(`TOTAL ESTIMÉ : ${total} €`, 20, 150)

  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')
  doc.setFontSize(11)
  doc.text('Ce devis est une proposition commerciale pouvant être ajustée selon les besoins du projet.', 20, 170)
  doc.setFontSize(10)

doc.text('Validité du devis : 30 jours à compter de la date d’émission.', 20, 182)

doc.text('Délai estimatif de réalisation : 2-4 semaines après validation.', 20, 189)

doc.text('Conditions de paiement : 30 % d’acompte à la commande, solde à la livraison.', 20, 196)
  doc.setGState(new doc.GState({ opacity: 0.14 }))
  doc.addImage(logo, 'PNG', 0, 190, 95, 95)
  doc.setGState(new doc.GState({ opacity: 1 }))
  doc.line(20, 265, 190, 265)

  doc.setFontSize(10)
  doc.setFont(undefined, 'bold')
  doc.text('Arnaud Adam', 20, 278)

  doc.setFont(undefined, 'normal')
  doc.text('Création de sites web & solutions digitales', 55, 278)

  doc.text('contact@a-adam.be', 20, 285)
  doc.text('www.a-adam.be', 145, 285)
  doc.save('devis-express.pdf')
})