document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const FIREBASE_AUTH_SDK_URL = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js';

    if (!userGreeting || !logoutBtn) {
        return;
    }

    function parseJsonOrNull(value, label) {
        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn(`Unable to parse ${label} from localStorage`, error);
            return null;
        }
    }

    function getSessionUser() {
        const currentUser = parseJsonOrNull(localStorage.getItem('currentUser'), 'currentUser');
        if (currentUser) {
            return currentUser;
        }

        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith('firebase:authUser:')) {
                continue;
            }

            const firebaseUser = parseJsonOrNull(localStorage.getItem(key), key);
            if (firebaseUser) {
                return {
                    firstName: firebaseUser.displayName,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    loggedIn: true
                };
            }
        }

        return null;
    }

    function getDisplayName(user) {
        if (!user) {
            return '';
        }

        const firstName = typeof user.firstName === 'string' ? user.firstName.trim() : '';
        const lastName = typeof user.lastName === 'string' ? user.lastName.trim() : '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

        return fullName
            || (typeof user.fullName === 'string' && user.fullName.trim())
            || (typeof user.name === 'string' && user.name.trim())
            || (typeof user.displayName === 'string' && user.displayName.trim())
            || (typeof user.username === 'string' && user.username.trim())
            || (typeof user.email === 'string' && user.email.trim())
            || '';
    }

    function clearLocalAuthState() {
        localStorage.removeItem('currentUser');
        for (let i = localStorage.length - 1; i >= 0; i -= 1) {
            const key = localStorage.key(i);
            if (key && key.startsWith('firebase:authUser:')) {
                localStorage.removeItem(key);
            }
        }
    }

    async function ensureFirebaseAuthSdk() {
        if (typeof firebase === 'undefined') {
            return false;
        }

        if (typeof firebase.auth === 'function') {
            return true;
        }

        if (!window.__bpFirebaseAuthSdkPromise) {
            window.__bpFirebaseAuthSdkPromise = new Promise((resolve) => {
                const existingScript = document.querySelector(`script[src="${FIREBASE_AUTH_SDK_URL}"]`);
                if (existingScript) {
                    existingScript.addEventListener('load', () => resolve(typeof firebase.auth === 'function'), { once: true });
                    existingScript.addEventListener('error', () => resolve(false), { once: true });
                    return;
                }

                const script = document.createElement('script');
                script.src = FIREBASE_AUTH_SDK_URL;
                script.async = true;
                script.addEventListener('load', () => resolve(typeof firebase.auth === 'function'), { once: true });
                script.addEventListener('error', () => resolve(false), { once: true });
                document.head.appendChild(script);
            });
        }

        return window.__bpFirebaseAuthSdkPromise;
    }

    async function signOutFirebaseSession() {
        if (!window.sessionState || typeof window.sessionState.getCurrentUser !== 'function') {
            return false;
        }

        const currentUser = window.sessionState.getCurrentUser();
        if (!currentUser || !currentUser.uid) {
            return false;
        }

        const hasAuthSdk = await ensureFirebaseAuthSdk();
        if (!hasAuthSdk || typeof firebase.auth !== 'function') {
            return false;
        }

        await firebase.auth().signOut();
        return true;
    }

    const sessionUser = getSessionUser();
    const isLoggedIn = !!sessionUser && sessionUser.loggedIn !== false;
    const displayName = getDisplayName(sessionUser);

    if (isLoggedIn) {
        userGreeting.textContent = `Hello, ${displayName || 'User'}`;
    } else {
        userGreeting.textContent = 'Hello, Guest';
    }

    logoutBtn.hidden = !isLoggedIn;

    logoutBtn.addEventListener('click', async () => {
        let signedOutInDesktop = false;

        try {
            if (window.sessionState) {
                await window.sessionState.syncNow();
            }
        } catch (error) {
            console.warn('Unable to save session state before logout', error);
        }

        try {
            signedOutInDesktop = await signOutFirebaseSession();
        } catch (error) {
            console.warn('Unable to end Firebase auth session in desktop page', error);
        }

        if (window.sessionState) {
            window.sessionState.clearSessionState();
        }
        clearLocalAuthState();

        window.location.href = signedOutInDesktop
            ? 'login.html'
            : 'login.html?logout=1';
    });
});
