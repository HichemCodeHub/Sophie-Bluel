// Fonction modifier l'attribut aria-hidden des éléments aussi utilisé pour indiquer aux technologies d'assistance (comme les lecteurs d'écran) si un élément est caché ou non.
function updateariahidden(elements, value) {
  elements.forEach(element => {
    if (element) {
      element.setAttribute("aria-hidden", value);
    }
  });
}

// Fonction masquer les éléments
function hideelements(elements) {
  elements.forEach(element => {
    if (element && element.classList) {
      element.classList.add("display-none");
    }
  });
}

// Fonction afficher les éléments
function showelements(elements) {
  elements.forEach(element => {
    if (element && element.classList) {
      element.classList.remove("display-none");
    }
  });
}

// Fonction basculer l'affichage des éléments
function toggleelements(elements, visible) {
  elements.forEach(element => {
    if (element && element.classList) {
      element.classList.toggle("display-none", !visible);
    }
  });
}

// Filtrer les projets : Affiche tous les projets si la catégorie est "all", sinon n'affiche que ceux appartenant à la catégorie sélectionnée.
function filterprojects(category) {
  const gallery = document.querySelector('.gallery');
  const projects = gallery.querySelectorAll('figure');

  projects.forEach(project => {
    const projectCategory = project.dataset.category;

    if (category === 'all' || projectCategory === category) {
      const show = [project];
      showelements(show);
    } else {
      const hide = [project];
      hideelements(hide);
    }
  });
}

// Fonction supprimer un projet en envoyant une requête à une API et met à jour l'interface en conséquence.
function deleteproject(projectId) {

  const token = localStorage.getItem("token");
  const elementDeleted = document.querySelector(`.delete-icon[data-project-id="${projectId}"]`);
  const portfolioDeleted = document.querySelector(`figure[data-project-id="${projectId}"]`);
  const galleryDeleted = elementDeleted.parentElement;

  fetchdelete(projectId, token)
    .then(response => {
      if (response.ok) {
        portfolioDeleted.remove();
        galleryDeleted.remove();
        console.log(`Le projet avec l'ID ${projectId} a été supprimé.`);
      } else {
        console.log(`Une erreur s'est produite lors de la suppression du projet avec l'ID ${projectId}.`);
      }
    })
    .catch(error => {
      console.log('Une erreur s\'est produite lors de la communication avec l\'API :', error);
    });
}

function updatewithdata(project) {
  const { id, title, imageUrl, categoryId } = project;

  // Galerie principale
  const gallery = document.getElementById('portfolio').querySelector('.gallery');
  const figure = document.createElement('figure');
  figure.dataset.category = categoryId;
  figure.dataset.projectId = id;

  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = title;

  const figcaption = document.createElement('figcaption');
  figcaption.textContent = title;

  // Ajout dans galerie principale
  figure.appendChild(image);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);

  // Galerie modale
  const modalOverlay = document.getElementById('modal-overlay');
  const modalGallery = modalOverlay.querySelector('.modal-gallery');
  const modalGalleryDiv = document.createElement('div');
  modalGalleryDiv.style.position = 'relative';

  const modalGalleryImg = document.createElement('img');
  modalGalleryImg.src = imageUrl;
  modalGalleryImg.alt = title;

  // Création du lien de suppression pour la galerie modale
  const trashButton = document.createElement('a');
  trashButton.classList.add('delete-icon');
  trashButton.dataset.projectId = id;

  // Création de l'icône de poubelle
  const trashIcon = document.createElement('i');
  trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

  // Ajout dans la galerie modale
  trashButton.appendChild(trashIcon);
  modalGalleryDiv.appendChild(modalGalleryImg);
  modalGalleryDiv.appendChild(trashButton);
  modalGallery.appendChild(modalGalleryDiv);

  // Supprimer un projet (pour la galerie modale)
  trashButton.addEventListener('click', () => {
    deleteproject(id);
  });
}


// Prévisualisation de l'image
function previewpicture() {
  const elementsToHide = [buttonAdd, addText, imgIcon, errorText];
  const elementsToShow = [previewImg];

  hideelements(elementsToHide);
  showelements(elementsToShow);

  const picture = fileInput.files[0];
  previewImg.src = URL.createObjectURL(picture);
}

// Supprimer la prévisualisation
function removepreviewpicture() {
  const elementsToHide = [previewImg];
  const elementsToShow = [buttonAdd, addText, imgIcon, errorText];

  showelements(elementsToShow);
  hideelements(elementsToHide);

  errorText.textContent = "";

  previewImg.src = "";
}

// Réinitialiser le formulaire
function resetform() {
  addImgForm.reset();
  removepreviewpicture();
  hidevalidationerror(titleInput);
  hidevalidationerror(categorySelect);
  hidevalidationerror(fileInputDiv);
  disablesubmit();
}

// Fonction afficher un message d'erreur dans le formulaire
function showvalidationerror(inputElement, submit = true, text = 'Ce champ doit être rempli') {
  const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);
  if (errorElement) {
    return;
  }

  inputElement.classList.add('error-input');

  const errorMessage = document.createElement('p');
  errorMessage.classList.add('error-message');
  errorMessage.textContent = text;
  errorMessage.dataset.input = inputElement.id;
  inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
  if (submit) {
    disablesubmit();
  }
}

// Fonction masquer un message d'erreur dans le formulaire
function hidevalidationerror(inputElement, submit = true) {
  inputElement.classList.remove('error-input');
  const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);
  if (errorElement) {
    errorElement.parentNode.removeChild(errorElement);
  }
  if (submit) {
    disablesubmit();
  }
}

// Fonction désactiver ou activer le bouton de soumission du formulaire
function disablesubmit() {
  const isTitleValid = titleInput.value.trim() !== '';
  const isCategoryValid = categorySelect.value !== '';
  const isFileValid = fileInput.value !== '';
  const isFormValid = isTitleValid && isCategoryValid && isFileValid;
  if (isFormValid) {
    submitButton.classList.remove('disabled');
  } else {
    submitButton.classList.add('disabled');
  }
}

// Vérifier la validité du formulaire
function checkformvalidity(elements) {

  elements.forEach(el => {
    if (el.value.trim() === '') {
      if (el.id === '') {
        el = el.parentElement.parentElement;
      }
      showvalidationerror(el);
    } else {
      hidevalidationerror(el);
    }
  });
  disablesubmit();
}

// Fonction vérifier la validité du formulaire de connexion
function checkloginformvalidity(email, password) {
  if (email.value.trim() === '') {
    showvalidationerror(email, false);
  } else if (!validateemail(email.value.trim())) {
    showvalidationerror(email, false, 'Format incorrect');
  } else {
    hidevalidationerror(email, false);
  }

  if (password.value === '') {
    showvalidationerror(password, false);
  } else {
    hidevalidationerror(password, false);
  }
}

// Fonction valider le format d'une adresse e-mail
function validateemail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}