/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id')

        document.querySelectorAll('.nav__menu a[href*=' + sectionId + ']').forEach(link => {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                link.classList.add('active')
            }else{
                link.classList.remove('active')
            }
        })
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/* Send Message */
// Modify the connect function to handle form submission
function connect(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    if (name === "" || email === "" || message === "") {
        alert("Please Fill All The Fields");
    } else {
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
            },
            body: JSON.stringify({ name, email, message })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }
                return response.json();
            })
            .then(_data => {
                // Display a success message using a modal or a toast
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.textContent = `Hello ${name}, Your Message has been sent successfully!`;
                document.body.appendChild(successMessage);
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error.message);
                // Display an error message using a modal or a toast
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = `An error occurred while submitting the form: ${error.message}`;
                document.body.appendChild(errorMessage);
                setTimeout(() => {
                    document.body.removeChild(errorMessage);
                }, 3000);
            });
    }
}
// Bind connect function to the form submission event
document.querySelector(".contact__form").addEventListener("submit", connect);
