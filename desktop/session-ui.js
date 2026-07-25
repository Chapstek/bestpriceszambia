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

    const sessionUser = getSessionUser();
    const isLoggedIn = !!sessionUser && sessionUser.loggedIn !== false;
    const displayName = sessionUser && (sessionUser.firstName || sessionUser.name || sessionUser.username || sessionUser.email);

    if (isLoggedIn) {
        userGreeting.textContent = `Hello, ${displayName || 'User'}`;
        logoutBtn.hidden = false;
    } else {
        userGreeting.textContent = 'Hello, Guest';
        logoutBtn.hidden = true;
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        for (let i = localStorage.length - 1; i >= 0; i -= 1) {
            const key = localStorage.key(i);
            if (key && key.startsWith('firebase:authUser:')) {
                localStorage.removeItem(key);
            }
        }
        window.location.href = 'login.html';
    });
});
