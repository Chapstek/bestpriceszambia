document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');

    if (!userGreeting || !logoutBtn) {
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = !!currentUser && currentUser.loggedIn !== false;
    const displayName = currentUser && (currentUser.firstName || currentUser.name || currentUser.username || currentUser.email);

    if (isLoggedIn) {
        userGreeting.textContent = `Hello, ${displayName || 'User'}`;
        logoutBtn.hidden = false;
    } else {
        userGreeting.textContent = 'Hello, Guest';
        logoutBtn.hidden = true;
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});
