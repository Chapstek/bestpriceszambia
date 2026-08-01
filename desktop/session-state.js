(() => {
    const FIREBASE_CONFIG = {
        apiKey: 'AIzaSyA5kvUdUNvYVPjnOq_wjLnp0SMnTQXgTcw',
        authDomain: 'best-prices-46409.firebaseapp.com',
        projectId: 'best-prices-46409',
        storageBucket: 'best-prices-46409.firebasestorage.app',
        messagingSenderId: '681370330797',
        appId: '1:681370330797:web:7799facc4294bc1f204824',
        measurementId: 'G-3LC5XR4F6B'
    };

    const USER_KEY = 'currentUser';
    const STORAGE_STATE_KEYS = ['cart', 'wishlist', 'compare', 'compareItems'];
    const USER_STATE_COLLECTION = 'userSessions';
    let suppressSync = 0;
    let syncTimer = null;

    function parseJson(value, fallback) {
        if (!value) {
            return fallback;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn('Unable to parse session state from localStorage', error);
            return fallback;
        }
    }

    function normalizeIdList(items) {
        return Array.from(
            new Set(
                (Array.isArray(items) ? items : [])
                    .map((item) => (item && typeof item === 'object' ? item.id : item))
                    .map((item) => Number(item))
                    .filter(Number.isInteger)
            )
        );
    }

    function normalizeCompareItems(items, compareIds = null) {
        const rawItems = items && typeof items === 'object' ? items : {};
        const allowedIds = compareIds ? new Set(normalizeIdList(compareIds)) : null;

        return Object.entries(rawItems).reduce((acc, [key, value]) => {
            const id = Number(key);
            if (!Number.isInteger(id)) {
                return acc;
            }

            if (allowedIds && !allowedIds.has(id)) {
                return acc;
            }

            acc[id] = value && typeof value === 'object'
                ? { ...value, id }
                : { id };
            return acc;
        }, {});
    }

    function normalizeState(state) {
        const cart = normalizeIdList(state && state.cart);
        const wishlist = normalizeIdList(state && state.wishlist);
        const compare = normalizeIdList(state && state.compare);
        const compareItems = normalizeCompareItems(state && state.compareItems, compare);

        return { cart, wishlist, compare, compareItems };
    }

    function readState() {
        return normalizeState({
            cart: parseJson(localStorage.getItem('cart'), []),
            wishlist: parseJson(localStorage.getItem('wishlist'), []),
            compare: parseJson(localStorage.getItem('compare'), []),
            compareItems: parseJson(localStorage.getItem('compareItems'), {})
        });
    }

    function withSyncSuppressed(action) {
        suppressSync += 1;
        try {
            return action();
        } finally {
            suppressSync -= 1;
        }
    }

    function applyState(state) {
        const normalizedState = normalizeState(state);
        withSyncSuppressed(() => {
            localStorage.setItem('cart', JSON.stringify(normalizedState.cart));
            localStorage.setItem('wishlist', JSON.stringify(normalizedState.wishlist));
            localStorage.setItem('compare', JSON.stringify(normalizedState.compare));
            localStorage.setItem('compareItems', JSON.stringify(normalizedState.compareItems));
        });
        return normalizedState;
    }

    function clearSessionState() {
        withSyncSuppressed(() => {
            STORAGE_STATE_KEYS.forEach((key) => localStorage.removeItem(key));
        });
    }

    function mergeStates(remoteState, localState) {
        const normalizedRemote = normalizeState(remoteState || {});
        const normalizedLocal = normalizeState(localState || {});
        const compare = normalizeIdList([
            ...normalizedRemote.compare,
            ...normalizedLocal.compare
        ]);

        return normalizeState({
            cart: [...normalizedRemote.cart, ...normalizedLocal.cart],
            wishlist: [...normalizedRemote.wishlist, ...normalizedLocal.wishlist],
            compare,
            compareItems: {
                ...normalizedRemote.compareItems,
                ...normalizedLocal.compareItems
            }
        });
    }

    function parseStoredCurrentUser() {
        return parseJson(localStorage.getItem(USER_KEY), null);
    }

    function getCurrentUser() {
        const currentUser = parseStoredCurrentUser();
        if (currentUser && currentUser.uid) {
            return currentUser;
        }

        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith('firebase:authUser:')) {
                continue;
            }

            const firebaseUser = parseJson(localStorage.getItem(key), null);
            if (firebaseUser && firebaseUser.uid) {
                return firebaseUser;
            }
        }

        return null;
    }

    function getFirestoreDb() {
        if (typeof firebase === 'undefined' || !firebase.apps || typeof firebase.firestore !== 'function') {
            return null;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        return firebase.firestore();
    }

    async function loadRemoteState(uid) {
        const db = getFirestoreDb();
        if (!db || !uid) {
            return null;
        }

        const snapshot = await db.collection(USER_STATE_COLLECTION).doc(uid).get();
        if (!snapshot.exists) {
            return null;
        }

        return normalizeState(snapshot.data());
    }

    async function saveRemoteState(uid, state) {
        const db = getFirestoreDb();
        if (!db || !uid) {
            return;
        }

        const normalizedState = normalizeState(state);
        await db.collection(USER_STATE_COLLECTION).doc(uid).set({
            ...normalizedState,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    async function syncNow() {
        const user = getCurrentUser();
        if (!user || !user.uid) {
            return;
        }

        await saveRemoteState(user.uid, readState());
    }

    function scheduleSync() {
        if (suppressSync > 0) {
            return;
        }

        const user = getCurrentUser();
        if (!user || !user.uid) {
            return;
        }

        window.clearTimeout(syncTimer);
        syncTimer = window.setTimeout(() => {
            syncNow().catch((error) => {
                console.error('Failed to sync user session state:', error);
            });
        }, 150);
    }

    async function restoreForUser(user) {
        const uid = user && user.uid;
        if (!uid) {
            return readState();
        }

        const mergedState = mergeStates(await loadRemoteState(uid), readState());
        applyState(mergedState);
        await saveRemoteState(uid, mergedState);
        return mergedState;
    }

    if (!window.__bpSessionStatePatched) {
        const storageProto = Object.getPrototypeOf(localStorage);
        const originalSetItem = storageProto.setItem;
        const originalRemoveItem = storageProto.removeItem;

        storageProto.setItem = function patchedSetItem(key, value) {
            originalSetItem.call(this, key, value);
            if (this === localStorage && STORAGE_STATE_KEYS.includes(key)) {
                scheduleSync();
            }
        };

        storageProto.removeItem = function patchedRemoveItem(key) {
            originalRemoveItem.call(this, key);
            if (this === localStorage && STORAGE_STATE_KEYS.includes(key)) {
                scheduleSync();
            }
        };

        window.__bpSessionStatePatched = true;
    }

    window.sessionState = {
        readState,
        applyState,
        clearSessionState,
        getCurrentUser,
        restoreForUser,
        syncNow
    };
})();
