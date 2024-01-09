class Header extends HTMLElement {
	constructor() {
    super();
  }

	connectedCallback(){
		this.innerHTML = `
            <nav class="navbar">
                <div class="navcontainer">
                    <div class="ímageContainer">
                        <a href='index.html'>
                            <img src="assets/boxed_up_logo.png" alt="boxed up logo">
                        </a> 
                    </div>
                    <div class="topnav">
                        <ul>
                            <li><a href='index.html'>Home</a>
                            </li>
                            <li><a href='about.html'>About Us</a>
                            </li>
                            <li><a href='menu.html'>Menu</a> 
                            </li>
                            <li><a href='faq.html'>FAQ</a> 
                            </li>
                            <li style="margin-right: 4.5rem;"><a href='contact.html'>Contact</a> 
                            </li>
                            <li id="userlogin" style="visibility:hidden"><a class="faa-parent animated-hover" id="userlogin">
                                    <i class="fa fa-solid fa-circle-user faa-float" style="font-size:26px;"></i>
                            </a> 
                            </li>
                            <li id="usercart" style="visibility:hidden"><a class="faa-parent animated-hover" id="usercart">
                                <i class="fa fa-solid fa-cart-shopping faa-horizontal" style="font-size:26px;"></i>
                            </a> 
                            </li>
                        </ul>
                        
                    </div>
                </div>
            </nav>
		`;
	}
}

customElements.define('my-header',Header)

class Footer extends HTMLElement {
	constructor() {
    super();
  }

	connectedCallback(){
		this.innerHTML = `
        <footer>
            <div class="footerContainer">
                <div class="footer_links">
                    <a href="index.html">Home</a>
                    <a href="about.html">About Us</a>
                    <a href="reviews.html">Reviews</a> 
                    <a href="contact.html">Contact</a>
                    <a href="faq.html">FAQ</a>
                    <a href='https://www.instagram.com/boxed.upph/' class="faa-parent animated-hover" style="float:right;">
                        <i class="fa fa-brands fa-instagram faa-tada" style="font-size:26px;"></i>
                    </a>
                    <a href='https://www.facebook.com/BoxedupPH/community' class="faa-parent animated-hover" style="float:right;">
                        <i class="fa fa-brands fa-facebook-official faa-tada" style="font-size:26px;"></i>
                    </a> 
                </div>
            </div>
        </footer>
		`;
	}
}

customElements.define('my-footer',Footer)