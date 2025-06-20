let autos = [];

function renderizarAutos(lista) {
  const contenedor = document.getElementById("autos-lista");
  contenedor.innerHTML = "";

  lista.forEach(auto => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${auto.imagen}" class="card-img-top" alt="${auto.modelo}">
        <div class="card-body">
          <h5 class="card-title">${auto.marca} ${auto.modelo}</h5>
          <p class="card-text"><strong>Precio:</strong> USD ${auto.precio.toLocaleString()}</p>
          <a href="nuestros-autos.html#${auto.modelo}" target="_blank" class="btn btn-primary">Especificaciones</a>
          <button class="btn btn-outline-secondary btn-contacto" data-id="${auto.id}">Contactanos</button>

        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function filtrarYOrdenar() {
  const marca = document.getElementById("filtro-marca").value;
  const orden = document.getElementById("filtro-precio").value;

  // Obtener checkboxes seleccionados //
  const tiposSeleccionados = Array.from(document.querySelectorAll('.filtro-tipo:checked')).map(cb => cb.value);
  const traccionesSeleccionadas = Array.from(document.querySelectorAll('.filtro-traccion:checked')).map(cb => cb.value);

  let filtrados = autos.filter(auto => {
    let coincideMarca = (marca === "todos" || auto.marca === marca);
    let coincideTipo = (tiposSeleccionados.length === 0 || tiposSeleccionados.includes(auto.tipo));
    let coincideTraccion = (traccionesSeleccionadas.length === 0 || traccionesSeleccionadas.includes(auto.traccion));
    return coincideMarca && coincideTipo && coincideTraccion;
  });

  filtrados.sort((a, b) => orden === "asc" ? a.precio - b.precio : b.precio - a.precio);

  renderizarAutos(filtrados);
}

 //Cargar JSON externo//
fetch("autos.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar autos.json");
    }
    return response.json();
  })
  .then(data => {
    autos = data;
    renderizarAutos(autos);


  // filtros de checkbox (motorización y traccion) //
  document.querySelectorAll('.filtro-tipo, .filtro-traccion').forEach(checkbox => {
  checkbox.addEventListener("change", filtrarYOrdenar);
    });


    // eventos para filtros //
    document.getElementById("filtro-marca").addEventListener("change", filtrarYOrdenar);
    document.getElementById("filtro-precio").addEventListener("change", filtrarYOrdenar);

    // evento para boton de reinicio //
    const resetBtn = document.getElementById("reset-filtro");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        document.getElementById("filtro-marca").value = "todos";
        document.getElementById("filtro-precio").value = "desc";
       document.querySelectorAll('.filtro-tipo, .filtro-traccion').forEach(cb => {
      cb.checked = false;
    });
        renderizarAutos(autos);
      });
    }
  })
  .catch(error => {
    console.error("Error al cargar los autos:", error);
  });




  // mostrar el formulario al hacer clic en cualquier boton de "contactanos" //
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-contacto")) {
    const modal = document.getElementById("modal-contacto");
    const titulo = modal.querySelector("h3");

    // verificar si el botón tiene data-id="navbar" //
    if (e.target.dataset.id === "navbar") {
      titulo.textContent = "Contactate con nosotros";
    } else {
      titulo.textContent = "Contáctanos por este vehículo";
    }

    modal.style.display = "block";
  }

  if (e.target.classList.contains("cerrar-modal")) {
    document.getElementById("modal-contacto").style.display = "none";
  }
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-contacto");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});



// valida //
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-contacto");
  const mensaje = document.getElementById("mensaje-exito");

  if (!form) return;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const campoNombre = document.getElementById("nombre");
  const campoEmail = document.getElementById("email");
  const campoTelefono = document.getElementById("telefono");

  const errorNombre = document.getElementById("error-nombre");
  const errorEmail = document.getElementById("error-email");
  const errorTelefono = document.getElementById("error-telefono");

  const nombre = campoNombre.value.trim();
  const email = campoEmail.value.trim();
  const telefono = campoTelefono.value.trim();

  const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre) && nombre.length >= 3;
  const emailValido = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.(com|com\.ar|net)$/.test(email);
  const telefonoValido = /^[0-9]{6,15}$/.test(telefono);

  // Limpiar errores previos
  [campoNombre, campoEmail, campoTelefono].forEach(input => {
    input.classList.remove("validado", "invalido");
  });
  [errorNombre, errorEmail, errorTelefono].forEach(error => {
    error.textContent = "";
  });

  let validacionCorrecta = true;

  // Nombre
  if (!nombreValido) {
    campoNombre.classList.add("invalido");
    errorNombre.textContent = "Solo letras. Mínimo 3 caracteres. Sin símbolos.";
    validacionCorrecta = false;
  } else {
    campoNombre.classList.add("validado");
  }

  // Al menos uno requerido
  if (email === "" && telefono === "") {
    campoEmail.classList.add("invalido");
    campoTelefono.classList.add("invalido");
    errorEmail.textContent = "Completá al menos uno de los dos campos.";
    errorTelefono.textContent = "Completá al menos uno de los dos campos.";
    validacionCorrecta = false;
  }

  // Email
  if (email !== "" && !emailValido) {
    campoEmail.classList.add("invalido");
    errorEmail.textContent = "Correo inválido. Ej: nombre@gmail.com";
    validacionCorrecta = false;
  } else if (email !== "") {
    campoEmail.classList.add("validado");
  }

  // Telefono
  if (telefono !== "" && !telefonoValido) {
    campoTelefono.classList.add("invalido");
    errorTelefono.textContent = "Solo números (6 a 15 dígitos).";
    validacionCorrecta = false;
  } else if (telefono !== "") {
    campoTelefono.classList.add("validado");
  }

  if (!validacionCorrecta) return;


  mensaje.classList.remove("oculto");
  document.getElementById("modal-contacto").style.display = "none";

  setTimeout(() => {
    mensaje.classList.add("oculto");
  }, 3000);

  form.reset();
  [campoNombre, campoEmail, campoTelefono].forEach(input => {
    input.classList.remove("validado", "invalido");
  });
});
});
