
const SUPABASE_URL = "https://sjhbxnqovgqtzoqnnisa.supabase.co";
const SUPABASE_KEY = "sb_publishable_XlnhQOAPmNnA9p5ZMsDT8w_VD0W7Zlp";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");
const message = document.getElementById("message");
const productId = document.getElementById("product-id");
const cancelButton = document.getElementById("cancel-button");
const saveButton = document.getElementById("save-button");

function showMessage(text) {
    message.textContent = text;
}

function resetForm() {
    form.reset();
    productId.value = "";
    document.getElementById("form-title").textContent =
        "Registrar producto";
    saveButton.textContent = "Guardar producto";
    cancelButton.hidden = true;
}

async function loadProducts() {
    list.replaceChildren();

    const { data, error } = await db
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        showMessage("Error al consultar: " + error.message);
        return;
    }

    if (data.length === 0) {
        const row = list.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = "No hay productos registrados.";
        return;
    }

    data.forEach((product) => {
        const row = list.insertRow();

        [
            product.id,
            product.nombre,
            `S/ ${Number(product.precio).toFixed(2)}`,
            product.stock
        ].forEach((value) => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        const actions = row.insertCell();

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.className = "edit";
        editButton.addEventListener("click", () => {
            editProduct(product);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.className = "delete";
        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        actions.append(editButton, deleteButton);
    });
}

// CREATE y UPDATE
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion =
        document.getElementById("descripcion").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const stock = Number(document.getElementById("stock").value);

    if (!nombre || precio < 0 || stock < 0 ||
        !Number.isFinite(precio) || !Number.isInteger(stock)) {
        showMessage("Verifica los datos ingresados.");
        return;
    }

    const product = { nombre, descripcion, precio, stock };

    saveButton.disabled = true;

    try {
        let error;

        if (productId.value) {
            ({ error } = await db
                .from("productos")
                .update(product)
                .eq("id", Number(productId.value)));
        } else {
            ({ error } = await db
                .from("productos")
                .insert([product]));
        }

        if (error) throw error;

        showMessage(
            productId.value
                ? "Producto actualizado correctamente."
                : "Producto registrado correctamente."
        );

        resetForm();
        await loadProducts();
    } catch (error) {
        showMessage("Error al guardar: " + error.message);
    } finally {
        saveButton.disabled = false;
    }
});

// Cargar datos en el formulario de edición
function editProduct(product) {
    productId.value = product.id;
    document.getElementById("nombre").value = product.nombre;
    document.getElementById("descripcion").value =
        product.descripcion ?? "";
    document.getElementById("precio").value = product.precio;
    document.getElementById("stock").value = product.stock;

    document.getElementById("form-title").textContent =
        "Editar producto #" + product.id;

    saveButton.textContent = "Actualizar producto";
    cancelButton.hidden = false;
    showMessage("Editando: " + product.nombre);

    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

// DELETE
async function deleteProduct(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) {
        return;
    }

    const { error } = await db
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {
        showMessage("Error al eliminar: " + error.message);
        return;
    }

    showMessage("Producto eliminado correctamente.");
    await loadProducts();
}

cancelButton.addEventListener("click", () => {
    resetForm();
    showMessage("Edición cancelada.");
});

loadProducts();
