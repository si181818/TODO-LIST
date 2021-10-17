let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", e=> {
    //避免form交出去
    e.preventDefault();
    
    //獲得input的值
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;
  //  console.log(todoText, todoMonth, todoDate);

    if(todoText === "") {
        alert("請輸入文字");
        return;
    }

    //建立一個todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    //創造 check 和 trash
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    trashButton.addEventListener("click", e=> {
    let todoItem = e.target.parentElement;
    
    todoItem.addEventListener("animationend", () => {

           //remove from local storage
           let text = todoItem.children[0].innerText;
           let myListArray = JSON.parse(localStorage.getItem("list"));
           myListArray.forEach((item, index) => {
               if(item.todoText == text){
                   myListArray.splice(index, 1);
                   localStorage.setItem("list", JSON.stringify(myListArray));
               }
           })

        todoItem.remove();
    })

    todoItem.style.animation =  "scaleDown 0.3s forwards";
    
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.5s forwards"

    //create an object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    //store data into an array of objects
    let myList = localStorage.getItem("list");
    if(myList ==null){
        localStorage.setItem("list",JSON.stringify([myTodo]));
    }else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));

    form.children[0].value = "";//清空THE TEXT INPUT
    section.appendChild(todo);
})

loadData();

function loadData() {
    let myList = localStorage.getItem("list");
if(myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach(item => {

        //create a todo
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoMonth + " / " + item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time);

            //創造 check 和 trash
        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fas fa-check-circle"></i>';

        completeButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
        })
    
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        trashButton.addEventListener("click", e=> {
        let todoItem = e.target.parentElement;
        
        todoItem.addEventListener("animationend", () => {
            
            //remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if(item.todoText == text){
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })

            todoItem.remove();
        })
    
        todoItem.style.animation =  "scaleDown 0.3s forwards";
        
        })

        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        section.appendChild(todo);
     })
   }
}


function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0 ;
    let j = 0 ;

    while(i < arr1.length && j < arr2.length) {
        if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        }else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        }else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                result.push(arr2[j]);
                j++;
            }else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while(i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while(j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if(arr.length ===1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

//console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //remove data
    let len = section.children.length;
    for(let i =0; i< len; i++){
        section.children[0].remove();
    }

    //Load data
    loadData();
}) 