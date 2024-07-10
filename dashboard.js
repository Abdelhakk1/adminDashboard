document.addEventListener("DOMContentLoaded", function() {
    const SUPABASE_URL = 'https://rboyqdyoehiiajuvcyft.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib3lxZHlvZWhpaWFqdXZjeWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODIsImV4cCI6MjAzMjIyOTk4Mn0.mBAq6q-QTOowr8MIpZxWBBUJy_uDBF6zK2ebqbAzCHQ';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const dashboardLink = document.getElementById("dashboard-link");
    const shopListLink = document.getElementById("shop-list-link");
    const shopRequestLink = document.getElementById("shop-request-link");
    const usersLink = document.getElementById("users-link");
    const employeesLink = document.getElementById("employees-link");
    const logoutLink = document.getElementById("logout-link");
    const dashboardContent = document.getElementById("dashboard");
    const shopsContent = document.getElementById("shops");
    const shopRequestsContent = document.getElementById("shop-requests");
    const usersContent = document.getElementById("users");
    const employeesContent = document.getElementById("employees");
    const mainTitle = document.getElementById("main-title");
    const searchUsersInput = document.getElementById("search-users");
    const searchEmployeesInput = document.getElementById("search-employees");

    async function fetchData() {
        const { data: users, error: userError } = await supabase.from('clients').select('*');
        const { data: shops, error: shopError } = await supabase.from('shops').select('*');
        const { data: employees, error: employeeError } = await supabase.from('employees').select('*');
        const { data: reservations, error: reservationsError } = await supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5);

        if (userError) {
            console.error('Error fetching users:', userError);
        } else {
            document.querySelectorAll('#total-users').forEach(el => el.textContent = users.length);
            displayData('users', users, ['full_name', 'email', 'id']);
        }

        if (shopError) {
            console.error('Error fetching shops:', shopError);
        } else {
            displayShops(shops.filter(shop => shop.status === 'approved'));
            displayShopRequests(shops.filter(shop => shop.status === 'pending'));
        }

        if (employeeError) {
            console.error('Error fetching employees:', employeeError);
        } else {
            document.querySelectorAll('#total-employees').forEach(el => el.textContent = employees.length);
            displayData('employees', employees, ['full_name', 'email', 'id']);
        }

        if (reservationsError) {
            console.error('Error fetching reservations:', reservationsError);
        } else {
            displayReservations(reservations);
        }
    }

    function displayData(section, data, fields) {
        const sectionElement = document.getElementById(section);
        const tableBody = sectionElement.querySelector('tbody');

        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = fields.map(field => `<td>${item[field]}</td>`).join('');
            tableBody.appendChild(row);
        });
    }

    function displayShops(shops) {
        const shopsSection = document.querySelector('.shop-cards');
        shopsSection.innerHTML = '';

        shops.forEach(shop => {
            const shopCard = document.createElement('div');
            shopCard.classList.add('shop-card');
            shopCard.innerHTML = `
                <img src="${shop.shop_image_url || 'shop_image.jpg'}" alt="Shop Image" class="shop-image">
                <div class="shop-details">
                    <span class="shop-name">${shop.shop_name}</span>
                    <span class="shop-location">${shop.shop_address}</span>
                    <a href="shop-details.html?shopId=${shop.id}" class="details-button">Details</a>
                </div>
            `;
            shopsSection.appendChild(shopCard);
        });
    }

    function displayShopRequests(shopRequests) {
        const shopRequestsSection = document.querySelector('#shop-requests .shop-cards');
        shopRequestsSection.innerHTML = '';

        shopRequests.forEach(shop => {
            const shopCard = document.createElement('div');
            shopCard.classList.add('shop-card');
            shopCard.innerHTML = `
                <img src="${shop.shop_image_url || 'shop_image.jpg'}" alt="Shop Image" class="shop-image">
                <div class="shop-details">
                    <span class="shop-name">${shop.shop_name || 'Shop Name'}</span>
                    <span class="shop-location">${shop.shop_address || 'Shop Location'}</span>
                    <a href="shop-request-details.html?shopId=${shop.id}" class="details-button">Details</a>
                </div>
            `;
            shopRequestsSection.appendChild(shopCard);
        });
    }

    async function approveShop(shopId) {
        const { error } = await supabase
            .from('shops')
            .update({ status: 'approved' })
            .eq('id', shopId);

        if (error) {
            console.error('Error approving shop:', error);
        } else {
            fetchData(); // Refresh data
        }
    }

    async function declineShop(shopId) {
        const { error } = await supabase
            .from('shops')
            .delete()
            .eq('id', shopId);

        if (error) {
            console.error('Error declining shop:', error);
        } else {
            fetchData(); // Refresh data
        }
    }

    // Make functions available globally
    window.approveShop = approveShop;
    window.declineShop = declineShop;

    dashboardLink.addEventListener("click", function() {
        showContent(dashboardContent);
        mainTitle.textContent = "Dashboard";
        setActiveLink(dashboardLink);
    });

    shopListLink.addEventListener("click", function() {
        showContent(shopsContent);
        mainTitle.textContent = "Shop List";
        setActiveLink(shopListLink);
    });

    shopRequestLink.addEventListener("click", function() {
        showContent(shopRequestsContent);
        mainTitle.textContent = "Shop Request";
        setActiveLink(shopRequestLink);
    });

    usersLink.addEventListener("click", function() {
        showContent(usersContent);
        mainTitle.textContent = "Users";
        setActiveLink(usersLink);
    });

    employeesLink.addEventListener("click", function() {
        showContent(employeesContent);
        mainTitle.textContent = "Employees";
        setActiveLink(employeesLink);
    });

    logoutLink.addEventListener("click", function() {
        window.location.href = 'index_login.html';
    });

    searchUsersInput.addEventListener("input", function() {
        filterList("user-list", searchUsersInput.value);
    });

    searchEmployeesInput.addEventListener("input", function() {
        filterList("employee-list", searchEmployeesInput.value);
    });

    function showContent(content) {
        document.querySelectorAll(".content").forEach(section => {
            section.style.display = "none";
        });
        content.style.display = "block";
    }

    function setActiveLink(activeLink) {
        document.querySelectorAll(".sidebar nav ul li").forEach(function(navItem) {
            navItem.classList.remove("active");
        });
        activeLink.classList.add("active");
    }

    function filterList(listClass, filterText) {
        const listItems = document.querySelectorAll(`.${listClass} table tbody tr`);
        listItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const filter = filterText.toLowerCase();
            item.style.display = text.includes(filter) ? "" : "none";
        });
    }

    fetchData();
});
