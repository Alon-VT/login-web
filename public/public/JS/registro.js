document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = e.target.nombre.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const area = e.target.area.value;

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombre, email, password, area })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      window.location.href = 'login.html';
    } else {
      alert(data.error || 'Error en el registro');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo conectar con el servidor');
  }
});
