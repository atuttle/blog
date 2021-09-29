'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const search = document.querySelector('#filterText');

	search.addEventListener('keyup', () => {
		applyFilters();
	});
});

function applyFilters() {
	const search = document.querySelector('#filterText');
	const searchQ = search.value;

	const allArticles = document.querySelectorAll(`#index article`);

	if (searchQ.length === 0) {
		allArticles.forEach((el) => (el.style.display = 'block'));
		return;
	}

	const displayArticles = document.querySelectorAll(`#index article[data-title*="${searchQ.toLowerCase()}"]`);
	allArticles.forEach((el) => (el.style.display = 'none'));
	displayArticles.forEach((el) => (el.style.display = 'block'));
}
