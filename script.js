import { productsData } from "./products.js";

const productsCenter = document.querySelector(".products-center");

const cartItemCount = document.querySelector(".cart-itemCount");
const cartBtn = document.querySelector(".cart-btn");
const confirmBtn = document.querySelector(".confirm-cart");
const clearBtn = document.querySelector(".clear-cart");

const cartTotal = document.querySelector(".cart-total");

const cartCenter = document.querySelector(".cart-center");
const cartContent = document.querySelector(".cart-content");

const message = document.querySelector(".message");

let cart;
let buttonsDom = [];
// ----------------------------
class Products {
  getProducts() {
    // get from api end point
    return productsData;
  }
}
class UI {
  // create products
  displayProducts(products) {
    const items = products
      .map((item) => {
        return `<section class="product">
            <div class="img-container">
              <img class="product-img" src=${item.img} alt="p-1" />
            </div>
            <div class="product-desc">
              <p class="product-title">product title : ${item.title}</p>
              <p class="product-price">$ ${item.price}</p>
            </div>
            <button class="add-to-cart" data-id=${item.id}>add to cart</button>
          </section>`;
      })
      .join("");
    productsCenter.innerHTML = items;
  }
  getAddToCartBtns() {
    const storage = new Storage();
    const ui = new UI();

    // get all add-to-cart buttons
    const buttons = document.querySelectorAll(".add-to-cart");
    buttonsDom = [...buttons];
    const btns = [...buttons];

    btns.forEach((btn) => {
      const id = btn.dataset.id;

      // get carts from localStorage || []
      cart = storage.getProductsFromCart();

      const cartItems = cart.find((p) => {
        return p.id === id;
      });

      if (cartItems) {
        btn.textContent = "In Cart";
        btn.disabled = true;
        btn.classList.add("in-cart");
      }

      btn.addEventListener("click", function (e) {
        message.style.display = "none";

        e.target.textContent = "In Cart";
        e.target.disabled = true;
        e.target.classList.add("in-cart");

        // get all products from localStorage
        const products = storage.getProducts();

        products.forEach((item) => {
          // find selected product
          if (item.id === id) {
            // add selected product to cart and add quantity to that product
            cart.push({ ...item, quantity: 1 });
          }
        });

        // add cart to storage
        storage.saveProductsToCart(cart);

        // update cart value
        ui.setCartValue(cart);

        // display cart items
        ui.displayCartItems(cart);
      });
    });
  }
  // create cart items
  displayCartItems(cart) {
    const cartItems = cart
      .map((c) => {
        return `<div class="cart-item" id=${c.id}>
      <img src=${c.img} class="cart-item-img" alt="" />
      <div class="cart-item-desc">
        <h4>${c.title}</h4>
        <h5>$${c.price}</h5>
      </div>
      <div class="cart-item_btns">
        <div class="cart-item-controller">
          <i class="fas fa-chevron-up" data-id=${c.id}></i>
          <p class="quantity">${c.quantity}</p>
          <i class="fas fa-chevron-down" data-id=${c.id}></i>
        </div>
        <i class="fas fa-trash" data-id=${c.id}></i>
      </div>
    </div>`;
      })
      .join("");
    cartContent.innerHTML = cartItems;
  }
  // set cart total price and cart items count
  setCartValue(cart) {
    let count = 0;
    const t = cart.reduce((total, value) => {
      count += value.quantity;
      return total + value.price * value.quantity;
    }, 0);

    cartItemCount.textContent = count;
    cartTotal.textContent = `total price : $${t.toFixed(2)}`;
  }
  // setup cart items and totals and items counter
  setupApp() {
    const storage = new Storage();
    // get cart from storage after loading
    cart = storage.getProductsFromCart(cart);
    // display cart items after loading
    this.displayCartItems(cart);
    // set cart value and item count after loading
    this.setCartValue(cart);
  }
  cartLogic() {
    // clear cart
    this.clearCart();
    //cart functionality

    const storage = new Storage();
    const ui = new UI();
    // const cartItem = document.querySelectorAll(".cart-item");
    // cartItem.forEach((item) => {
    cartContent.addEventListener("click", function (e) {
      const target = e.target;
      const id = target.dataset.id;
      // get item from cart from localSorage
      cart = storage.getProductsFromCart();
      const findItem = cart.find((cItem) => {
        return cItem.id === id;
      });
      if (target.classList.contains("fa-chevron-up")) {
        findItem.quantity++;
        // update cart value
        ui.setCartValue(cart);
        // save cart
        storage.saveProductsToCart(cart);
        // update cart item in ui
        target.nextElementSibling.textContent = findItem.quantity;
      } else if (target.classList.contains("fa-chevron-down")) {
        if (findItem.quantity > 1) {
          findItem.quantity--;
        }
        // update cart value
        ui.setCartValue(cart);
        // save cart
        storage.saveProductsToCart(cart);
        // update cart item in ui
        target.previousElementSibling.textContent = findItem.quantity;
      } else if (target.classList.contains("fa-trash")) {
        ui.removeItem(id);
        ui.displayCartItems(cart);
        if (cart.length === 0) {
          cartCenter.classList.remove("open-cart");
          message.style.display = "block";
        }
      }
    });
    // });
  }
  clearCart() {
    const ui = new UI();
    // clear cart
    clearBtn.addEventListener("click", function () {
      cart.forEach((item) => {
        ui.removeItem(item.id);
      });
      ui.displayCartItems(cart);
      cartCenter.classList.remove("open-cart");
      message.style.display = "block";
    });
  }
  removeItem(id) {
    const storage = new Storage();
    cart = cart.filter((item) => {
      return item.id !== id;
    });
    this.setCartValue(cart);
    storage.saveProductsToCart(cart);

    const btn = buttonsDom.find((btn) => {
      return btn.dataset.id === id;
    });
    btn.textContent = "add to cart";
    btn.disabled = false;
    btn.classList.remove("in-cart");
  }
}

class Storage {
  // save all products in localStorage
  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // get all products from localStorage
  getProducts() {
    return JSON.parse(localStorage.getItem("products"));
  }

  // save selected products in cart in localStorage
  saveProductsToCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // get selected products in cart from localStorage
  getProductsFromCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
// ----------------------------
document.addEventListener("DOMContentLoaded", function () {
  // get items after loading to display them
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new UI();
  ui.displayProducts(productsData);

  // access to btns after loading
  ui.getAddToCartBtns();

  // save products in localStorage after loading
  const storage = new Storage();
  storage.saveProducts(productsData);

  //set up cart after loading
  ui.setupApp();
  if (cart.length !== 0) {
    message.style.display = "none";
  }

  // everything that happens in cart
  ui.cartLogic();
});

// open cart
cartBtn.addEventListener("click", function () {
  cartCenter.classList.add("open-cart");
});

// close cart
confirmBtn.addEventListener("click", function () {
  cartCenter.classList.remove("open-cart");
});
