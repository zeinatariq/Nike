
function priceAfterDiscount(price, discount) {
    return parseFloat(price) - parseFloat(price) * parseFloat(discount);
}

function getProductById(id) {

    let allProducts = [];
    if (typeof latest !== 'undefined') allProducts = allProducts.concat(latest);
    if (typeof features !== 'undefined') allProducts = allProducts.concat(features);
    if (typeof shoes !== 'undefined') allProducts = allProducts.concat(shoes);
    if (typeof products !== 'undefined') allProducts = allProducts.concat(products);
    
    return allProducts.find(p => p.id == id);
}

function parents(ele, selector = null) {
    let node = ele;
    while ((node = node.parentElement)) {
        if (node.classList.contains('product')) break;
    }
    return selector == null ? node : node.querySelector(selector);
}

function moveActive(ele) {
    let siblings = ele.parentElement.children;
    for (let s of siblings) s.classList.remove('active');
    ele.classList.add('active');
}

// --- دوال عرض الصور والمنتجات ---
function showImg(ele) {
    let img = ele.firstElementChild;
    let src = img.getAttribute('src');
    let selectedImg = ele.parentElement.parentElement.parentElement
        .nextElementSibling.firstElementChild.firstElementChild;
    selectedImg.setAttribute('src', src);
}

function showFeaturedImg(ele) {
    let headImg = ele.parentElement.parentElement.parentElement.firstElementChild;
    let src = ele.getAttribute('data-src');
    headImg.setAttribute('src', `./images_Nike/images/products/${src}`);
    headImg.setAttribute('onerror', "this.src='https://placehold.co/400x400/eeeeee/999999?text=No+Image'");
    moveActive(ele);
}

// --- دوال عربة التسوق (Cart) ---
let cart = [];

function updateLocalStorage() {
    localStorage.setItem('shopProducts', JSON.stringify(cart));
}

function loadCartFromStorage() {
    let stored = localStorage.getItem('shopProducts');
    cart = stored == null ? [] : JSON.parse(stored);
}

function updateSize(ele, size) {
    parents(ele).setAttribute('data-selected-size', size);
}

function updateColor(ele, color) {
    parents(ele).setAttribute('data-selected-color', color);
}

function addProductToCart(btn, id) {
    let productEle = document.querySelector(`.product[data-product-id="${id}"]`);
    let size = productEle.getAttribute('data-selected-size');
    let color = productEle.getAttribute('data-selected-color');
    cart.push({ id: id, size: size, color: color });
    updateLocalStorage();
    btn.textContent = 'Remove From Cart';
    btn.classList.add('remove');
    btn.setAttribute('onclick', `removeProductFromCart(this, ${id})`);
}

function removeProductFromCart(btn, id) {
    let product = getProductById(id);
    let index = cart.findIndex(c => c.id == id);
    cart.splice(index, 1);
    updateLocalStorage();
    btn.textContent = 'Add To Cart';
    btn.classList.remove('remove');
    btn.setAttribute('onclick', `addProductToCart(this, ${product.id})`);
}

function createSizes(sizes, cartItem) {
    let html = '';
    for (let i = 0; i < sizes.length; i++) {
        if (cartItem == null) {
            html += `<li class="${i == 0 ? 'active' : ''}" onclick="moveActive(this); updateSize(this, '${sizes[i]}');">${sizes[i]}</li>`;
        } else {
            html += `<li class="${sizes[i] == cartItem.size ? 'active' : ''}" onclick="moveActive(this); updateSize(this, '${sizes[i]}');">${sizes[i]}</li>`;
        }
    }
    return html;
}

function createColors(colors, cartItem) {
    let html = '';
    for (let i = 0; i < colors.length; i++) {
        if (cartItem == null) {
            html += `<li style="background-color:${colors[i]};" onclick="moveActive(this); updateColor(this, '${colors[i]}');" class="${i == 0 ? 'active' : ''}"></li>`;
        } else {
            html += `<li style="background-color:${colors[i]};" onclick="moveActive(this); updateColor(this, '${colors[i]}');" class="${colors[i] == cartItem.color ? 'active' : ''}"></li>`;
        }
    }
    return html;
}

// --- دوال الـ Popups ---
function scrollDownPopup(popup) {
    popup.classList.add('active');
    setTimeout(() => {
        popup.classList.add('show');
        setTimeout(() => popup.firstElementChild.classList.add('show'), 100);
    }, 100);
}

function scrollUpPopup(popup) {
    popup.firstElementChild.classList.remove('show');
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.classList.remove('active'), 100);
    }, 500);
}

function showImgOfPopup(ele) {
    let img = ele.firstElementChild;
    let src = img.getAttribute('src');
    let target = ele.parentElement.parentElement.previousElementSibling.firstElementChild;
    target.setAttribute('src', src);
}

function insertDataIntoPopup(id) {
    let product = getProductById(id);
    let popup = document.querySelector('.brand-popup[popup-name="product"]');
    if (!popup) return;
    let box = popup.firstElementChild;
    let discounted = priceAfterDiscount(product.price, product.discount);
    let cartItem = cart.find(c => c.id == id);

    let imagesHtml = '';
    for (let img of product.images) {
        imagesHtml += `<li class="col" onclick="showImgOfPopup(this)"><img src="./images_Nike/images/products/${img}" onerror="this.src='https://placehold.co/150x150/eeeeee/999999?text=x'" alt="" class="img-fluid"></li>`;
    }

    box.innerHTML = `
    <div class="row product" data-product-id="${product.id}" data-selected-size="${cartItem == null ? product.sizes[0] : cartItem.size}" data-selected-color="${cartItem == null ? product.colors[0] : cartItem.color}">
        <div class="col-md-6">
            <div class="item">
                <div class="img"><img src="./images_Nike/images/products/${product.images[0]}" onerror="this.src='https://placehold.co/400x400/eeeeee/999999?text=No+Image'" alt="" class="img-fluid"></div>
                <div class="images"><ul class="list-unstyled row">${imagesHtml}</ul></div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="item">
                <h3 class="mb-3">${product.name}</h3>
                <h6>${product.discount != 0 ? `<span class="before-discount">${product.price} <sup>$</sup></span>` : ''}<span class="after-discount">${discounted.toFixed(2)} <sup>$</sup></span></h6>
                <hr>
                <p>${product.description}</p>
                <h6 class="size my-3"><strong class="me-3">Size :</strong><ul class="list-unstyled mb-0">${createSizes(product.sizes, cartItem)}</ul></h6>
                <h6 class="color my-3"><strong class="me-3">Color :</strong><ul class="list-unstyled mb-0">${createColors(product.colors, cartItem)}</ul></h6>
                ${cartItem != null ? `<button class="btn mainButton remove" onclick="removeProductFromCart(this, ${product.id})">Remove From Cart</button>` : `<button class="btn mainButton" onclick="addProductToCart(this, ${product.id})">Add To Cart</button>`}
            </div>
        </div>
    </div>`;
}

function showShopProducts() {
    let container = document.querySelector('.brand-popup[popup-name="shop"] .body .row');
    if (!container) return;
    container.innerHTML = '';

    for (let item of cart) {
        let product = getProductById(item.id);
        let discounted = priceAfterDiscount(product.price, product.discount);
        container.innerHTML += `
        <div class="col-sm-6 col-md-4 product mb-3" data-product-id="${item.id}">
            <div class="item">
                <div class="product-head"><img src="./images_Nike/images/products/${product.images[0]}" onerror="this.src='https://placehold.co/300x300/eeeeee/999999?text=No+Image'" alt="" class="img-fluid"></div>
                <div class="product-body">
                    <h5>${product.name}</h5>
                    <h6 class="price my-3"><strong class="me-3">Price :</strong><p class="mb-0"><span class="before-discount">${product.price} <sup>$</sup></span><span class="after-discount">${discounted.toFixed(2)} <sup>$</sup></span></p></h6>
                    <h6 class="size my-3"><strong class="me-3">Size :</strong><ul class="list-unstyled mb-0"><li class="active">${item.size}</li></ul></h6>
                    <h6 class="color my-3"><strong class="me-3">Color :</strong><ul class="list-unstyled mb-0"><li class="active" style="background-color:${item.color};"></li></ul></h6>
                    <button class="btn btn-danger d-block w-100" onclick="removeShopProduct(${item.id})">Remove</button>
                </div>
            </div>
        </div>`;
    }
    isShopProductsEmpty();
}

function isShopProductsEmpty() {
    let alert = document.querySelector('.brand-popup[popup-name="shop"] .body p.alert');
    let buyBtn = document.querySelector('.brand-popup[popup-name="shop"] .body > button');
    if (!alert || !buyBtn) return;
    if (cart.length == 0) {
        alert.classList.remove('d-none');
        buyBtn.classList.add('d-none');
    } else {
        alert.classList.add('d-none');
        buyBtn.classList.remove('d-none');
    }
}

function removeShopProduct(id) {
    let index = cart.findIndex(c => c.id == id);
    cart.splice(index, 1);
    updateLocalStorage();
    let productEle = document.querySelector(`.brand-popup[popup-name="shop"] .product[data-product-id="${id}"]`);
    if (productEle) productEle.remove();
    isShopProductsEmpty();
}
