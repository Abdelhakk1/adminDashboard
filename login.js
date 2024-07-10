document.addEventListener('DOMContentLoaded', () => {
    const supabaseUrl = 'https://rboyqdyoehiiajuvcyft.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib3lxZHlvZWhpaWFqdXZjeWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODIsImV4cCI6MjAzMjIyOTk4Mn0.mBAq6q-QTOowr8MIpZxWBBUJy_uDBF6zK2ebqbAzCHQ';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase
                .from('admins')
                .select('password')
                .eq('email', email)
                .single();

            if (error || !data) {
                console.error('Error fetching admin data:', error);
                alert('Invalid email or password');
                return;
            }

            const match = data.password === password;
            console.log('Password match:', match);

            if (match) {
                console.log('Redirecting to dashboard.html');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid email or password');
        }
    });
});
