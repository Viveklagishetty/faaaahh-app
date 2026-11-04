const dishes = [
  {
    name: "Green goddess bowl",
    category: "bowls",
    description: "Avocado, garden greens, grains & herby dressing",
    price: 329,
    rating: "4.9",
    tag: "Fresh favorite",
    image: "photo-1512621776951-a57141f2eefd"
  },
  {
    name: "Stackly smash burger",
    category: "burgers",
    description: "Double smash patty, aged cheddar & house sauce",
    price: 389,
    rating: "4.8",
    tag: "Local favorite",
    image: "photo-1568901346375-23c9450c58cd"
  },
  {
    name: "Garden pesto pizza",
    category: "pizza",
    description: "Stone-baked crust, basil pesto & creamy mozzarella",
    price: 449,
    rating: "4.9",
    tag: "Baked to order",
    image: "photo-1571407970349-bc81e7e96d47"
  },
  {
    name: "Berry cloud pancakes",
    category: "dessert",
    description: "Fluffy buttermilk stacks with berries & maple",
    price: 259,
    rating: "4.7",
    tag: "A sweet one",
    image: "photo-1528207776546-365bb710ee93"
  },
  {
    name: "Crispy tofu crunch bowl",
    category: "bowls",
    description: "Golden tofu, crunchy greens & sesame dressing",
    price: 299,
    rating: "4.8",
    tag: "Plant-powered",
    image: "photo-1546069901-ba9599a7e63c"
  },
  {
    name: "Sunday pepperoni",
    category: "pizza",
    description: "Slow-fermented dough, tomato & spicy pepperoni",
    price: 499,
    rating: "4.9",
    tag: "Kitchen pick",
    image: "photo-1513104890138-7c749659a591"
  },
  {
    name: "Golden hour fries",
    category: "burgers",
    description: "Crispy potato fries with a smoky dipping sauce",
    price: 189,
    rating: "4.6",
    tag: "Sidekick",
    image: "photo-1573080496219-bb080dd4f877"
  },
  {
    name: "Chocolate melt cake",
    category: "dessert",
    description: "Warm dark chocolate cake with vanilla cream",
    price: 279,
    rating: "4.8",
    tag: "Treat yourself",
    image: "photo-1606313564200-e75d5e30476c"
  }
];

const foodGrid = document.querySelector("#food-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#food-search");
const toast = document.querySelector("#toast");
let selectedCategory = "all";
let cartItems = 0;
let toastTimer;
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" })
  : null;

function observeReveals(root = document) {
  const selector = ".section-heading, .food-card, .about-copy, .about-visual, .promo-photo-wrap, .promo-copy, .contact-copy, .contact-form, .newsletter-inner, .footer-cta, .footer-brand-block, .footer-column, .footer-note";
  const revealItems = [...root.querySelectorAll(selector)];
  if (root.nodeType === 1 && root.matches(selector)) revealItems.unshift(root);
  revealItems.forEach((item, index) => {
    if (item.classList.contains("reveal-ready")) return;
    item.classList.add("reveal-ready");
    item.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    if (revealObserver) revealObserver.observe(item);
    else item.classList.add("is-visible");
  });
}

function renderDishes() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === "all" || dish.category === selectedCategory;
    const searchable = `${dish.name} ${dish.description} ${dish.category}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  foodGrid.innerHTML = visibleDishes.map((dish) => `
    <article class="food-card">
      <div class="food-image-wrap">
        <img class="food-image" src="https://images.unsplash.com/${dish.image}?auto=format&fit=crop&w=3840&q=90" alt="${dish.name}" loading="lazy">
        <span class="food-tag">${dish.tag}</span>
      </div>
      <div class="food-info">
        <div class="food-title-row"><h3>${dish.name}</h3><span class="food-rating">★ ${dish.rating}</span></div>
        <p class="food-description">${dish.description}</p>
        <div class="food-meta"><span class="food-price">₹${dish.price}</span><button class="add-button" type="button" data-add="${dish.name}" aria-label="Add ${dish.name} to cart">＋ Add</button></div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visibleDishes.length > 0;
  observeReveals(foodGrid);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

if (foodGrid) {
  document.querySelectorAll(".category-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      document.querySelectorAll(".category-chip").forEach((chip) => {
        const active = chip === button;
        chip.classList.toggle("active", active);
        chip.setAttribute("aria-pressed", String(active));
      });
      renderDishes();
    });
  });

  searchInput.addEventListener("input", renderDishes);
  document.querySelector("#hero-search").addEventListener("submit", (event) => {
    event.preventDefault();
    selectedCategory = "all";
    document.querySelectorAll(".category-chip").forEach((chip) => {
      const active = chip.dataset.category === "all";
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    renderDishes();
    document.querySelector("#order-online").scrollIntoView({ behavior: "smooth" });
  });

  foodGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");
    if (!addButton) return;
    cartItems += 1;
    document.querySelector("#cart-count").textContent = String(cartItems);
    showToast(`${addButton.dataset.add} added to your bag.`);
  });

  document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Thanks for subscribing. Look out for a little something from Stackly.");
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("#nav-links");
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("is-open", !expanded);
  });
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
  document.querySelectorAll(".category-chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.classList.contains("active")));
  });
  document.querySelector("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.reset();
    showToast("Thanks for reaching out. We’ll be in touch soon.");
  });
  observeReveals();
  renderDishes();
}

document.querySelectorAll(".auth-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const password = form.querySelector('[name="password"]');
    const confirmation = form.querySelector('[name="confirm-password"]');
    if (confirmation && password.value !== confirmation.value) {
      confirmation.setCustomValidity("Passwords do not match.");
      confirmation.reportValidity();
      confirmation.addEventListener("input", () => confirmation.setCustomValidity(""), { once: true });
      return;
    }
    if (form.dataset.auth === "login") {
      window.location.assign("index.html");
      return;
    }
    showToast("Your form is ready to connect to an account service.");
  });
});

window.setTimeout(() => document.querySelector("#page-loader").classList.add("is-hidden"), 500);
