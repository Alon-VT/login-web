
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
  
      const areaUrl = data.area.replace(/_/g, '-').toLowerCase();
      window.location.href = `AREAS/${areaUrl}.html`;
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('No se pudo conectar con el servidor');
  }
});


document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = e.target.nombre.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const area = e.target.area.value;

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, area })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      window.location.href = 'login.html';
    } else {
      alert(data.error || 'Error al registrarse');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('No se pudo conectar con el servidor');
  }
});
