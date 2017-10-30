// Create rsvplists for localStorage
let rsvpLists = []

// log function
const log = function() {
  console.log.apply(console, arguments)
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

// Click Add button to add name
const bindEventAdd = function() {
  log('bindEventAdd')
  const form = document.querySelector('#registrar')
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

// Click Edit/Save/Remove button to modify name
const bindEventChange = function() {
  const ul = document.querySelector('#invitedList')
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

// Click checkbox to confirm
const bindEventConfirm = function() {
  log('Start to Confirm')
  const ul = document.querySelector('#invitedList')
  bindEvent(ul,'change','input',function() {
    if (this.className === 'confirm') {
      log("This is listItem",this.className)
      const listItem = this.parentNode.parentNode
      var index = indexOfElement(listItem)
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

// Click filter to filter confirm status
const bindEventFilter = function() {
  const filterCheckbox = document.querySelector('.respond')
  bindEvent(filterCheckbox,'change',function(event) {
    log("Start to filter")
    const ul = document.querySelector('#invitedList')
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
  const header = document.querySelector('.title');
  const t = templateLabel()
  header.insertAdjacentHTML("afterend",t)
}

// insert list to ul
const insertList = function(rsvp) {
  log("Start to insert list")
  const ulContainer = document.querySelector('#invitedList')
  const t = templateLists(rsvp)
  ulContainer.insertAdjacentHTML('beforeend', t)
}

bindEvent(document,'DOMContentLoaded', function() {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');

  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  const div = createElement('div');
  const filterLabel = createElement("label","textContent", "Hide those who haven't responded");
  const filterCheckbox = createElement('input','type','checkbox');

  filterLabel.appendChild(filterCheckbox);
  div.appendChild(filterLabel);
  mainDiv.insertBefore(div,ul);

  function createElement (elemName,proName,value) {
    const elem = document.createElement(elemName);
    elem[proName] = value;
    return elem;
  }

  function createLi(text) {
    const li = document.createElement('li');

    function appendToLi (elemName,proName,value) {
      const elem = createElement(elemName,proName,value);
      li.appendChild(elem);
      return elem
    }

    appendToLi('span','textContent',text);

    appendToLi('label','textContent','Confirmed')
    .appendChild(createElement('input','type','checkbox'));

    appendToLi('button','textContent','Edit');

    appendToLi('button','textContent','Remove');

    return li;

  }

  bindEvent(form,'submit',function(e) {
    e.preventDefault();
    const text = input.value;
    if (!text) {
      alert("Please enter your name.");
    } else {
      input.value = "";
      const li = createLi(text);
      ul.appendChild(li);
    }
  });

  bindEvent(ul,'change','input',function() {
    const listItem = this.parentNode.parentNode; //traverse
    if (this.checked) {
      listItem.className = "responded"
    } else {
      listItem.className = "";
    }
  });

const bindEventChange = function() {
  const ul = document.querySelector('#invitedList')
  bindEvent(ul,'click','button',function() {
    log('Start to change', this)
    const listItem = this.parentNode
    const action = this.textContent
    const nameActions = {
      Remove: ()=> {
        listItem.remove()
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
      }
    }
    nameActions[action]()
  })
}

const bindEventFilter = function() {
  log("Start to Event Filter")
  const filterCheckbox = document.querySelector('.respond')
  bindEvent(filterCheckbox,'change',function(event) {
    log("Start to filter")
    const ul = document.querySelector('#invitedList')
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
