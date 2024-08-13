export default class Login{
    constructor(classe){
        this.form = document.querySelector(`.${classe}`)
    }

    init(){
        this.submitControl()
    }

    submitControl(){
        this.form.addEventListener("submit", (e)=>{
            e.preventDefault()
            const emailIsValid = this.emailIsValid();
            const passwordIsValid = this.passwordIsValid();
            if(emailIsValid && passwordIsValid) this.form.submit()
        })
    }

    emailIsValid(){
        const emailInput = this.form.querySelector("input[name=email]")
        const email = emailInput.value
        const emailRegex = new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/, "i")
        const ErrorParagraph = this.form.querySelector(".error-paragraph-email")
        if(!emailRegex.test(email)){

            if(!ErrorParagraph){
                const newParagraph = document.createElement("p")
                newParagraph.setAttribute("class", "error-paragraph-email")
                newParagraph.innerHTML = "Digite um e-mail válido"

                emailInput.insertAdjacentElement("afterEnd", newParagraph)
                return false
            }

            ErrorParagraph.innerHTML = "Digite um e-mail válido"
            return false
        }
        
        if(ErrorParagraph) ErrorParagraph.remove()
        return true
    }

    passwordIsValid(){
        const passwordInput = this.form.querySelector("input[name=password]")
        const password = passwordInput.value
        const maxLength = 50
        const minLength = 3
        const ErrorParagraph = this.form.querySelector(".error-paragraph-password")
        if(password.length > maxLength || password.length < minLength){

            if(!ErrorParagraph){
                const newParagraph = document.createElement("p")
                newParagraph.setAttribute("class", "error-paragraph-password") 
                newParagraph.innerHTML = `A senha deve ter entre ${minLength} e ${maxLength} caracteres`

                passwordInput.insertAdjacentElement("afterEnd", newParagraph)
                return false
            }

            ErrorParagraph.innerHTML = `A senha deve ter entre ${minLength} e ${maxLength} caracteres`
            return false
        }
        
        if(ErrorParagraph) ErrorParagraph.remove()
        return true
    }

}