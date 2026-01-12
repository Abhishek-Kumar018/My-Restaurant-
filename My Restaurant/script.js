let orderList = {};
let total = 0;
let userLocation = "";

// Add item to order
function addToOrder(item, price) {
  if (orderList[item]) {
    orderList[item].qty += 1;
  } else {
    orderList[item] = { price: price, qty: 1 };
  }
  total += price;
  displayOrder();
}

// Display order
function displayOrder() {
  let orderListEl = document.getElementById("orderList");
  orderListEl.innerHTML = "";
  for (let item in orderList) {
    let li = document.createElement("li");
    li.innerHTML = `${item} (x${orderList[item].qty}) - ₹${orderList[item].price * orderList[item].qty} 
      <button onclick="removeItem('${item}')">❌</button>`;
    orderListEl.appendChild(li);
  }
  document.getElementById("total").textContent = total;
}

// Remove item
function removeItem(item) {
  if (orderList[item]) {
    total -= orderList[item].price * orderList[item].qty;
    delete orderList[item];
    displayOrder();
  }
}

// Reset order (internal use)
function resetOrder() {
  orderList = {};
  total = 0;
  displayOrder();
  document.getElementById("choiceSection").classList.add("hidden");
  document.getElementById("deliveryForm").classList.add("hidden");
  userLocation = ""; // Reset location after order
}

// Cancel order
function cancelOrder() {
  resetOrder();
  alert("Order cancelled!");
}

// Place order
function placeOrder() {
  if (total === 0) {
    alert("Please add items before placing an order.");
    return;
  }
  document.getElementById("choiceSection").classList.remove("hidden");
}

// Eat in restaurant
function eatInRestaurant() {
  alert("✅ Order placed successfully! Enjoy your meal at our restaurant!");
  resetOrder();
}

// Show delivery form
function showDeliveryForm() {
  document.getElementById("deliveryForm").classList.remove("hidden");
}

// Get live location
function getLocation() {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation = `Lat: ${pos.coords.latitude.toFixed(6)}, Lon: ${pos.coords.longitude.toFixed(6)}`;
        alert("📍 Location Captured Successfully!");
        console.log("Location:", userLocation);
      },
      (err) => {
        let errMsg = "Error capturing location: ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errMsg += "User denied the request for Geolocation.";
            break;
          case err.POSITION_UNAVAILABLE:
            errMsg += "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errMsg += "The request to get user location timed out.";
            break;
          case err.UNKNOWN_ERROR:
            errMsg += "An unknown error occurred.";
            break;
        }
        alert(errMsg);
      },
      options
    );
  } else {
    alert("Geolocation not supported by this browser!");
  }
}

// Confirm delivery
document.getElementById("deliveryDetails").addEventListener("submit", function (e) {
  e.preventDefault();
  let name = document.getElementById("custName").value;
  let phone = document.getElementById("custPhone").value;
  let door = document.getElementById("custDoor").value;
  let address = document.getElementById("custAddress").value;

  if (!name || !phone || !door || !address) {
    alert("Please fill all details!");
    return;
  }

  alert(`✅ Order Confirmed!\n\n📦 Delivery for: ${name}\n📞 ${phone}\n🏠 ${door}, ${address}\n📍 ${userLocation || "Not Provided"}\n💰 Total: ₹${total}`);
  resetOrder();
});
