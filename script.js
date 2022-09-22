/**
 * Infographic class.
 */
function RvstdplnClass() {

	// MODEL ////////////

	let root;
	let timeline;
	let form;
	let activeStep = 0;
	let popup;

	// VIEW ////////////

	/**
	 * Pop-up
	 */
	function initPopup() {
		if (localStorage.getItem('popup') === null) {
			popup.classList.remove('rvstdpln-popup_hidden');
			localStorage.setItem('popup', 1);
		}
	}

	function closePopup() {
		popup.classList.add('rvstdpln-popup_hidden');
	}

	function openPopup() {
		popup.classList.remove('rvstdpln-popup_hidden');
	}

	/**
	 * Generate timeline.
	 */
	function generateTimeline(data) {
		let tmpl = '';
		let count = 0;

		for (key in data) {
			const view = data[key];
			view.nr = count++;

			switch (view.type) {
				case 'introduction':
					tmpl += generateIntroduction(view);
					break;
				case 'intro':
					tmpl += generateIntro(view);
					break;
				case 'ruler':
					tmpl += generateRuler(view);
					break;
				case 'cover':
					tmpl += generateCover(view);
					break;
				case 'module':
					tmpl += generateModule(view);
					break;
				default:
					break;
			}
		}

		timeline.innerHTML = tmpl;
		initObsurver();
	}

	function generateIntroduction(view) {
		const tmpl = `
			<li class="rvstdpln-timeline__introduction">
				<div class="rvstdpln-timeline__intro-content rvstdpln-timeline__intro-content-start">
					<div class="rvstdpln-timeline__intro-info">
						${view.intro}
					</div>
				</div>
			</li>`;
		return tmpl;
	}

	function generateIntro(view) {
		const tmpl = `
			<li class="rvstdpln-timeline__intro">
				<h2 id="${view.id}" class="rvstdpln-timeline__intro-title">
					${view.title}
				</h2>
				<h3 class="rvstdpln-timeline__intro-subtitle">
					${view.subtitle}
				</h3>
				<div class="rvstdpln-timeline__intro-content">
					<div class="rvstdpln-timeline__intro-info">
						${view.intro}
					</div>
					<figure>
						<img src="${view.img}" alt="${view.title} icoon" class="rvstdpln-timeline__intro-icon">
					</figure>
				</div>
			</li>`;
		return tmpl;
	}

	function generateRuler(view) {
		const tmpl = `
			<li class="rvstdpln-timeline__week">
				<div class="rvstdpln-timeline__week-content">
					<h4 class="rvstdpln-timeline__week-title">${view.title}</h4>
				</div>
			</li>`;
		return tmpl;
	}

	function generateCover(view) {
		const tmpl = `
			<li class="rvstdpln-module">
				<div class="rvstdpln-module__hero">
					<figure><img src="${view.img}" alt="${view.alt}"></figure>
				</div>
			</li>`;
		return tmpl;
	}

	function generateModule(view) {
		let tmpl = `
            <li class="rvstdpln-module" data-bijeenkomst="${view.bijeenkomst}" data-criteria="${view.criteria}" data-locatie="${view.locatie}">
                <div class="rvstdpln-module__content">
                    <h3 class="rvstdpln-module__title">${view.title}</h3>
                    <div class="rvstdpln-module__icons">
                        <div class="rvstdpln-module__time">
                            <img src="rvstdpln-icon-tijd.svg" alt="Tijd icoon" class="rvstdpln-module__time-icon">
                            <span class="rvstdpln-module__time-text">
                                ${view.time}
                            </span>
                        </div>
						${view.bijeenkomst ? generateLabel(view.bijeenkomst) : ''}
						${view.criteria ? generateLabel(view.criteria) : ''}
						${view.locatie ? generateLabel(view.locatie) : ''}
					</div>
					<div class="rvstdpln-module__info">
            			${view.intro}
					</div>
					${view.more ? generateReadMore(view.nr, view.more) : ''}
                </div>
            </li>`;
		return tmpl;
	}

	function generateLabel(tag) {
		const tmpl = `
			<div class="rvstdpln-module__option">
				<img src="rvstdpln-icon-${tag}.svg" alt="Optie icoon" class="rvstdpln-module__option-icon">
				<span class="rvstdpln-module__option-text">
					${tag}
				</span>
			</div>`;
		return tmpl;
	}

	function generateReadMore(nr, more) {
		const id = 'rvstdplnMore' + nr;
		const tmpl = `
			<div id="${id}" class="rvstdpln-module__more rvstdpln-module__more_hidden">
				${more}
			</div>
			<a href="#" class="rvstdpln-module__read-more" data-content="${id}">Lees meer<span class="arrow-down">^</span></a>`;
		return tmpl;
	}

	function toggleInfo(e) {
		const container = e.target;
		const targetId = container.dataset.content;
		const expanded = container.getAttribute('aria-expanded');
		const infoContainer = root.querySelector('#' + targetId);

		if (expanded === 'true') { // Hide.
			infoContainer.classList.toggle('rvstdpln-module__more_hidden', true);
			infoContainer.setAttribute('aria-hidden', true);
			container.setAttribute('aria-expanded', false);
			container.innerHTML = 'Lees meer<span class="arrow-down">^</span>';

		} else { // Show.
			infoContainer.classList.toggle('rvstdpln-module__more_hidden', false);
			infoContainer.setAttribute('aria-hidden', false);
			container.setAttribute('aria-expanded', true);
			container.innerHTML = 'Lees minder<span class="arrow-up">^</span>';
		}
	}

	function toggleFilter(e) {
		const container = e.target;
		const filterBtn = form.querySelector('#rvstdplnBtnToggleFilter');
		const expanded = container.getAttribute('aria-expanded');
		const filterContainer = root.querySelector('#rvstdplnFilterContent');

		if (expanded === 'true') { // Hide.
			filterContainer.classList.toggle('rvstdpln-filter__hidden', true);
			filterContainer.setAttribute('aria-hidden', true);
			container.setAttribute('aria-expanded', false);
			filterBtn.innerHTML = 'Open filter <span class="arrow-down">^</span>';

		} else { // Show.
			filterContainer.classList.toggle('rvstdpln-filter__hidden', false);
			filterContainer.setAttribute('aria-hidden', false);
			container.setAttribute('aria-expanded', true);
			filterBtn.innerHTML = 'Sluit filter <span class="arrow-up">^</span>';
		}
	}

	// CONTROLERS ////////////

	/**
	 * Filter list.
	 */
	function filterList(formData) {

		const items = timeline.querySelectorAll('li');
		const resetBtn = form.querySelector('#rvstdplnBtnResetFilter');
		resetBtn.classList.toggle('active', true);

		let activeFilters = [];
		if (formData.has('bijeenkomst')) activeFilters = activeFilters.concat(formData.getAll('bijeenkomst'));
		if (formData.has('criteria')) activeFilters = activeFilters.concat(formData.getAll('criteria'));
		if (formData.has('locatie')) activeFilters = activeFilters.concat(formData.getAll('locatie'));

		items.forEach(item => {

			if (0 < activeFilters.length) {

				root.classList.toggle('rvstdpln_active-filters', true);

				let itemFilters = [];
				if (item.dataset.bijeenkomst) itemFilters.push(item.dataset.bijeenkomst);
				if (item.dataset.criteria) itemFilters.push(item.dataset.criteria);
				if (item.dataset.locatie) itemFilters.push(item.dataset.locatie);

				// Compare arrays.
				const intersection = itemFilters.filter(function (e) {
					return activeFilters.indexOf(e) > -1;
				});

				if (0 < intersection.length) {
					item.style.display = 'block';
				} else if (item.classList.contains('rvstdpln-module')) {
					item.style.display = 'none';
				}
			} else { // Reset filter.
				root.classList.toggle('rvstdpln_active-filters', false);
				item.style.display = 'block';
			}
		});

		form.scrollIntoView();
	}

	/**
	 * Reset filter.
	 */
	function resetFilter() {
		const filters = form.querySelectorAll('[type="checkbox"]');
		filters.forEach(item => {
			item.checked = false;
		});
		const resetBtn = form.querySelector('#rvstdplnBtnResetFilter');
		resetBtn.classList.toggle('active', false);
		formSubmit();
	}

	/**
	 * Capture all clicks.
	 */
	function localClickEvents(e) {
		if (e.target.closest('[type="checkbox"]')) {
			toggleRadioBtn(e);
			formSubmit();

		} else if (e.target.closest('#rvstdplnBtnResetFilter')) {
			e.preventDefault();
			resetFilter();

		} else if (e.target.closest('a.rvstdpln-module__read-more')) {
			e.preventDefault();
			toggleInfo(e);

		} else if (e.target.closest('#rvstdplnBtnClosePopup')) {
			e.preventDefault();
			closePopup();

		} else if (e.target.closest('#rvstdplnBtnOpenPopup')) {
			e.preventDefault();
			openPopup();

		} else if (e.target.closest('#rvstdplnBtnToggleFilter')) {
			e.preventDefault();
			toggleFilter(e);

		} else {
			return;
		}
	}

	function toggleRadioBtn(e) {
		if (!e.target.classList.contains('active') && e.target.checked) {
			e.target.classList.toggle('active', true);
		} else {
			e.target.checked = false;
			e.target.classList.toggle('active', false);
		}
	}

	function formSubmit() {
		const formData = new FormData(form);
		filterList(formData);
		return false;
	}

	/**
	 * Intersection obsurver.
	 */
	function initObsurver() {
		const sections = root.querySelectorAll('.rvstdpln-timeline__intro-title');
		const options = {
			root: null,
			rootMargin: '0px 0px -20% 0px',
			trackVisibility: true,
			delay: 100,
		};
		const sectionObserver = new IntersectionObserver(obsurverActions, options);

		sections.forEach(function (el) {
			sectionObserver.observe(el);
		});
	}

	/**
	 * Intersection actions.
	 *
	 * Whene scrolling back to top the active title scrolls out of view.
	 * Else statement detects scrolling back and selects previous active step.
	 * Next time make sections larger for better intersection detection and cleaner code.
	 */
	function obsurverActions(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				activeFase(entry.target.id);
			} else if (entry.boundingClientRect.y > 0) { // Whene scrolling back to top.
				activeStep--;
				const step = Math.max(0, activeStep);
				const sections = root.querySelectorAll('.rvstdpln-timeline__intro-title');
				const activeSection = sections[step];
				activeFase(activeSection.id);
			}
		});
	}

	function activeFase(active) {
		const nav = root.querySelectorAll('.rvstdpln-nav__menu a');
		let count = 0;
		nav.forEach(function (el) {

			const link = el.getAttribute('href').replace('#', '');
			if (link === active) {
				el.classList.toggle('active', true);
				activeStep = count;
			} else {
				el.classList.toggle('active', false);
			}
			count++;
		});
	}

	/**
	 * Event listeners.
	 */
	function initListeners() {
		root.addEventListener('click', localClickEvents);
	}

	/**
	 * Load JSON.
	 */
	function loadContent() {
		fetch('rvstdpln-content.json').then(response => {
			return response.json();
		}).then(data => {
			generateTimeline(data);
		}).catch(err => {
			console.log(err);
		});
	}

	/**
	 * Constuctor.
	 */
	this.construct = function () {
		root = document.querySelector('#rvstdpln');
		timeline = root.querySelector('#rvstdplnTimelineContent');
		form = root.querySelector('#rvstdplnFilter');
		popup = root.querySelector('#rvstdplnPopup');
		initPopup();
		initListeners();
		loadContent();
	};
}

let rvstdplnClass = new RvstdplnClass();
rvstdplnClass.construct();
