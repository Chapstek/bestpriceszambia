document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');

    if (!userGreeting || !logoutBtn) {
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isLoggedIn = currentUser && currentUser.loggedIn;
    const displayName = currentUser && (currentUser.firstName || currentUser.name || currentUser.email);

    if (isLoggedIn && displayName) {
        userGreeting.textContent = `Hello, ${displayName}`;
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
