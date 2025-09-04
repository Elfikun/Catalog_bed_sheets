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
	contactForm.addEventListener("submit", (e) => {
		e.preventDefault();

		// Здесь можно добавить логику отправки формы
		alert("Спасибо за заявку! Мы свяжемся с вами в ближайшее время.");
		contactForm.reset();
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
