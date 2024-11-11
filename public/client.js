const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  socket.on('newProduct', (data) => {
    console.log('Received event:', data);
    const productsList = document.getElementById("realtime-products");
    const productItem = document.createElement("li");
    productItem.textContent = `${data.title} - $${data.price} - ${data.description}`;
    productsList.appendChild(productItem);
    console.log('Received event:', );
    document.getElementById('message').textContent = data.message;
  });
});
