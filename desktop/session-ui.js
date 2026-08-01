document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');

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
        try {
            if (window.sessionState) {
                await window.sessionState.syncNow();
                window.sessionState.clearSessionState();
            }
        } catch (error) {
            console.warn('Unable to save session state before logout', error);
        }

        localStorage.removeItem('currentUser');
        for (let i = localStorage.length - 1; i >= 0; i -= 1) {
            const key = localStorage.key(i);
            if (key && key.startsWith('firebase:authUser:')) {
                localStorage.removeItem(key);
            }
        }
        window.location.href = 'login.html?logout=1';
    });
});
