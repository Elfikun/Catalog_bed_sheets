// Массив продуктов
const products = [
	{
		id: 1,
		name: "Премиум простыня",
		price: 2800,
		image: "https://placehold.co/300x300/f8f6f3/e2e0dd?text=Простыня",
		category: "sheets",
		description: "100% хлопок, плотность 200 г/м², размер 200x220 см",
	},
	{
		id: 2,
		name: "Льняная простыня",
		price: 3500,
		image: "https://placehold.co/300x300/ece9e6/d6d3d0?text=Лен",
		category: "sheets",
		description: "Натуральный лен, легкая текстура, размер 180x200 см",
	},
	{
		id: 3,
		name: "Подушка Memory Foam",
		price: 1800,
		image: "https://placehold.co/300x300/f5f3f0/e0ddd9?text=Подушка",
		category: "pillows",
		description: "Ортопедическая подушка с эффектом памяти, 50x70 см",
	},
	{
		id: 4,
		name: "Шелковая подушка",
		price: 2200,
		image: "https://placehold.co/300x300/f9f7f4/e3e1dd?text=Шелк",
		category: "pillows",
		description: "Наполнение шелковыми волокнами, чехол из шелка 22 мкм",
	},
	{
		id: 5,
		name: "Облегченное одеяло",
		price: 3200,
		image: "https://placehold.co/300x300/f2efe9/dcd8d2?text=Одеяло",
		category: "blankets",
		description: "Наполнитель холлофайбер, вес 1.2 кг, размер 140x205 см",
	},
	{
		id: 6,
		name: "Зимнее одеяло",
		price: 4500,
		image: "https://placehold.co/300x300/eae7e1/d4d0cb?text=Зимнее",
		category: "blankets",
		description: "Натуральный пух, двойной слой, размер 160x210 см",
	},
	{
		id: 7,
		name: 'Комплект "Роскошь"',
		price: 6800,
		image: "https://placehold.co/300x300/f7f5f1/e1deda?text=Комплект",
		category: "sets",
		description: "Простыня, пододеяльник, 2 наволочки, 100% хлопок",
	},
	{
		id: 8,
		name: "Банный комплект",
		price: 2400,
		image: "https://placehold.co/300x300/f0ede9/dad6d1?text=Полотенца",
		category: "towels",
		description: "2 полотенца 70x140 см, 1 банное 90x170 см, хлопок 100%",
	},
];

// Функция для отображения продуктов
function displayProducts(category = "all") {
	const productsGrid = document.getElementById("productsGrid");
	productsGrid.innerHTML = "";

	const filteredProducts =
		category === "all"
			? products
			: products.filter((product) => product.category === category);

	filteredProducts.forEach((product) => {
		const productCard = document.createElement("div");
		productCard.className = "product-card";
		productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price} ₽</span>
                    <button class="product-btn">Подробнее</button>
                </div>
            </div>
        `;
		productsGrid.appendChild(productCard);
	});
}

// Инициализация продуктов при загрузке
document.addEventListener("DOMContentLoaded", () => {
	displayProducts("all");
});
