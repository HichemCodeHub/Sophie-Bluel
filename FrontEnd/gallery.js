// Sélectionner l'élément parent où la galerie est déjà créée
const galleryContainer = document.querySelector('.gallery');

// Effectuer la requête fetch pour récupérer les données de l'API Swagger
fetch('http://localhost:5678/api/works')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Parcourir les données récupérées et créer les éléments figure avec img et figcaption
    data.forEach(item => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = item.imageUrl; // Utiliser l'URL de l'image depuis les données de l'API
      img.alt = item.title; // Utiliser le titre comme texte alternatif de l'image
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = item.title; // Utiliser le titre comme légende de l'image
      figure.appendChild(img);
      figure.appendChild(figcaption);
      galleryContainer.appendChild(figure); // Ajouter chaque figure à la galerie existante
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });