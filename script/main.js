// Функция для получения данных продуктов из HTML
function getProductsFromHTML() {
	const productElements = document.querySelectorAll(".product-item");
	const products = [];

	productElements.forEach((element) => {
		products.push({
			id: parseInt(element.dataset.id),
			name: element.dataset.name,
			price: parseInt(element.dataset.price),
			image: element.dataset.image,
			hoverImage: element.dataset.hoverImage || element.dataset.image, // Используем основное изображение, если hoverImage отсутствует
			category: element.dataset.category,
			description: element.dataset.description,
		});
	});

	return products;
}

// Глобальная переменная для хранения продуктов
let products = [];

// Функция для отображения продуктов
function displayProducts(category = "all") {
	const productsGrid = document.getElementById("productsGrid");
	if (!productsGrid) {
		console.error("Element #productsGrid not found");
		return;
	}
	productsGrid.innerHTML = "";

	const filteredProducts =
		category === "all"
			? products
			: products.filter((product) => product.category === category);

	filteredProducts.forEach((product) => {
		const productCard = document.createElement("div");
		productCard.className = "product-card";
		productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" data-hover-image="${product.hoverImage}">
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

		// Добавляем обработчики для смены изображения при наведении
		const productImage = productCard.querySelector(".product-image");
		if (productImage && product.hoverImage) {
			productCard.addEventListener("mouseenter", () => {
				productImage.src = product.hoverImage;
			});
			productCard.addEventListener("mouseleave", () => {
				productImage.src = product.image;
			});
		}
	});
}

// Мобильное меню
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

// Проверка существования элементов перед добавлением обработчиков
if (menuToggle && mobileMenu) {
	menuToggle.addEventListener("click", () => {
		const isMenuVisible = mobileMenu.style.display === "block";
		mobileMenu.style.display = isMenuVisible ? "none" : "block";

		// Добавляем/удаляем класс для анимации
		if (!isMenuVisible) {
			mobileMenu.style.opacity = "0";
			mobileMenu.style.transform = "translateY(-10px)";
			setTimeout(() => {
				mobileMenu.style.opacity = "1";
				mobileMenu.style.transform = "translateY(0)";
			}, 10);
		}
	});
}

// Категории каталога
document.addEventListener("DOMContentLoaded", () => {
	// Загружаем продукты из HTML
	products = getProductsFromHTML();

	// Отображаем все продукты при загрузке
	displayProducts("all");

	const categoryButtons = document.querySelectorAll(".category-btn");

	categoryButtons.forEach((button) => {
		button.addEventListener("click", () => {
			// Удалить активный класс со всех кнопок
			categoryButtons.forEach((btn) => btn.classList.remove("active"));

			// Добавить активный класс к нажатой кнопке
			button.classList.add("active");

			// Получить категорию и отобразить продукты
			const category = button.getAttribute("data-category");
			displayProducts(category);
		});
	});

	// Обработчик для кнопки "Заказать звонок"
	const callbackBtn = document.querySelector(".callback-btn");
	if (callbackBtn) {
		callbackBtn.addEventListener("click", (e) => {
			e.preventDefault();
			const contactsSection = document.getElementById("contacts");
			if (contactsSection) {
				window.scrollTo({
					top: contactsSection.offsetTop - 80,
					behavior: "smooth",
				});
			}
		});
	}
});

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();

		const targetId = this.getAttribute("href");
		const targetElement = document.querySelector(targetId);

		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop - 80,
				behavior: "smooth",
			});

			// Скрыть мобильное меню при клике на ссылку
			if (mobileMenu && mobileMenu.style.display === "block") {
				mobileMenu.style.display = "none";
			}
		}
	});
});

// Обработка формы
const contactForm = document.getElementById("contactForm");

if (contactForm) {
	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Получаем данные формы
		const formData = new FormData(contactForm);
		const name = formData.get("name");
		const email = formData.get("email");
		const message = formData.get("message");

		// Формируем текст сообщения для Telegram
		const telegramMessage = `
*Новое сообщение с сайта LINEN HOUSE*

👤 Имя: ${name}
📧 Email: ${email}
💬 Сообщение: ${message}

---
Дата: ${new Date().toLocaleString("ru-RU")}
`;

		// Ваш Telegram Bot Token (замените на реальный)
		const botToken = "YOUR_BOT_TOKEN_HERE";
		// Ваш Chat ID (замените на реальный)
		const chatId = "YOUR_CHAT_ID_HERE";

		// Проверяем, что токен и chat ID заданы
		if (botToken === "YOUR_BOT_TOKEN_HERE" || chatId === "YOUR_CHAT_ID_HERE") {
			alert(
				"Пожалуйста, настройте Telegram Bot Token и Chat ID в коде main.js"
			);
			return;
		}

		try {
			const response = await fetch(
				`https://api.telegram.org/bot${botToken}/sendMessage`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						chat_id: chatId,
						text: telegramMessage,
						parse_mode: "Markdown",
					}),
				}
			);

			const result = await response.json();

			if (result.ok) {
				alert("Спасибо за заявку! Мы свяжемся с вами в ближайшее время.");
				contactForm.reset();
			} else {
				alert("Ошибка при отправке сообщения. Попробуйте позже.");
				console.error("Telegram API error:", result);
			}
		} catch (error) {
			alert("Ошибка при отправке сообщения. Попробуйте позже.");
			console.error("Fetch error:", error);
		}
	});
}

// Закрытие мобильного меню при клике вне его
document.addEventListener("click", (e) => {
	if (mobileMenu && menuToggle) {
		if (
			mobileMenu.style.display === "block" &&
			!mobileMenu.contains(e.target) &&
			e.target !== menuToggle &&
			!menuToggle.contains(e.target)
		) {
			mobileMenu.style.display = "none";
		}
	}
});

// Закрытие мобильного меню при изменении размера окна
window.addEventListener("resize", () => {
	if (mobileMenu) {
		if (window.innerWidth > 768) {
			mobileMenu.style.display = "none";
		}
	}
});

// Добавляем обработчики для кнопок в hero секции
document.addEventListener("DOMContentLoaded", () => {
	const btnPrimary = document.querySelector(".btn-primary");
	const btnSecondary = document.querySelector(".btn-secondary");

	if (btnPrimary) {
		btnPrimary.addEventListener("click", (e) => {
			e.preventDefault();
			const catalogSection = document.getElementById("catalog");
			if (catalogSection) {
				window.scrollTo({
					top: catalogSection.offsetTop - 80,
					behavior: "smooth",
				});
			}
		});
	}

	if (btnSecondary) {
		btnSecondary.addEventListener("click", (e) => {
			e.preventDefault();
			const aboutSection = document.getElementById("about");
			if (aboutSection) {
				window.scrollTo({
					top: aboutSection.offsetTop - 80,
					behavior: "smooth",
				});
			}
		});
	}
});
