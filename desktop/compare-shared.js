(() => {
    const COMPARE_KEY = 'compare';
    const COMPARE_ITEMS_KEY = 'compareItems';

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            console.warn(`Unable to parse ${key} from localStorage`, error);
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function normalizeIds(ids) {
        return Array.from(
            new Set((Array.isArray(ids) ? ids : []).map((id) => Number(id)).filter(Number.isInteger))
        );
    }

    function getCompareIds() {
        return normalizeIds(readJson(COMPARE_KEY, []));
    }

    function setCompareIds(ids) {
        writeJson(COMPARE_KEY, normalizeIds(ids));
    }

    function getCompareItems() {
        const items = readJson(COMPARE_ITEMS_KEY, {});
        return items && typeof items === 'object' ? items : {};
    }

    function setCompareItems(items) {
        writeJson(COMPARE_ITEMS_KEY, items && typeof items === 'object' ? items : {});
    }

    function updateCompareCount() {
        const compareCountEl = document.getElementById('compare-count');
        if (!compareCountEl) {
            return;
        }
        compareCountEl.textContent = `Compare (${getCompareIds().length})`;
    }

    function extractProductSnapshot(button, productId) {
        const slideOrCard = button.closest('.swiper-slide, .product-card, .product-details');
        const imageEl = slideOrCard ? slideOrCard.querySelector('img') : null;
        const nameEl = slideOrCard ? slideOrCard.querySelector('p, #product-name') : document.getElementById('product-name');
        const codeEl = slideOrCard ? slideOrCard.querySelector('h3, #product-code') : document.getElementById('product-code');
        const ratingEl = slideOrCard ? slideOrCard.querySelector('.rating, #product-rating') : document.getElementById('product-rating');
        const descriptionEl = document.getElementById('product-description');

        const existing = getCompareItems()[productId] || {};
        return {
            ...existing,
            id: productId,
            name: (nameEl && nameEl.textContent.trim()) || existing.name || `Product #${productId}`,
            code: (codeEl && codeEl.textContent.trim()) || existing.code || '',
            rating: (ratingEl && ratingEl.textContent.trim()) || existing.rating || '',
            image: (imageEl && imageEl.getAttribute('src')) || existing.image || '',
            description: (descriptionEl && descriptionEl.textContent.trim()) || existing.description || '',
            url: `product.html?id=${productId}`
        };
    }

    function addToCompare(productId, snapshot) {
        const ids = getCompareIds();
        if (ids.includes(productId)) {
            return false;
        }

        ids.push(productId);
        setCompareIds(ids);

        const items = getCompareItems();
        items[productId] = snapshot;
        setCompareItems(items);
        return true;
    }

    function removeFromCompare(productId) {
        const ids = getCompareIds().filter((id) => id !== Number(productId));
        setCompareIds(ids);
        const items = getCompareItems();
        delete items[productId];
        setCompareItems(items);
        updateCompareCount();
    }

    function clearCompare() {
        setCompareIds([]);
        setCompareItems({});
        updateCompareCount();
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateCompareCount();

        const compareCountEl = document.getElementById('compare-count');
        if (compareCountEl && compareCountEl.tagName !== 'A') {
            compareCountEl.style.cursor = 'pointer';
            compareCountEl.addEventListener('click', () => {
                window.location.href = 'compare.html';
            });
        }

        document.body.addEventListener('click', (event) => {
            const compareButton = event.target.closest('.add-to-compare');
            if (!compareButton) {
                return;
            }

            const productId = Number(compareButton.getAttribute('data-product-id'));
            if (!Number.isInteger(productId)) {
                return;
            }

            const added = addToCompare(productId, extractProductSnapshot(compareButton, productId));
            updateCompareCount();

            if (added) {
                alert('Product added to compare!');
            } else {
                alert('Product already in compare!');
            }
        });
    });

    window.compareShared = {
        getCompareIds,
        getCompareItems,
        updateCompareCount,
        removeFromCompare,
        clearCompare
    };
})();
