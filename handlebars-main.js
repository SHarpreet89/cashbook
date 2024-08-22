document.addEventListener('DOMContentLoaded', function() {
    renderLogin();
});

function renderLogin() {
    // Code for rendering the login/registration page
    const mainScript = document.getElementById('main-template').innerHTML;
    // Page Elements
    const obj = {
        "pageHeading": "<h1>Welcome to CashBook!</h1>",
        "pageDescription": "<p>We are a one stop shop when it comes to managing your finances! Log in or sign up now to find out more information!</p>",
        "mainContent": `<main class="container">
                            <section class="row">
                                <article class="col-6">
                                    <div class="card">
                                        <h2>Login</h2>
                                        <form>
                                            <div class="form-group">
                                                <label for="login-email">Email:</label>
                                                <input type="text" id="username" placeholder="Enter your username">
                                            </div>
                                            <div class="form-group">
                                                <label>Password:</label>
                                                <input type="email" id="login-email" placeholder="Enter your password">
                                            </div>
                                            <div class="form-group">
                                                <button type="submit">Login</button>
                                            </div>
                                        </form>
                                    </div>
                                </article>

                                <article class="col-6">
                                    <div class="card">
                                        <h2>Sign up</h2>
                                        <form>
                                            <div class="form-group">
                                                <label for="signup-name">Name:</label>
                                                <input type="email" id="signup-email" placeholder="Enter your email">
                                            </div>
                                            <div class="form-group">
                                                <label for="signup-password">Password:</label>
                                                <input type="password" id="signup-password" placeholder="Create a password">
                                            </div>
                                            <div class="form-group">
                                                <button class="submit">Sign Up</button>
                                            </div>
                                        </form>
                                    </div>
                                </article>
                            </section>
                        </main>`
    }
    // Compile the template
    const mainTemplate = Handlebars.compile(mainScript);
    document.getElementById("main-render").innerHTML = mainTemplate(obj);
}