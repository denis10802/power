document.querySelector('.c-burg').addEventListener('click', function(e){
	e.preventDefault();
	//this.classList.toggle('is_active');
	if(this.classList.contains('is_active')){
		this.classList.remove('is_active');
		document.querySelector('#nav-btn').classList.remove('navbar-activ');
	}else {
		this.classList.add('is_active');
		document.querySelector('#nav-btn').classList.add('navbar-activ');
	}
})