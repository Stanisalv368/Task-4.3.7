const input = document.querySelector(".input");
const repNameList = document.querySelector(".autocomplete-list");
const mesto = document.querySelector(".response-list");

let nameRep = [];

const debounce = (fn, ms) => {
  let timer;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timer);
    timer = setTimeout(fnCall, ms);
  };
};

function loadRep(data, element) {
  if (data) {
    let text = "";
    let count = 0;
    data.forEach((item) => {
      count++;
      if (count <= 5) {
        text += `<li><button>${item}</button></li>`;
      }
    });
    element.insertAdjacentHTML("afterbegin", text);
  }
}

const searchRepos = debounce(searcRepos, 400);

input.addEventListener("keyup", searchRepos);

async function searcRepos() {
  const valueInput = input.value;
  repNameList.style.display = "block";
  return await fetch(
    `https://api.github.com/search/repositories?q=${valueInput}`
  ).then((res) => {
    res.json().then((data) => {
      nameRep = data.items.map((el) => el.name);
      loadRep(nameRep, repNameList);
      const buttons = document.querySelectorAll("button");
      for (btn of buttons) {
        btn.addEventListener("click", (e) => {
          let value = e.target.innerText;
          const fragment = document.createDocumentFragment();
          let countVelue = 0;
          data.items.forEach((item) => {
            countVelue++;
            if (countVelue <= 3) {
              if (item.name === value) {
                const ul = document.createElement("ul");
                const li = document.createElement("li");
                const li1 = document.createElement("li");
                const li2 = document.createElement("li");
                const btn = document.createElement("button");
                li.textContent = `Name: ${item.name}`;
                li1.textContent = `Owner: ${item.owner.login}`;
                li2.textContent = `Stars: ${item.stargazers_count}`;
                ul.appendChild(li);
                ul.appendChild(li1);
                ul.appendChild(li2);
                ul.appendChild(btn);
                fragment.appendChild(ul);
                input.value = "";
                repNameList.style.display = "none";
              }
            }
          });
          mesto.prepend(fragment);
          const btnRes = mesto.querySelectorAll("button");
          for (itme of btnRes) {
            itme.addEventListener("click", (e) => {
              e.target.parentElement.remove();
            });
          }
        });
      }
    });
  });
}
