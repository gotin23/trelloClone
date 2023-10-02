const itemsContainer = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>

let actualContainer: HTMLDivElement,
     actualBtn : HTMLButtonElement,
     actualUL: HTMLUListElement,
     actualForm: HTMLFormElement,
     actualTextInput: HTMLInputElement,
     actualValidation: HTMLSpanElement

function addContainerListeners(currentContainer : HTMLDivElement){
    
    console.log(currentContainer)
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement
    const currentForm = currentContainer.querySelector('form') as HTMLFormElement
    
    deleteBtnListeners(currentContainerDeletionBtn)
    addItemBtnListeners(currentAddItemBtn)
    closingFormBtnListeners(currentCloseFormBtn)
    addFormSubmitListeners(currentForm)
    addDDListeners(currentContainer)
}
itemsContainer.forEach((container: HTMLDivElement)=> {
    addContainerListeners(container)
})
function deleteBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener('click', handleContainerDeletion)
}
function addItemBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener('click', handleAddItem)
}
function closingFormBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false))
}
function addFormSubmitListeners(form: HTMLFormElement){
    form.addEventListener('submit', createNewItem)

}
function addDDListeners(element : HTMLElement){
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
    element.addEventListener('dragend', handleDragEnd)
}
function createNewItem(e: Event){
    e.preventDefault() 
  const itemContent =  actualTextInput.value
  // validation
  if(itemContent.length === 0){
    actualValidation.textContent = 'Must be at least 1 character long' as string
    return
  }else  {
    actualValidation.textContent = '' 
  }
  //Creation Item
  const li = `<li class='item' draggable='true'>
  <p>${itemContent}</p>
  <button>X</button></li>` 
  actualUL.insertAdjacentHTML('beforeend',li)
 
  toggleForm(actualBtn, actualForm, false)
  const item = actualUL.lastElementChild as HTMLLIElement
  const liBtn = item.querySelector('button') as HTMLButtonElement
  handleItemDeletion(liBtn)
  addDDListeners(item)
  actualTextInput.value = ''

}
function handleItemDeletion(btn : HTMLButtonElement){
    btn.addEventListener('click', () =>{
        const elToRemove = btn.parentElement as HTMLLIElement
        elToRemove.remove()
    })
}
function handleContainerDeletion(e: MouseEvent){
    const btn = e.target as HTMLButtonElement
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[]
    const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[]
    containers[btnsArray.indexOf(btn)].remove()
}
function handleAddItem(e: MouseEvent){
    const btn = e.target as HTMLButtonElement
    if(actualContainer) toggleForm(actualBtn, actualForm, false)
    setContainerItems(btn)
    toggleForm(actualBtn, actualForm, true)
}
function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action : Boolean){
if(!action){
    form.style.display = 'none'
    btn.style.display= 'block'
}else if(action){
    form.style.display = 'block'
    btn.style.display= 'none'
}
}

function setContainerItems(btn: HTMLButtonElement){
    actualBtn = btn
    actualContainer = btn.parentElement as HTMLDivElement
    actualUL = actualContainer.querySelector('ul') as HTMLUListElement
    actualForm = actualContainer.querySelector('form') as HTMLFormElement
    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLFormElement

}
//Drag and drop
let dragSrcEL: HTMLElement
function handleDragStart(this: HTMLElement, e: DragEvent){
    e.stopPropagation()
    if(actualContainer) toggleForm(actualBtn,actualForm, false)
    dragSrcEL = this
    e.dataTransfer?.setData('text/html', this.innerHTML)
}
function handleDragOver(e: DragEvent){
    e.preventDefault()
}
function handleDrop(this: HTMLElement, e: DragEvent){
    e.stopPropagation()
    const receptionEL = this
    if(dragSrcEL.nodeName === "LI" && receptionEL.classList.contains('items-container')){
        (receptionEL.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEL)
        addDDListeners(dragSrcEL)
        handleItemDeletion(dragSrcEL.querySelector('button') as HTMLButtonElement)
    }if(dragSrcEL !== this && this.classList[0] === dragSrcEL.classList[0]){
        dragSrcEL.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer?.getData('text/html') as string
        if(this.classList.contains('items-container')){
            addContainerListeners(this as HTMLDivElement)

            this.querySelectorAll('li').forEach((li: HTMLLIElement)=>{
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
                addDDListeners(li)
            })
        }else {
            addDDListeners(this)
            handleItemDeletion(this.querySelector('button') as HTMLButtonElement)
        }
    }
}
function handleDragEnd(this: HTMLElement, e: DragEvent){
    e.stopPropagation()
    if(this.classList.contains('items-container')){
        addContainerListeners(this as HTMLDivElement)
    }else{
        addDDListeners(this)
    }
}
// Add new container

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement
const addContainerFormInput =document.querySelector('.add-new-container input') as HTMLInputElement
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement
const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement

const containersList = document.querySelector('.main-content') as HTMLDivElement


addContainerBtn.addEventListener('click', ()=> {
    toggleForm(addContainerBtn, addContainerForm, true)
})
addContainerCloseBtn.addEventListener('click', () =>{
    toggleForm(addContainerBtn, addContainerForm, false)
})
addContainerForm.addEventListener('submit', createNewContainer)
function createNewContainer(e: Event){
    e.preventDefault()
    if(addContainerFormInput.value.length === 0){
        validationNewContainer.textContent = 'Must be at least 1 character long' as string
        return
      }else  {
        validationNewContainer.textContent = '' 
      }
      const itemsContainer = document.querySelector('.items-container') as HTMLDivElement
      console.log(itemsContainer)
      const newContainer = itemsContainer.cloneNode() as HTMLDivElement
      const newContainerContent = `
      <div class="top-container">
          <h2>${addContainerFormInput.value}</h2>
          <button class="delete-container-btn">X</button>
      </div>
      <ul></ul>
      <button class="add-item-btn">Add an item</button>
      <form autocomplete="off">
          <div class="top-form-container">
              <label for="item">Add a new item</label>
              <button type="button" class="close-form-btn">X</button>
              <input type="text" id="item">
              <span class="validation-msg"></span>
              <button type="submit">Submit</button>
          </div>
      </form>
  `
  newContainer.innerHTML = newContainerContent
  containersList.insertBefore(newContainer, addNewContainer)
  addContainerFormInput.value = ''
  addContainerListeners(newContainer)
  toggleForm(addContainerBtn, addContainerForm, false)
}
