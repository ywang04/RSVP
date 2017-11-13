// log function
const log = function() {
  console.log.apply(console, arguments)
}

// use function e replace document.querySelector
const e = function(selector) {
  return document.querySelector(selector)
}

// bindEvent
const bindEvent = function(elem,eventType,selector,fn) {
  if (fn == null) {
    fn = selector
    selector = null
  }
  elem.addEventListener(eventType,function(event) {
    //use event delegation
    if (selector) {
      const target = event.target
      if (target.matches(selector)) {
        fn.call(target,event)
      }
    } else {
      fn(event)
    }
  })
}

// click Add button to add name
const bindEventAdd = function() {
  log('bindEventAdd')
  const form = e('#id-form-registrar')
  const inputForm = form.querySelector('input')
  bindEvent(form,'submit',function(event) {
    event.preventDefault()
    let name = inputForm.value
    if (name) {
      const rsvp = {
        name: name,
        confirmed: false
      }
      inputForm.value = ''
      insertList(rsvp)
      rsvpLists.push(rsvp)
    } else {
      alert("Please enter your name.")
    }
    saveLists()
  })
}

// click Edit/Save/Remove button to modify name
const bindEventChange = function() {
  const ul = e('#id-ul-invitedList')
  bindEvent(ul,'click','button',function() {
    const listItem = this.parentNode
    const action = this.textContent
    const index = indexOfElement(listItem)
    const nameActions = {
      Remove: ()=> {
        listItem.remove()
        rsvpLists.splice(index, 1)
        saveLists()
      },

      Edit: ()=> {
        const span = listItem.firstElementChild
        const name = span.textContent
        span.insertAdjacentHTML('beforebegin', `
          <input type='text' value=${name}>`)
        span.remove()
        this.textContent = 'Save'
      },

      Save: ()=> {
        const input = listItem.firstElementChild
        const name = input.value
        input.insertAdjacentHTML('beforebegin', `
          <span>${name}</span>`)
        input.remove()
        this.textContent = 'Edit'
        rsvpLists[index].name = name
        saveLists()
      }
    }
    nameActions[action]()
  })
}

// click checkbox to confirm
const bindEventConfirm = function() {
  log('Start to Confirm')
  const ul = e('#id-ul-invitedList')
  bindEvent(ul,'change','input',function() {
    if (this.className === 'confirm') {
      log("This is listItem",this.className)
      const listItem = this.parentNode.parentNode
      const index = indexOfElement(listItem)
      if (this.checked) {
        listItem.className = "responded"
        rsvpLists[index].confirmed = true
        log(rsvpLists[index], index)
        saveLists()
      } else {
        listItem.className = ""
        rsvpLists[index].confirmed = false
        log(rsvpLists[index], index)
        saveLists()
      }
    }
  })
}

// click filter to filter confirm status
const bindEventFilter = function() {
  const filterCheckbox = e('.respond')
  bindEvent(filterCheckbox,'change',function(event) {
    log("Start to filter")
    const ul = e('#id-ul-invitedList')
    const listItem = ul.children
    const isChecked = event.target.checked
    if (isChecked) {
      for (let i = 0; i < listItem.length; i++) {
        if (listItem[i].className) {
          const checkbox = listItem[i].querySelector('input')
          checkbox.style.display = "none"
        } else {
          listItem[i].style.display = "none"
        }
      }
    } else {
      for (let i = 0; i < listItem.length; i ++) {
        if (listItem[i].className) {
          const checkbox = listItem[i].querySelector('input')
          checkbox.style.display = ""
        } else {
          listItem[i].style.display = ""
        }
      }
    }
  })
}

// templates of label
const templateLabel = function() {
  let t = `
      <div>
      <label>Hide those who haven't responded<input class="respond" type="checkbox">
      </label>
      </div>
  `
  return t
}

// templates of list
const templateLists = function(rsvp) {
  log("Start to templateLists")
  if (rsvp.confirmed) {
    const t = `
          <li class="responded">
            <span>${rsvp.name}</span>
            <label>Confirmed<input class="confirm" type="checkbox" checked=""></label>
            <button>Edit</button>
            <button>Remove</button>
          </li>
    `
    return t
  } else {
    const t = `
          <li>
            <span>${rsvp.name}</span>
            <label>Confirmed<input class="confirm" type="checkbox"></label>
            <button>Edit</button>
            <button>Remove</button>
          </li>
    `
    return t
  }
}

// insert label to mainDiv
const insertLable = function() {
  log("Start to insert")
  const header = e('.title');
  const t = templateLabel()
  header.insertAdjacentHTML("afterend",t)
}

// insert list to ul
const insertList = function(rsvp) {
  log("Start to insert list")
  const ulContainer = e('#id-ul-invitedList')
  const t = templateLists(rsvp)
  ulContainer.insertAdjacentHTML('beforeend', t)
}

// return index of element
const indexOfElement = function(elem) {
  const parent = elem.parentElement
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i] === elem) {
      return i
    }
  }
}

// save lists to localStorage
const save = function(rsvp) {
  const r = JSON.stringify(rsvp)
  localStorage.rsvpLists = r
}

// load lists from localStorage
const load = function() {
  const r = localStorage.rsvpLists
  return JSON.parse(r)
}

const saveLists = function() {
}

const loadLists = function() {
}

// initial lists
const initLists = function() {
  rsvpLists = loadLists()
  for (let i = 0; i < rsvpLists.length; i++) {
    let list = rsvpLists[i]
    insertList(list)
  }
}

const bindEvents = function() {
  bindEventAdd()
  bindEventChange()
  bindEventConfirm()
  bindEventFilter()
}

const __main = function() {
  log("Main to start")
  insertLable()
  bindEvents()
  initLists()
}

__main()
