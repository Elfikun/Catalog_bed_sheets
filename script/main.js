// Функция для получения данных продуктов из HTML
function getProductsFromHTML() {
	const productElements = document.querySelectorAll(".product-item");
	const products = [];

	productElements.forEach((element) => {
		let galleryImages = [];
		try {
			galleryImages = JSON.parse(element.dataset.galleryImages || "[]");
		} catch (e) {
			console.error("Error parsing gallery images:", e);
		}

		products.push({
			id: parseInt(element.dataset.id),
			name: element.dataset.name,
			price: parseInt(element.dataset.price),
			image: element.dataset.image,
			hoverImage: element.dataset.hoverImage || element.dataset.image,
			galleryImages:
				galleryImages.length > 0 ? galleryImages : [element.dataset.image],
			category: element.dataset.category,
			description: element.dataset.description,
			detailedDescription:
				element.dataset.detailedDescription || element.dataset.description,
			characteristics: element.dataset.characteristics
				? JSON.parse(element.dataset.characteristics)
				: {},
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
			<div class="product-image-container">
				<img src="${product.image}" alt="${product.name}" class="product-image main-image">
				<img src="${product.hoverImage}" alt="${product.name}" class="product-image hover-image">
			</div>
			<div class="product-content">
				<h3 class="product-title">${product.name}</h3>
				<p class="product-description">${product.description}</p>
				<div class="product-footer">
					<span class="product-price">${product.price} ₽</span>
					<button class="product-btn" data-product-id="${product.id}">Подробнее</button>
				</div>
			</div>
		`;
		productsGrid.appendChild(productCard);

		// Обработчик для кнопки "Подробнее"
		const detailsBtn = productCard.querySelector(".product-btn");
		if (detailsBtn) {
			detailsBtn.addEventListener("click", () => {
				showProductModal(product);
			});
		}
	});
}

// Функция для показа модального окна
function showProductModal(product) {
	const modal = document.getElementById("productModal");
	if (!modal) {
		console.error("Modal #productModal not found");
		return;
	}

	const title = modal.querySelector(".modal-title");
	const gallery = modal.querySelector(".modal-gallery");
	const dots = modal.querySelector(".gallery-dots");
	const description = modal.querySelector(".modal-description");
	const characteristicsList = modal.querySelector(".modal-characteristics ul");
	const price = modal.querySelector(".modal-price");

	title.textContent = product.name;
	gallery.innerHTML = product.galleryImages
		.map(
			(img) => `
		<img src="${img}" alt="${product.name}" class="gallery-image" loading="lazy">
	`
		)
		.join("");
	dots.innerHTML = product.galleryImages
		.map(
			(_, index) => `
		<span class="gallery-dot" data-index="${index}" aria-label="Перейти к изображению ${
				index + 1
			}"></span>
	`
		)
		.join("");
	description.textContent = product.detailedDescription;
	characteristicsList.innerHTML = Object.entries(product.characteristics)
		.map(
			([key, value]) => `
		<li><strong>${key}:</strong> ${value}</li>
	`
		)
		.join("");
	price.textContent = `${product.price} ₽`;

	modal.style.display = "flex";

	const closeBtn = modal.querySelector(".modal-close");
	closeBtn.addEventListener("click", () => {
		modal.style.display = "none";
	});

	modal.addEventListener("click", (e) => {
		if (e.target === modal) {
			modal.style.display = "none";
		}
	});

	document.addEventListener(
		"keydown",
		(e) => {
			if (e.key === "Escape" && modal.style.display === "flex") {
				modal.style.display = "none";
			}
		},
		{ once: true }
	);

	const prevBtn = modal.querySelector(".gallery-prev");
	const nextBtn = modal.querySelector(".gallery-next");
	if (gallery && prevBtn && nextBtn) {
		// Скрываем кнопки, если изображений 2 или меньше
		if (product.galleryImages.length <= 2) {
			prevBtn.style.display = "none";
			prevBtn.setAttribute("aria-hidden", "true");
			nextBtn.style.display = "none";
			nextBtn.setAttribute("aria-hidden", "true");
			dots.style.display = "none";
		} else {
			prevBtn.style.display = "";
			prevBtn.removeAttribute("aria-hidden");
			nextBtn.style.display = "";
			nextBtn.removeAttribute("aria-hidden");
			dots.style.display = "";
			prevBtn.addEventListener("click", () => {
				gallery.scrollBy({ left: -300, behavior: "smooth" });
			});
			nextBtn.addEventListener("click", () => {
				gallery.scrollBy({ left: 300, behavior: "smooth" });
			});
		}
	}

	const dotElements = modal.querySelectorAll(".gallery-dot");
	if (dotElements.length > 0) {
		const updateActiveDot = () => {
			const scrollLeft = gallery.scrollLeft;
			const imageWidth =
				gallery.querySelector(".gallery-image").offsetWidth + 10;
			const activeIndex = Math.round(scrollLeft / imageWidth);
			dotElements.forEach((dot, index) => {
				dot.classList.toggle("active", index === activeIndex);
				dot.setAttribute(
					"aria-current",
					index === activeIndex ? "true" : "false"
				);
			});
		};

		gallery.addEventListener("scroll", updateActiveDot);
		updateActiveDot();
	}
}

// Мобильное меню
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
	menuToggle.addEventListener("click", () => {
		mobileMenu.classList.toggle("active");
	});
}

document.addEventListener("click", (e) => {
	if (
		e.target.dataset.closeMenu &&
		mobileMenu &&
		mobileMenu.classList.contains("active")
	) {
		mobileMenu.classList.remove("active");
	}
});

// Категории каталога
document.addEventListener("DOMContentLoaded", () => {
	products = getProductsFromHTML();
	displayProducts("all");

	const categoryButtons = document.querySelectorAll(".category-btn");
	categoryButtons.forEach((button) => {
		button.addEventListener("click", () => {
			categoryButtons.forEach((btn) => btn.classList.remove("active"));
			button.classList.add("active");
			const category = button.getAttribute("data-category");
			displayProducts(category);
		});
	});

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

// Обработка ссылок для закрытия мобильного меню
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", () => {
		if (mobileMenu && mobileMenu.classList.contains("active")) {
			mobileMenu.classList.remove("active");
		}
	});
});

// Обработка формы
const contactForm = document.getElementById("contactForm");

if (contactForm) {
	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = new FormData(contactForm);
		const name = formData.get("name");
		const email = formData.get("email");
		const message = formData.get("message");

		const telegramMessage = `
*Новое сообщение с сайта LINEN HOUSE*

👤 Имя: ${name}
📧 Email: ${email}
💬 Сообщение: ${message}

---
Дата: ${new Date().toLocaleString("ru-RU")}
`;

		const botToken = "YOUR_BOT_TOKEN_HERE";
		const chatId = "YOUR_CHAT_ID_HERE";

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

// Закрытие мобильного меню при изменении размера окна
window.addEventListener("resize", () => {
	if (mobileMenu && window.innerWidth > 768) {
		mobileMenu.classList.remove("active");
	}
});

// Обработчики кнопок в hero-секции
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
