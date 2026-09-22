let scCarousel = document.querySelector('#SC-Carousel'),
    nextCarousel = scCarousel.querySelector('.next'),
    prevCarousel = scCarousel.querySelector('.prev'),
    slides = Array.from(scCarousel.querySelectorAll('.brand-carousel-item'));

function hideSlide() {
    let shown = document.querySelectorAll('#SC-Carousel .brand-carousel-item.active .show');
    for (let el of shown) el.classList.remove('show');
}

function showSlide() {
    let active = document.querySelector('#SC-Carousel .brand-carousel-item.active');
    if (!active) return;
    let img1 = active.querySelector('.media-col img:nth-of-type(1)');
    let img2 = active.querySelector('.media-col img:nth-of-type(2)');
    let item1 = active.querySelector('.content-col .item');

    if (img2) img2.classList.add('show');
    setTimeout(() => {
        if (img1) img1.classList.add('show');
        setTimeout(() => { if (item1) item1.classList.add('show'); }, 500);
    }, 500);
}

function nextSlide() {
    let current = document.querySelector('#SC-Carousel .brand-carousel-item.active');
    if (!current) return;
    let idx = slides.findIndex(s => s == current);
    idx = (idx == slides.length - 1) ? -1 : idx;
    let newSlide = slides[idx + 1];
    let colorName = newSlide.dataset.colorName;

    hideSlide();
    current.classList.remove('active');
    newSlide.classList.add('active');

    changeMainColor(colorName);
    showSlide();
}

function prevSlide() {
    let current = document.querySelector('#SC-Carousel .brand-carousel-item.active');
    if (!current) return;
    let idx = slides.findIndex(s => s == current);
    idx = (idx == 0) ? slides.length : idx;
    let newSlide = slides[idx - 1];
    let colorName = newSlide.dataset.colorName;

    hideSlide();
    current.classList.remove('active');
    newSlide.classList.add('active');

    changeMainColor(colorName);
    showSlide();
}

nextCarousel.addEventListener('click', nextSlide);
prevCarousel.addEventListener('click', prevSlide);

function buildLatestProducts() {
    let container = document.querySelector('#Latest .products');
    if (!container) return;
    container.innerHTML = '';

    for (let product of latest) {
        let discounted = priceAfterDiscount(product.price, product.discount);
        let imagesHtml = '';
        for (let i = 0; i < product.images.length; i++) {
            imagesHtml += `<li onclick="showImg(this)"
                ${i == product.images.length - 1 ? '' : 'class="me-2 me-md-0 mb-md-2"'}>
                <img src="./../images_Nike/images/products${product.images[i]}" onerror="this.src='https://placehold.co/300x300/eeeeee/999999?text=No+Image'" alt="" class="img-fluid"></li>`;
        }

        let cartItem = cart.find(c => c.id == product.id);

        container.innerHTML += `
        <div class="product mb-3" data-product-id="${product.id}"
            data-selected-size="${cartItem == null ? product.sizes[0] : cartItem.size}"
            data-selected-color="${cartItem == null ? product.colors[0] : cartItem.color}">
            <div class="row">
                <div class="col-lg-6 mb-md-4 mb-lg-0 product-images">
                    <div class="item">
                        <div class="row">
                            <div class="col-md-2 col-lg-3 col-xl-2">
                                <div class="item">
                                    <ul class="list-unstyled">${imagesHtml}</ul>
                                </div>
                            </div>
                            <div class="col-md-10 col-lg-9 col-xl-10 selected-image">
                                <div class="item">
                                    <img src="./../images_Nike/images/products${product.images[0]}" onerror="this.src='https://placehold.co/500x500/eeeeee/999999?text=No+Image'" alt="" class="img-fluid">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 product-content">
                    <div class="item">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <h6 class="price">
                            <strong class="me-3">Price :</strong>
                            <p class="mb-0">
                                <span class="before-discount">${product.price} <sup>$</sup></span>
                                <span class="after-discount">${discounted.toFixed(2)} <sup>$</sup></span>
                            </p>
                        </h6>
                        <h6 class="size my-3">
                            <strong class="me-3">Size :</strong>
                            <ul class="list-unstyled mb-0">${createSizes(product.sizes, cartItem)}</ul>
                        </h6>
                        ${cartItem != null
                            ? `<button class="btn mainButton remove"
                                onclick="removeProductFromCart(this, ${product.id})">Remove From Cart</button>`
                            : `<button class="btn mainButton"
                                onclick="addProductToCart(this, ${product.id})">Add To Cart</button>`}
                    </div>
                </div>
            </div>
        </div>`;
    }
}

function buildFeaturedProducts() {
    let container = document.querySelector('#Feature .products');
    if (!container) return;
    container.innerHTML = '';

    for (let product of features) {
        let discounted = priceAfterDiscount(product.price, product.discount);
        let indicatorsHtml = '';
        for (let i = 0; i < product.images.length; i++) {
            indicatorsHtml += `<li onclick="showFeaturedImg(this)"
                data-src="${product.images[i]}"
                ${i == 0 ? 'class="active"' : ''}></li>`;
        }

        container.innerHTML += `
        <div class="col-sm-6 col-lg-3 mb-3 product">
            <div class="item">
                <p class="offer ${parseFloat(product.discount) == 0 ? 'd-none' : ''}">
                    -${parseFloat(product.discount) * 100}%
                </p>
                <div class="head pb-5">
                    <img src="./../images_Nike/images/products${product.images[0]}" onerror="this.src='https://placehold.co/400x400/eeeeee/999999?text=No+Image'" alt="" class="img-fluid">
                    <i class="fas fa-search key" data-key-popup="product" data-product-id="${product.id}"></i>
                    <div class="indicators">
                        <ul class="list-unstyled">${indicatorsHtml}</ul>
                    </div>
                </div>
                <div class="body text-center">
                    <h6>${product.name}</h6>
                    <h6>
                        ${product.discount != 0
                            ? `<span class="before-discount">${product.price} <sup>$</sup></span>`
                            : ''}
                        <span class="after-discount">${discounted.toFixed(2)} <sup>$</sup></span>
                    </h6>
                </div>
            </div>
        </div>`;
    }
}

function initPopups() {
    let popupTriggers = document.querySelectorAll('i[data-key-popup]');
    let popupExits = document.querySelectorAll('.brand-popup .exit');
    let popups = document.querySelectorAll('.brand-popup');
    let popupBoxes = document.querySelectorAll('.brand-popup .box');

    for (let trigger of popupTriggers) {
        trigger.addEventListener('click', function () {
            let key = this.getAttribute('data-key-popup');
            let popup = document.querySelector(`.brand-popup[popup-name="${key}"]`);
            if (!popup) return;

            if (this.classList.contains('fa-search')) {
                let id = this.getAttribute('data-product-id');
                insertDataIntoPopup(id);
            } else if (this.classList.contains('fa-shopping-cart')) {
                showShopProducts();
            }
            scrollDownPopup(popup);
        });
    }

    for (let exit of popupExits) {
        exit.addEventListener('click', function () {
            let key = this.getAttribute('data-key-popup');
            let popup = document.querySelector(`.brand-popup[popup-name="${key}"]`);
            if (popup) scrollUpPopup(popup);
        });
    }

    for (let popup of popups) {
        popup.addEventListener('click', () => scrollUpPopup(popup));
    }

    for (let box of popupBoxes) {
        box.addEventListener('click', e => e.stopPropagation());
    }
}

function initNavLinks() {
    let navEle = document.querySelector('nav.navbar');
    let navLinks = document.querySelectorAll('nav.navbar a[data-section-id]');

    for (let link of navLinks) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            let sectionId = this.getAttribute('data-section-id');
            let section = document.querySelector(`#${sectionId}`);
            if (!section || !navEle) return;
            let top = section.offsetTop - navEle.clientHeight;
            window.scrollTo(0, top);
            updateActiveLink(sectionId);
        });
    }
}

window.addEventListener('scroll', function () {
    checkScrolledNav();

    let navEle = document.querySelector('nav.navbar');
    if (!navEle) return;
    let sections = ['Home', 'Latest', 'Feature'];

    for (let id of sections) {
        let section = document.querySelector(`#${id}`);
        if (!section) continue;
        if (window.scrollY >= section.offsetTop - navEle.clientHeight) {
            updateActiveLink(id);
        }
    }
});

window.addEventListener('load', function () {
    loadCartFromStorage();
    buildLatestProducts();
    buildFeaturedProducts();
    initPopups();
    initNavLinks();
    showSlide();

    let loading = document.querySelector('.brand-loadingScreen');
    if (loading) {
        loading.classList.add('hide');
        setTimeout(() => {
            loading.style.display = 'none';
            document.body.style.overflowX = 'hidden';
            document.body.style.overflowY = 'auto';
        }, 1000);
    } else {
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
    }
});