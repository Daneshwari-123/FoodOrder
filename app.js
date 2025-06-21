document.addEventListener("DOMContentLoaded", function () {
  const foodPrices = {
    breakfast: {
      "Single Idli": 25,
      "Idli Plate": 40,
      "Single Vada": 25,
      "Vada Plate": 40
    },
    lunch: {
      "Thali": 125,
      "Curd Rice": 40,
      "Chapati Sabji": 25,
      "Special Rice Meals": 40
    },
    dinner: {
      "North Indian Thali": 25,
      "Paneer Butter Masala": 40,
      "Veg Manchow Soup": 25,
      "Paneer Pepper Fry": 40
    }
  };

  const path = window.location.pathname.toLowerCase();

  // Menu Pages (breakfast/lunch/dinner)
  if (path.includes("breakfast") || path.includes("lunch") || path.includes("dinner")) {
    let menuType = null;
    if (path.includes("breakfast")) menuType = "breakfast";
    if (path.includes("lunch")) menuType = "lunch";
    if (path.includes("dinner")) menuType = "dinner";

    const prices = foodPrices[menuType];

    // Show prices
    const h2s = document.querySelectorAll("h2");
    h2s.forEach(h2 => {
      const itemName = h2.textContent.trim();
      const price = prices[itemName];
      if (price !== undefined) {
        const priceTag = document.createElement("p");
        priceTag.textContent = `Rs. ${price}`;
        priceTag.style.fontWeight = "bolder";
        priceTag.style.margin = "5px 0";
        h2.insertAdjacentElement("afterend", priceTag);
      }
    });

    // Add button
    document.querySelectorAll(".add").forEach(button => {
      button.addEventListener("click", function () {
        const container = this.closest(".menu-items");
        const itemName = container.querySelector("h2").textContent.trim();
        const price = prices[itemName];
        if (!itemName || price === undefined) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.name === itemName);

        let finalQuantity = 1;
        if (existing) {
          existing.quantity += 1;
          finalQuantity = existing.quantity;
        } else {
          cart.push({ name: itemName, price: price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        const quantityPara = container.querySelector(".quantity");
        quantityPara.textContent = `Quantity: ${finalQuantity}`;
      });
    });

    // Remove button
    document.querySelectorAll(".remove").forEach(button => {
      button.addEventListener("click", function () {
        const container = this.closest(".menu-items");
        const itemName = container.querySelector("h2").textContent.trim();
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const index = cart.findIndex(item => item.name === itemName);

        let finalQuantity = 0;

        if (index !== -1) {
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            finalQuantity = cart[index].quantity;
          } else {
            cart.splice(index, 1);
          }
          localStorage.setItem("cart", JSON.stringify(cart));
        }

        const quantityPara = container.querySelector(".quantity");
        quantityPara.textContent = `Quantity: ${finalQuantity}`;
      });
    });
  }

  // Cart Page
  if (path.includes("cart")) {
    const cartItemList = document.getElementById("cart-items");
    const totalSpan = document.getElementById("total");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x ${item.quantity} = Rs.${item.price * item.quantity}`;
      cartItemList.appendChild(li);
      total += item.price * item.quantity;
    });

    totalSpan.textContent = total;

    const printButton = document.getElementById("getPrint");
    if (printButton) {
      printButton.addEventListener("click", function () {
        localStorage.removeItem("cart");
      });
    }
  }
});
