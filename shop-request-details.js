document.addEventListener("DOMContentLoaded", async () => {
    const SUPABASE_URL = 'https://rboyqdyoehiiajuvcyft.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib3lxZHlvZWhpaWFqdXZjeWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODIsImV4cCI6MjAzMjIyOTk4Mn0.mBAq6q-QTOowr8MIpZxWBBUJy_uDBF6zK2ebqbAzCHQ';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const urlParams = new URLSearchParams(window.location.search);
    const shopId = urlParams.get('shopId');

    if (!shopId) {
        alert('Shop ID not provided.');
        return;
    }

    const { data: shop, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();

    if (error) {
        console.error('Error fetching shop details:', error);
        alert('Failed to fetch shop details.');
        return;
    }

    document.getElementById('shop-name').textContent = shop.shop_name;
    document.getElementById('shop-location').textContent = shop.shop_address;
    document.getElementById('shop-address').textContent = `Address: ${shop.shop_address}`;
    document.getElementById('shop-category').textContent = `Shop Category: ${shop.shop_category}`;
    document.getElementById('shop-opening-hour').textContent = `Shop Opening Hour: ${new Date(shop.shop_opening_hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    document.getElementById('shop-weekend').textContent = `Shop Weekend: ${new Date(shop.shop_weekend).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    document.getElementById('shop-about').textContent = `About Shop: ${shop.about_shop}`;
    document.getElementById('shop-document-link').href = shop.document_url;
    document.querySelector('.shop-image').src = shop.image_url || 'shop_image.jpg';

    window.approveShop = async function() {
        const { error } = await supabase
            .from('shops')
            .update({ status: 'approved' })
            .eq('id', shopId);

        if (error) {
            console.error('Error approving shop:', error);
            alert('Failed to approve shop.');
        } else {
            alert('Shop approved successfully.');
            window.location.href = 'dashboard.html#shop-request';
        }
    };

    window.declineShop = async function() {
        const { error } = await supabase
            .from('shops')
            .delete()
            .eq('id', shopId);

        if (error) {
            console.error('Error declining shop:', error);
            alert('Failed to decline shop.');
        } else {
            alert('Shop declined successfully.');
            window.location.href = 'dashboard.html#shop-request';
        }
    };
});
