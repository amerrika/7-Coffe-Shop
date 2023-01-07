// Elements
const buttonsMinus = document.getElementsByClassName("btn-minus");
const buttonsPlus = document.getElementsByClassName("btn-plus");
const buttonsAdd = document.getElementsByClassName("btn-add");
const buttonPurchase = document.querySelector(".btn-purchase");
const shopItemHeadings = document.getElementsByClassName("shop-item__heading");
const cartItemHeadings = document.getElementsByClassName("cart-item__heading");

// Button Minus: decrease quantity by one, if quantity < 1 remove item, update total payment
for (let i = 0; i < buttonsMinus.length; i++) {
  const button = buttonsMinus[i];
  button.addEventListener("click", buttonMinusClicked);
}

// Button Plus: increase quantity by one, update total payment
for (let i = 0; i < buttonsPlus.length; i++){
  const button = buttonsPlus[i];
  button.addEventListener("click", buttonPlusClicked)
}

// Adding item to the cart
for(let i = 0; i < buttonsAdd.length; i++){
  const button = buttonsAdd[i];
  button.addEventListener("click", buttonAddClicked)
}

// Button Purchase (Buy Now)
buttonPurchase.addEventListener("click", buttonPurchaseClicked);


// Functions //

function buttonPurchaseClicked(){
  alert("Thank you for your purchase");
  const cartItems = document.querySelector(".cart__menu");
  while(cartItems.hasChildNodes()){
    cartItems.removeChild(cartItems.firstChild); // it will contnuely loop and remove items until it is empty
  }
  updateTotalPayment();
}

function buttonPlusClicked(event){
  const button = event.target;
  const quantityEl = button.parentElement.parentElement.querySelector(".cart-item-quantity");
  let quantity = Number(quantityEl.innerText);
  quantity = quantity + 1;
  quantityEl.innerText = quantity;
  updateTotalPayment()
}

function buttonMinusClicked(event){
  const button = event.target;
  const quantityEl = button.parentElement.parentElement.querySelector(".cart-item-quantity");
  let quantity = Number(quantityEl.innerText);
  quantity = quantity - 1;
  quantityEl.innerText = quantity;

  if (quantity < 1) {
    // Remove item and update total payment
    quantityEl.parentElement.parentElement.remove();
    updateTotalPayment();
  } else {
    // ako se npr sa broja 3 količina smanji na 2, nema uklanjanja ali potreban total payment update
    updateTotalPayment(); 
  }
}

function updateTotalPayment() {
  const cartItemsContainer = document.querySelector(".cart__menu");
  const cartItems = cartItemsContainer.getElementsByClassName("cart-item"); 
  let total = 0; // total definišem ovdje jer svaki put kad se pozove funkcija total treba biti 0, da bi funkcija od ostalih cart-item stavki izračunala total
  let priceTotal = 0;
  let tax = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    // Preuzimam cijenu is shop sekcije: heading cart item-a === heading shop item-a
    const cartItemHeading = cartItem.querySelector(".cart-item__heading");

    for(let i = 0; i < shopItemHeadings.length; i++){
      const shopItemHeading = shopItemHeadings[i];
      if(shopItemHeading.innerText === cartItemHeading.innerText){
        const price = Number(shopItemHeading.parentElement.querySelector(".shop-item-price").innerText.replace("$", ""))
        const itemQuantity = Number(
          cartItem.querySelector(".cart-item-quantity").innerText
        );
        total = total + itemQuantity * price;
        tax = (total * 17) / 117;
        priceTotal = total - tax;
      }
    }
  }
  document.querySelector(".total-payment").textContent = "$" + total.toFixed(2);
  document.querySelector(".price").textContent = "$" + priceTotal.toFixed(2);
  document.querySelector(".tax").textContent = "$" + tax.toFixed(2);
}

function buttonAddClicked(event){
  const button = event.target;
  const shopItem = button.parentElement.parentElement.parentElement;
  const itemPriceEl = shopItem.querySelector(".shop-item-price").textContent;

  const itemLogo = shopItem.querySelector(".shop-item-logo").src;
  const itemPrice = parseFloat(itemPriceEl.replace("$", ""));
  const titleBig = shopItem.querySelector(".shop-item__heading--big").innerText;
  const titleSmall = shopItem.querySelector(".shop-item__heading--small").innerText;
  const shopItemHeading = shopItem.querySelector(".shop-item__heading").innerText;

  itemAddedtoCart(itemLogo, titleBig, titleSmall, shopItemHeading);
  updateTotalPayment();
}

function itemAddedtoCart(logo, titleBig, titleSmall, shopItemHeading){
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  const cartMenu = document.querySelector(".cart__menu");
  // Ako je item već u korpi ne možemo ga ponovo dodati, upoređujemo headings item-a iz shop sekcije i cart sekcije
  for(let i = 0; i < cartItemHeadings.length; i++) {
    if(shopItemHeading == cartItemHeadings[i].innerText){
      alert("The item is already in the cart");
      return
    }
  }

  const cartItemContents = `
    <img src="${logo}" alt="logo" class="cart-item-logo">
    <h3 class="cart-item__heading">
      <span class="cart-item__heading--big">${titleBig}</span>
      <span class="cart-item__heading--small">${titleSmall}</span>
    </h3>
    <div class="cart-item__quantity">
      <button class="btn btn-plus"><i class="fa-sharp fa-solid fa-circle-plus"></i></button>
      <p class="cart-item-quantity">1</p>
      <button class="btn btn-minus"><i class="fa-sharp fa-solid fa-circle-minus"></i></button>
    </div>
  `
  cartItem.innerHTML = cartItemContents;
  cartMenu.append(cartItem);

  cartItem.querySelector(".btn-minus").addEventListener("click", buttonMinusClicked); // za ovaj dio sam pogledo u kod tutorijala
  cartItem.querySelector(".btn-plus").addEventListener("click", buttonPlusClicked); 
}
