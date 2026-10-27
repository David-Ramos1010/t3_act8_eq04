const BASE_URL = 'https://dummyjson.com/products';

// Obtener productos con filtros de búsqueda, categoría y paginación
export async function fetchProducts({ limit = 10, skip = 0, search = '', category = '' }) {
    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

    if (search.trim()) {
        url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== 'Todas') {
        url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener el catálogo de insumos/productos.');
    }
    return await response.json();
}

// Obtener la lista de categorías
export async function fetchCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
        throw new Error('Error al obtener las categorías.');
    }
    const data = await response.json();
    // Se normaliza la respuesta si devuelve objetos
    return data.map(cat => (typeof cat === 'string' ? cat : cat.slug || cat.name));
}

// AGREGAR: Petición real POST
export async function createProduct(productData) {
    const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!response.ok) {
        throw new Error('Error al registrar el producto en la API.');
    }
    return await response.json();
}

// EDITAR: Petición real PUT
export async function updateProduct(id, productData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el producto en la API.');
    }
    return await response.json();
}

// ELIMINAR: Petición real DELETE
export async function deleteProduct(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el producto en la API.');
    }
    return await response.json();
}