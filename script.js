
let url = "https://dummyjson.com/products";

let currentPage = 1;
let itemsPerPage = 21;

console.log(url);

showLoader();

fetch(`${url}?skip=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`)
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("ERROR");
    })
    .then((data) => {
        const products = data.products;
        const totalProducts = data.total;
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        renderPagination(totalPages);
        renderPage(currentPage, products);
        console.log(products);

    })
    .catch((error) => {
        const headline = document.getElementById("h5");
        headline.textContent = "Error...";
        console.log(error);
    })
    .finally(() => {
        closeLoader();
    })


function renderCard(user) {
    const userDiv = document.createElement("div");
    const brand = document.createElement("h1");
    const category = document.createElement("p");
    const description = document.createElement("p");
    const discountPercentage = document.createElement("h2");
    const id = document.createElement("p");
    const images = document.createElement("img");
    const price = document.createElement("p");
    const rating = document.createElement("p");
    const stock = document.createElement("p");
    const title = document.createElement("p");
    const thumbnail = document.createElement("img");
    const likeButton = document.createElement("button");

    // // second div for new page
    // const newPageDiv = document.createElement("div");


    brand.textContent = user.brand;
    category.textContent = user.category;
    description.textContent = user.description;
    discountPercentage.textContent = "discount - " + user.discountPercentage + "%";
    id.textContent = "#" + user.id;
    images.src = user.images[0];
    images.alt = "Photo"
    price.textContent = "price - " + user.price + "$";
    rating.textContent = "rating - " + user.rating;
    stock.textContent = "stock - " + user.stock;
    title.textContent = user.title;
    thumbnail.src = user.thumbnail;
    likeButton.textContent = "Liked";

    userDiv.classList.add("userOneDiv");
    images.classList.add("images");
    thumbnail.classList.add("thumbnail");
    // newPageDiv.classList.add("newDiv");
    likeButton.classList.add("likeButton");


    userDiv.appendChild(brand);
    userDiv.appendChild(category);
    userDiv.appendChild(title);
    userDiv.appendChild(thumbnail);
    userDiv.appendChild(price);
    userDiv.appendChild(discountPercentage);
    userDiv.appendChild(likeButton);




    // like 
    
    let localStorageDiv = "likedCount" + user.id;   

    let likeCount = localStorage.getItem(localStorageDiv) || 0;
    likeButton.innerHTML = "Liked - " + likeCount;

    likeButton.addEventListener("click", function () {
        likeCount++;
        likeButton.innerHTML = "Liked - " + likeCount;
        localStorage.setItem(localStorageDiv, likeCount);
    });
    
   


    // new details 

    thumbnail.addEventListener("click", () => {
        handleImageClick(user);

    })

    return userDiv;
}

    
    function handleImageClick(user) {

        const section = document.getElementById("section");
        const newPageDiv = document.createElement("div");
        newPageDiv.classList.add("newDiv");
    
        const id = document.createElement("p");
        const description = document.createElement("p");
        const rating = document.createElement("p");
        const stock = document.createElement("p");
    
        id.textContent = "#" + user.id;
        description.textContent = user.description;
        rating.textContent = "rating - " + user.rating;
        stock.textContent = "stock - " + user.stock;
    
        const imagesContainer = document.createElement("div");
        imagesContainer.classList.add("imagesContainer");
    
        user.images.forEach((imageSrc) => {
            const image = document.createElement("img");
            image.classList.add("newPageImages");
            image.src = imageSrc;
            image.alt = "Photo";
            imagesContainer.appendChild(image);
        });
    
        newPageDiv.appendChild(id);
        newPageDiv.appendChild(description);
        newPageDiv.appendChild(rating);
        newPageDiv.appendChild(stock);
        newPageDiv.appendChild(imagesContainer);
    
        section.innerHTML = " ";
        section.appendChild(newPageDiv);
        
    }



function userContainer(info) {
    const usersDiv = document.createElement("div");
    usersDiv.classList.add("mainDiv");

    info.forEach((user) => {
        usersDiv.appendChild(renderCard(user));
    })

    return usersDiv;
}

function renderPagination(totalPages) {
    const paginationDiv = document.getElementById("pagination");
    const ul = document.createElement("ul");
    ul.classList.add("pagination");
    paginationDiv.appendChild(ul);

    const prevLi = document.createElement("li");
    prevLi.classList.add("page-item");
    ul.appendChild(prevLi);

    const prevA = document.createElement("a");
    prevA.classList.add("page-link");
    prevA.href = "#";
    prevA.textContent = "Previous";
    prevLi.appendChild(prevA);

    prevA.addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            const productsDiv = document.getElementById("products");
            while (productsDiv.firstChild) {
                productsDiv.removeChild(productsDiv.firstChild);
            }
            showLoader();

            fetch(`${url}?skip=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("ERROR");
                })
                .then((data) => {
                    const products = data.products;
                    renderPage(currentPage, products);
                    updatePageLinks();
                })
                .finally(() => {
                    closeLoader();
                })
        }
    });

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        ul.appendChild(li);

        const a = document.createElement("a");
        a.classList.add("page-link");
        a.href = "#";
        a.textContent = i;
        if (i === currentPage) {
            a.classList.add("active");
        }
        li.appendChild(a);

        a.addEventListener("click", (event) => {
            event.preventDefault();
            currentPage = i;
            const productsDiv = document.getElementById("products");
            while (productsDiv.firstChild) {
                productsDiv.removeChild(productsDiv.firstChild);
            }
            showLoader();

            fetch(`${url}?skip=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("ERROR");
                })
                .then((data) => {
                    const products = data.products;
                    renderPage(currentPage, products);
                    updatePageLinks();
                })
                .finally(() => {
                    closeLoader();
                })
        })

    }

    const nextLi = document.createElement("li");
    nextLi.classList.add("page-item");
    ul.appendChild(nextLi);

    const nextA = document.createElement("a");
    nextA.classList.add("page-link");
    nextA.href = "#";
    nextA.textContent = "Next";
    nextLi.appendChild(nextA);

    nextA.addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            const productsDiv = document.getElementById("products");
            while (productsDiv.firstChild) {
                productsDiv.removeChild(productsDiv.firstChild);
            }
            showLoader();

            fetch(`${url}?skip=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("ERROR");
                })
                .then((data) => {
                    const products = data.products;
                    renderPage(currentPage, products);
                    updatePageLinks();
                })
                .finally(() => {
                    closeLoader();
                })
        }
    });

    function updatePageLinks() {
        const pageLinks = document.querySelectorAll(".page-link");
        pageLinks.forEach((link) => {
            if (parseInt(link.textContent) === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
}


function renderPage(page, products) {
    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;
    const productsDiv = document.getElementById("products");
    const usersContent = userContainer(products, skip, take);
    productsDiv.appendChild(usersContent);
}

// burger menu

let mobileMenu = document.querySelector(".navigation_ul");
let burger = document.querySelector(".fa-list");
let xmark = document.querySelector(".fa-circle-xmark");

burger.addEventListener("click", function () {
    mobileMenu.classList.add("show1");
    burger.style.display = "none";
    xmark.style.display = "block"
})

xmark.addEventListener("click", function () {
    mobileMenu.classList.remove("show1");
    burger.style.display = "block";
    xmark.style.display = "none"
})




// loader 

function showLoader() {
    loader.classList.add("show2");
}
function closeLoader() {
    loader.classList.remove("show2");
}