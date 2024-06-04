// Fetch Works
async function fetchworks() {
  const response = await fetch('http://localhost:5678/api/works');
  return await response.json();
}

// Fetch Categories
async function fetchcategory() {
  const response = await fetch('http://localhost:5678/api/categories');
  return await response.json();
}

// Fetch Login
async function fetchlogin(data) {

  return fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Fetch Delete
async function fetchdelete(projectId, token) {
  return fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// Fetch Envoie des nouveaux travaux
async function fetchsend(userToken, formData) {
  return fetch('http://localhost:5678/api/works', {

    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`
    },
    body: formData
  });
}