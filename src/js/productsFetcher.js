function fetchProducts() {
    return fetch('../data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}

function displayProducts(products) {
    const productsList = document.querySelector(".products__content");
    productsList.innerHTML = ''; // Limpiar los productos existentes

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product__item';

        productItem.innerHTML = `
          <img class="product__image" src="${product.path}" alt="${product.name}">
          <span class="product__name">${product.name}</span>
          <span class="product__price">${product.price.toFixed(2)}€</span>
        `;

        productsList.appendChild(productItem);
    });
}

// Filtrar productos por tipo según la URL del archivo HTML
function filterProductsByType(products, type) {
    return products.filter(product => product.type === type);
}

fetchProducts().then(data => {
    if (data && data.products) {
        // Obtener el nombre del archivo HTML actual
        const currentPage = window.location.pathname.split('/').pop();

        // Determinar el tipo de vela según el nombre del archivo HTML
        let type = '';
        if (currentPage === 'decorative.html') {
            type = 'decorative';
        } else if (currentPage === 'special.html') {
            type = 'special';
        } else if (currentPage === 'aromatic.html') {
            type = 'aromatic';
        }

        // Filtrar los productos por tipo
        const filteredProducts = filterProductsByType(data.products, type);

        // Mostrar los productos filtrados
        displayProducts(filteredProducts);
    }
});

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'lowest-price':  // Precio: Menor a Mayor
            return products.sort((a, b) => a.price - b.price);
        case 'highest-price': // Precio: Mayor a Menor
            return products.sort((a, b) => b.price - a.price);
        case 'news': // Novedades
            // Ordena por la propiedad 'new', los productos nuevos (new: true) primero
            return products.sort((a, b) => b.new - a.new);
        case 'favorites': // Filtrar productos favoritos
            return products.filter(product => product.isFavorite);
        default:
            return products; // Sin orden específico
    }
}

// Añadir la funcionalidad de ordenación
document.addEventListener('DOMContentLoaded', () => {
    const arrow = document.querySelector('.sort-by__arrow');
    const hiddenMenu = document.querySelector('.sort-by__hidden');
    const activeSpan = document.querySelector('.sort-by__active');
    const options = hiddenMenu.querySelectorAll('span');
    const selectElement = document.getElementById("sort-by"); // Este será nuestro dropdown de selección

    // Función para mostrar/ocultar el menú desplegable
    arrow.addEventListener('click', () => {
        const isMenuVisible = hiddenMenu.style.display === 'block';
        
        // Cambiar el ángulo del arrow
        arrow.style.transform = isMenuVisible ? 'rotate(90deg)' : 'rotate(180deg)';
        
        // Mostrar/ocultar el menú
        hiddenMenu.style.display = isMenuVisible ? 'none' : 'block';
    });

    // Actualizar el texto cuando se selecciona una opción
    options.forEach(option => {
        option.addEventListener('click', () => {
            activeSpan.textContent = option.textContent; // Actualiza el texto activo con la opción seleccionada
            hiddenMenu.style.display = 'none';
            arrow.style.transform = 'rotate(90deg)';  // Vuelve a la posición original del arrow
            
            const sortBy = option.getAttribute('value');
            fetchProducts().then(data => {
                if (data && data.products) {
                    const sortedProducts = sortProducts(data.products, sortBy); // Ordenar productos
                    // Filtrar por tipo y luego mostrar los productos ordenados
                    const currentPage = window.location.pathname.split('/').pop();
                    let type = '';
                    if (currentPage === 'decorative.html') {
                        type = 'decorative';
                    } else if (currentPage === 'special.html') {
                        type = 'special';
                    } else if (currentPage === 'aromatic.html') {
                        type = 'aromatic';
                    }

                    const filteredProducts = filterProductsByType(sortedProducts, type); // Filtrar los productos ya ordenados
                    displayProducts(filteredProducts); // Mostrar productos filtrados y ordenados
                }
            });
        });
    });

    // Cerrar el desplegable si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter__sort-by')) {
            hiddenMenu.style.display = 'none';
            arrow.style.transform = 'rotate(90deg)'; // Vuelve a la posición original del arrow
        }
    });

    // Si seleccionas una opción en el select, ordenamos los productos
    selectElement.addEventListener('change', (event) => {
        const sortBy = event.target.value;
        fetchProducts().then(data => {
            if (data && data.products) {
                const sortedProducts = sortProducts(data.products, sortBy);
                // Filtrar por tipo y luego mostrar los productos ordenados
                const currentPage = window.location.pathname.split('/').pop();
                let type = '';
                if (currentPage === 'decorative.html') {
                    type = 'decorative';
                } else if (currentPage === 'special.html') {
                    type = 'special';
                } else if (currentPage === 'aromatic.html') {
                    type = 'aromatic';
                }

                const filteredProducts = filterProductsByType(sortedProducts, type); // Filtrar los productos ya ordenados
                displayProducts(filteredProducts); // Mostrar productos filtrados y ordenados
            }
        });
    });
});
