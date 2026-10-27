import React, { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } from '../services/api';
import Modal from '../components/Modal';
import './ProductsPage.css';

export default function ProductsPage() {
    // Función  para leer parámetros de la URL
    const getUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            page: parseInt(params.get('page')) || 1,
            limit: parseInt(params.get('limit')) || 10,
            search: params.get('search') || '',
            category: params.get('category') || 'Todas'
        };
    };

    const initialParams = getUrlParams();

    // Estados de datos
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);

    // Estados de filtros y paginación
    const [page, setPage] = useState(initialParams.page);
    const [limit, setLimit] = useState(initialParams.limit);
    const [search, setSearch] = useState(initialParams.search);
    const [category, setCategory] = useState(initialParams.category);

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Modales y formularios
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        category: 'beauty',
        price: '',
        stock: ''
    });

    // Actualizar parámetros en la URL
    const updateUrl = useCallback((newPage, newLimit, newSearch, newCategory) => {
        const params = new URLSearchParams();
        params.set('page', newPage);
        params.set('limit', newLimit);
        if (newSearch) params.set('search', newSearch);
        if (newCategory && newCategory !== 'Todas') params.set('category', newCategory);

        const newRelativePathQuery = window.location.pathname + '?' + params.toString();
        window.history.pushState(null, '', newRelativePathQuery);
    }, []);

    // Cargar categorías al montar
    useEffect(() => {
        fetchCategories()
            .then(data => setCategories(data))
            .catch(() => console.error("No se pudieron cargar las categorías."));
    }, []);

    // Cargar productos al cambiar filtros, página o límite
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const skip = (page - 1) * limit;
            const data = await fetchProducts({ limit, skip, search, category });
            setProducts(data.products || []);
            setTotal(data.total || 0);
            updateUrl(page, limit, search, category);
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, category, updateUrl]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Escuchar eventos de regresar o avanzar en el navegador
    useEffect(() => {
        const handlePopState = () => {
            const params = getUrlParams();
            setPage(params.page);
            setLimit(params.limit);
            setSearch(params.search);
            setCategory(params.category);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Handlers de Filtros
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Regresar a página 1 al filtrar
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    };

    // Mensaje  de éxito
    const showNotification = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // CRUD: AGREGAR
    const handleOpenAdd = () => {
        setFormData({ title: '', category: categories[0] || 'beauty', price: '', stock: '' });
        setIsAddModalOpen(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price) return;

        setLoading(true);
        try {
            const newProd = await createProduct({
                title: formData.title,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 10
            });

            // Reflejar cambio en el estado local
            setProducts([newProd, ...products]);
            setTotal(prev => prev + 1);
            setIsAddModalOpen(false);
            showNotification(`¡Producto "${newProd.title}" creado con éxito! (Petición real POST completada)`);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // CRUD: EDITAR
    const handleOpenEdit = (prod) => {
        setSelectedProduct(prod);
        setFormData({
            title: prod.title,
            category: prod.category,
            price: prod.price,
            stock: prod.stock || 0
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setLoading(true);
        try {
            const updated = await updateProduct(selectedProduct.id, {
                title: formData.title,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            });

            // Reflejar cambio en el estado local
            setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...updated } : p));
            setIsEditModalOpen(false);
            showNotification(`¡Producto "${formData.title}" actualizado con éxito! (Petición real PUT completada)`);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // CRUD: ELIMINAR
    const handleOpenDelete = (prod) => {
        setSelectedProduct(prod);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        setLoading(true);
        try {
            await deleteProduct(selectedProduct.id);

            // Reflejar cambio en el estado local
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setTotal(prev => prev - 1);
            setIsDeleteModalOpen(false);
            showNotification(`¡Producto "${selectedProduct.title}" eliminado con éxito! (Petición real DELETE completada)`);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cálculo de paginación
    const totalPages = Math.ceil(total / limit) || 1;
    const startRecord = (page - 1) * limit + 1;
    const endRecord = Math.min(page * limit, total);

    return (
        <div className="products-container">
            {/* Mensaje de Notificación Exitosa */}
            {successMsg && <div className="toast-success">{successMsg}</div>}

            {/* Barra Superior de Filtros y Botón "+ Nuevo" */}
            <div className="table-controls">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={handleSearchChange}
                        className="search-input"
                    />

                    <select value={category} onChange={handleCategoryChange} className="select-filter">
                        <option value="Todas">Categoría: Todas</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button className="btn-add-primary" onClick={handleOpenAdd}>
                    + Nueva Cita / Registro
                </button>
            </div>

            {/* Manejo de Carga y Errores */}
            {loading && <div className="loading-spinner">Cargando datos de la API...</div>}
            {error && <div className="error-banner">❌ {error}</div>}

            {/* Tabla con estilo Figma de la Actividad 7 */}
            {!loading && !error && (
                <div className="table-wrapper">
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>PRODUCTO</th>
                                <th>CATEGORÍA</th>
                                <th>PRECIO</th>
                                <th>STOCK</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td className="product-title-cell">
                                            <strong>{item.title}</strong>
                                        </td>
                                        <td>
                                            <span>{item.category}</span>
                                        </td>
                                        <td>${item.price?.toFixed(2)}</td>
                                        <td>{item.stock ?? 15} uds.</td>
                                        <td className="actions-cell">
                                            <button className="btn-action edit" onClick={() => handleOpenEdit(item)}>
                                                [Editar]
                                            </button>
                                            <button className="btn-action delete" onClick={() => handleOpenDelete(item)}>
                                                [Borrar]
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginación con selector de cantidad e indicador de registros */}
            <div className="pagination-bar">
                <div className="pagination-info">
                    <span>
                        Mostrando {total > 0 ? startRecord : 0}-{endRecord} de {total} registros
                    </span>
                    <select value={limit} onChange={handleLimitChange} className="select-limit">
                        <option value={10}>Mostrar 10</option>
                        <option value={20}>Mostrar 20</option>
                        <option value={40}>Mostrar 40</option>
                        <option value={50}>Mostrar 50</option>
                    </select>
                </div>

                <div className="pagination-buttons">
                    <button
                        className="btn-page"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        [Anterior]
                    </button>
                    
                    <span className="page-indicator">
                        Página {page} de {totalPages}
                    </span>

                    <button
                        className="btn-page"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        [Siguiente]
                    </button>
                </div>
            </div>

            {/* MODAL 1: Agregar Producto */}
            <Modal isOpen={isAddModalOpen} title="Agregar Nuevo Producto" onClose={() => setIsAddModalOpen(false)}>
                <form onSubmit={handleCreateSubmit} className="modal-form">
                    <label>Nombre del producto:</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej: Kit Odontológico Resina"
                    />

                    <label>Categoría:</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>Precio ($):</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                    />

                    <label>Stock inicial:</label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="10"
                    />

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Guardar Producto</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL 2: Editar Producto */}
            <Modal isOpen={isEditModalOpen} title="Editar Producto" onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleUpdateSubmit} className="modal-form">
                    <p style={{ fontSize: '13px', color: '#667085', marginBottom: '12px' }}>
                        Confirmación: Al hacer clic en "Guardar Cambios" se hara la llamada PUT a la API y se actualizará la tabla local.
                    </p>
                    <label>Nombre del producto:</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <label>Categoría:</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <label>Precio ($):</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />

                    <label>Stock:</label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL 3: Confirmar Eliminar */}
            <Modal isOpen={isDeleteModalOpen} title="Confirmar Borrado" onClose={() => setIsDeleteModalOpen(false)}>
                <div className="modal-form">
                    <p>¿Estás seguro de que deseas eliminar el producto <strong>"{selectedProduct?.title}"</strong>?</p>
                    <p style={{ fontSize: '13px', color: '#d92d20' }}>
                        Esta acción usara una petición DELETE a la API de DummyJSON y eliminara el ítem de la tabla.
                    </p>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                        <button type="button" className="btn-danger" onClick={handleDeleteConfirm}>Sí, Eliminar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}