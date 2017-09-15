function bindEvent (elem,type,selector,fn) {
  if (fn == null) {
    fn = selector;
    selector = null;
  }
  elem.addEventListener(type,function(e) {
    if (selector) {
      const target = e.target;
      if (target.matches(selector)) {
        fn.call(target,e);
      }
    } else {
      fn(e);
    }
  });
}

bindEvent(document,'DOMContentLoaded', function() {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');

  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckbox = document.createElement('input');

  filterCheckbox.type = "checkbox";
  filterLabel.textContent = "Hide those who haven't responded";
  filterLabel.appendChild(filterCheckbox);
  div.appendChild(filterLabel);
  mainDiv.insertBefore(div,ul);

  function createLi(text) {

    function createElement (elemName,proName,value) {
      const elem = document.createElement(elemName);
      elem[proName] = value;
      return elem;
    }

    function appendToLi (elemName,proName,value) {
      const elem = createElement(elemName,proName,value);
      li.appendChild(elem);
      return elem
    }

    const li = document.createElement('li');

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
    input.value = "";
    const li = createLi(text);
    ul.appendChild(li);
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
    if (this.textContent === "Remove") {
      ul.removeChild(listItem);
    } else if (this.textContent === "Edit") {
         const span = listItem.firstElementChild;
         const input = document.createElement('input');
         input.type = 'text';
         input.value = span.textContent;
         listItem.insertBefore(input,span);
         listItem.removeChild(span);
         this.textContent = "Save";
    } else if (this.textContent === "Save") {
        const input = listItem.firstElementChild;
        const span = document.createElement('span');
        span.textContent = input.value;
        listItem.insertBefore(span,input);
        listItem.removeChild(input);
        this.textContent = "Edit";
    }
  });

  bindEvent(filterCheckbox,'change',function(e) {
    const isChecked = e.target.checked;
    const listItem = ul.children;
    if (isChecked) {
      // const listItem = document.querySelectorAll('li');
      for (let i = 0; i < listItem.length; i++) {
        if (listItem[i].className === "") {
          listItem[i].style.display = "none";
        } else {
          listItem[i].style.display = "";
        }
      }
    } else {
      for (let i = 0; i < listItem.length; i ++) {
        if (listItem[i].className === "") {
          listItem[i].style.display = "" ;
        }
      }
    }
  });
});
