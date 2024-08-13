export default class CadastroUser{
    constructor(classe){
        this.form = document.querySelector(`.${classe}`)
    }

    init(){
        this.controlSubmit()
    }

    controlSubmit(){
        this.form.addEventListener("submit", (e)=>{
            e.preventDefault()
            if(this.valida()) this.form.submit()
        })
    }

    valida(){
        const nameIsValid = this.checkNameField()
        const telisValid = this.checkTelField()
        const EmailisValid = this.checkEmailField()

        if(
            this.form.querySelector("input[name=telefone]").value === "" 
            && 
            this.form.querySelector("input[name=email]").value === ""
        ) {
            alert("Insira ao menos 1 Telefone ou 1 Email.")
            return false
        }

        if(nameIsValid && telisValid && EmailisValid) return true

        return false
    }

    checkNameField(){
        const NameInput = this.form.querySelector("input[name=nome]");
        const nameInputValue = NameInput.value
        if(!nameInputValue) {
            this.createError(NameInput, `Campo "${NameInput.previousElementSibling.innerText}" inválido`)
            return false
        }
        return true
    }

    checkTelField(){
        const telInput = this.form.querySelector("input[name=telefone]");
        const telInputValue = telInput.value
        const telRegex = new RegExp(/^\(?[1-9]{2}\)?\s?[9][0-9]{4}\-?[0-9]{4}$/)
        
        if(telInputValue && !telRegex.test(telInputValue)) {
            this.createError(telInput, `Campo "${telInput.previousElementSibling.innerText}" inválido`)
            return false
        }

        return true
    }

    checkEmailField(){
        const emailInput = this.form.querySelector("input[name=email]");
        const emailInputValue = emailInput.value
        const mailRegex = new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/, "i")

        if(emailInputValue && !mailRegex.test(emailInputValue)) {
            console.log("aqui")
            this.createError(emailInput, `Campo "${emailInput.previousElementSibling.innerText}" inválido`)
            return false
        }

        return true
    }

    createError(input, errorMessage){
        if(!input || !errorMessage) console.log("Falta campos para gerar o erro.");

        const proxElemento = input.nextElementSibling
        if(proxElemento && proxElemento.className === "error-paragraph") proxElemento.remove()

        const errorParagraph = document.createElement("p");
        errorParagraph.className = "error-paragraph"
        errorParagraph.innerText = errorMessage;

        input.insertAdjacentElement("afterEnd", errorParagraph)

    }

}