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

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (nombre.length < 3 || /\d/.test(nombre)) {
      alert("El nombre debe tener al menos 3 caracteres y no debe contener  numeros");
      return;
    }

    if ((email === "" && telefono === "") || isNaN(telefono)) {
      alert("Debes completar al menos el correo o el teléfono ( El Telefono no debe contener letras).");
      return;
    }

    // Mostrar mensaje de éxito
    mensaje.classList.remove("oculto");

    // Ocultar modal
    document.getElementById("modal-contacto").style.display = "none";

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      mensaje.classList.add("oculto");
    }, 3000);

    // Resetear el formulario
    form.reset();
  });
});
