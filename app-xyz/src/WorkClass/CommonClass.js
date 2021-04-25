
export default class CommonClass {
    constructor() {
        this.reg_pass = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*.-]{8,}/g;

        this.validatePass = this.validatePass.bind(this);
        this.checkPassValid = this.checkPassValid.bind(this);
    }
    errorEl(el) {
        el.classList.add('error');
        setTimeout(() => {
            el.classList.remove('error');
        }, 1000);
    }

    validateEmail(email) {
        let regexp = /[-.\w]+@([\w-]+\.)+[\w-]+/g;
        
        if (!email.match(regexp)) 
            return false;
        
        return true;
    }

    async request(url, method = 'GET', data = null) {
        try {
            const headers = {};
            let body;
            if (data) {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(data);
            }
            const response = await fetch(url, {
                method,
                headers,
                body
            });
            return response.json();
        } catch (e) {
            console.warn('Error ', e.message);
        }
    }

    show (el) {
        if (Array.isArray(el)) {
            for (let item of el) {
                item.style.display = 'block';
            }
        } else el.style.display = 'block';
    }
    hide (el) {
        
        if (Array.isArray(el)) {
            for (let item of el) {
                item.style.display = 'none';
            }
        } else el.style.display = 'none';
    }
    blurOn (el) {
        if (Array.isArray(el)) {
            for (let item of el) {
                item.classList.add('blur');
            }
        } else el.classList.add('blur');
    }
    blurOff (el) {
        if (Array.isArray(el)) {
            for (let item of el) {
                item.classList.remove('blur');
            }
        } else el.classList.remove('blur');
    }

    cleanEnterForm() {
        let input_arr = document.querySelectorAll('.enter__form input');
        for (let input of input_arr) {
            input.value = '';
        }
    }

    backToEnter() {
        document.querySelector('.enter__form-container').style.display = 'flex';
        document.querySelector('.registration__form-cont').style.display = "none"; 
        document.querySelector('.registration__form-cont .registration-success').style.display = 'none';
        document.querySelector('.registration__form-cont .name__input').value = '';
        document.querySelector('.registration__form-cont .email__input').value = '';
        document.querySelector('.registration__form-cont .registration__pass').value = '';
        document.querySelector('.registration__form-cont .registration__pass-repeat').value = '';
        document.querySelector('.registration__form-cont .notice').textContent = '';
        document.querySelector('.recovery-pass').style.display = "none";
        document.querySelector('.recovery-pass [type="email"].input__field').value = '';
    }

    validatePass(pass_el, pass_repeat_el) {
        let pass = pass_el.value, 
            pass_repeat = pass_repeat_el.value;
        
        if (pass === '' || pass_repeat === '') {
            
            if (pass === '')  this.errorEl(pass_el);
            if (pass_repeat === '')  this.errorEl(pass_repeat_el);
            return true;

        } else if (!pass.match(this.reg_pass)) {

            this.errorEl(pass_el);
            return true;

        } else if (pass !== pass_repeat) {

            this.errorEl(pass_el);
            this.errorEl(pass_repeat_el);
            return true;
        }

        return false;
    }

    changeCheckboxPass(event) {
        console.log(event.target.checked);
        let type = event.target.checked ? 'text' : 'password';
        event.target.closest('.pass__input-cont').querySelector('.input__field').type = type;
    }

    // checkPassValid(event) {
        
    //     let val = event.target.value,
    //         notice = event.target.closest('.pass__cont').querySelector('.notice');
    //     if (val == '') notice.textContent = '';
    //     else if (val.match(this.reg_pass)) {
    //         notice.textContent = 'Надёжный пароль';
    //         notice.style.color = "green";
    //     } else {
    //         notice.textContent = 'Небезопасный пароль';
    //         notice.style.color = "red";
    //     }
    // }
    checkPassValid(val) {
        let res = {
            notice_class: '',
            notice_text: '',
            valid_pass: false
        };
        if (val == '') {
            res.notice_class = '';
            res.notice_text = '';
            res.valid_pass = true;
        } else if (val.match(this.reg_pass)) {
            res.notice_class = ' valid ';
            res.notice_text = 'Надёжный пароль';
            res.valid_pass = true;
        } else {
            res.notice_class = ' novalid ';
            res.notice_text = 'Небезопасный пароль';
            res.valid_pass = false;
        }
        return res;
    }
}