// bindEvent
const bindEvent = function(elem,eventType,selector,fn) {
  if (fn == null) {
    fn = selector;
    selector = null;
  }
  elem.addEventListener(eventType,function(event) {
    //use event delegation
    if (selector) {
      const target = event.target;
      if (target.matches(selector)) {
        fn.call(target,event);
      }
    } else {
      fn(event);
    }
  });
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

  bindEvent(ul,'click','button',function() {
    const listItem = this.parentNode;
    const action = this.textContent;
    const nameActions = {
      Remove: ()=> {
        ul.removeChild(listItem);
      },

      Edit: ()=> {
        const span = listItem.firstElementChild;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        listItem.insertBefore(input,span)
        listItem.removeChild(span);
        this.textContent = "Save";
      },

      Save: ()=> {
        const input = listItem.firstElementChild;
        const span = document.createElement('span');
        span.textContent = input.value;
        listItem.insertBefore(span,input);
        listItem.removeChild(input);
        this.textContent = "Edit";
      }
    };
    nameActions[action]();
  });


  bindEvent(filterCheckbox,'change',function(e) {
    const isChecked = e.target.checked;
    const listItem = ul.children;
    if (isChecked) {
      for (let i = 0; i < listItem.length; i++) {
        if (!listItem[i].className) {
          listItem[i].style.display = "none";
        } else {
          const checkbox = listItem[i].querySelector('input');
          checkbox.style.display = "none";
        }
      }
    } else {
      for (let i = 0; i < listItem.length; i ++) {
        if (!listItem[i].className) {
          listItem[i].style.display = "" ;
        } else {
          const checkbox = listItem[i].querySelector('input');
          checkbox.style.display = "";
        }
      }
    }
  });
});
