const input = document.querySelector(".input");
const repNameList = document.querySelector(".autocomplete-list");
const responseList = document.querySelector(".response-list");

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
  element.replaceChildren();
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
      let funcClick = function (e) {
        let value = e.target.innerText;
        const fragment = document.createDocumentFragment();
        let countVelue = 0;
        data.items.forEach((item) => {
          countVelue++;
          if (countVelue <= 3) {
            if (item.name === value) {
              const responseItem = document.createElement("ul");
              const liName = document.createElement("li");
              const liOwner = document.createElement("li");
              const liStars = document.createElement("li");
              const btnClose = document.createElement("button");
              liName.textContent = `Name: ${item.name}`;
              liOwner.textContent = `Owner: ${item.owner.login}`;
              liStars.textContent = `Stars: ${item.stargazers_count}`;
              responseItem.appendChild(liName);
              responseItem.appendChild(liOwner);
              responseItem.appendChild(liStars);
              responseItem.appendChild(btnClose);
              fragment.appendChild(responseItem);
              input.value = "";
              repNameList.style.display = "none";
              btn.removeEventListener("click", funcClick);
            }
          }
        });
        responseList.prepend(fragment);
        const btnCloses = responseList.querySelectorAll("button");
        for (itme of btnCloses) {
          itme.addEventListener("click", (e) => {
            e.target.parentElement.remove();
          });
        }
      };
      const buttons = document.querySelectorAll("button");
      for (btn of buttons) {
        btn.addEventListener("click", funcClick);
      }
    });
  });
}
