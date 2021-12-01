//------User Lists



async function writeUserTodoList() {
    //temporary user for testing
    let user = localStorage.getItem("userid")
    let url = "/user/?userid=" + user;         

    try {
        let response = await fetch(url);
        let data = await response.json();
        
        if (response.status != 200) {
            throw data.error;
        }

        container.innerHTML = ""; //delete previous content
        
        for (let value of data) {
    let items;
    console.log(value)
    try{
      items = await getListItems(value.id)
    }catch(error){
      console.log(error)
    }
    let div = document.createElement("div");
    //div.classList.add("background")
    let date = document.createElement("p");
    console.log(value.date)
    date.innerHTML = new Date(value.date).toLocaleDateString();
    let listName = document.createElement("h2");
    listName.innerHTML = value.listname;
    div.appendChild(listName)
    div.appendChild(date);
    for(item of items){
      let listItem = document.createElement("div")
      listItem.innerHTML = item.item;
      let delbtn = document.createElement("button");
      delbtn.innerHTML = "Delete";
      console.log(item.itemid)
      let currentItemId = item.itemid
      delbtn.addEventListener("click", function(evt){
        //delete list item
        deleteListItem(currentItemId)
      })
      listItem.appendChild(delbtn);
      div.appendChild(listItem);
    }
    let id = document.createElement("p");
    id.innerHTML = value.id;
    div.appendChild(id);

    

    container.appendChild(div);

    let delbtn = document.createElement("button");
    delbtn.innerHTML = "Delete";

    delbtn.addEventListener("click", function (evt) {
      deleteListElement(value.id);

    });
    div.insertBefore(delbtn, div.lastElementChild);
  }
} catch (error) {
  console.log(error);
}
}
async function getListItems(listID){
let url = "/todoGetItems"
let updata = {
  id: listID
}
let cfg = {
  method: "POST",
  headers: {"content-type": "application/json"},
  body: JSON.stringify(updata)
}
try{
  let response = await fetch(url, cfg);
  let data = await response.json();
  console.log(data)
  
  if (response.status != 200) {
    throw data.error;
  }
  return data;
}catch(error){
  console.log(error);
}

}
//-----------------------------------------------
async function deleteListElement(todolistid) {
let url = "/todo";

let updata = {
  id: todolistid
};
let cfg = {
  method: "DELETE",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(updata)
};
try {
  let response = await fetch(url, cfg);
  let data = await response.json();

  if (response.status != 200) {
    throw data.error;
  }
  writeUserTodoList(); //refresh the list
} catch (error) {
  console.log(error);
}
}
async function deleteListItem(listItemID) {
console.log("item deleted: " + listItemID)
let url = "/todoitem";

let updata = {
  id: listItemID
};
let cfg = {
  method: "DELETE",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(updata)
};
try {
  let response = await fetch(url, cfg);
  let data = await response.json();

  if (response.status != 200) {
    throw data.error;
  }
  writeToDoList(); //refresh the list
} catch (error) {
  console.log(error);
}
}

//------All Lists
async function writeToDoList() {
  let url = "/todo";

  try {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)

    if (response.status != 200) {
      throw data.error;
    }

    container.innerHTML = "";

    for (let value of data) {
      let items;
      try{
        items = await getListItems(value.id)
      }catch(error){
        console.log(error)
      }
      let div = document.createElement("div");
      div.classList.add("listframe");
      
      let date = document.createElement("p");
      console.log(value.date)
      date.innerHTML = new Date(value.date).toLocaleDateString();
      let listName = document.createElement("h2");
      listName.innerHTML = value.listname;
      div.appendChild(listName)
      div.appendChild(date);
      for(item of items){
        let listItem = document.createElement("div")
        listItem.innerHTML = item.item;
        listItem.classList.add("listitem");
        let delbtn = document.createElement("button");
        delbtn.classList.add("button");
        delbtn.classList.add("right");
        delbtn.innerHTML = "Delete item";
        console.log(item.itemid)
        let currentItemId = item.itemid
        delbtn.addEventListener("click", function(evt){
          //delete list item
          deleteListItem(currentItemId)
        })
        listItem.appendChild(delbtn);
        div.appendChild(listItem);
      }
      let id = document.createElement("p");
      id.innerHTML = value.id;
      div.appendChild(id);

      container.appendChild(div);

      let delbtn = document.createElement("deleteButton");
      delbtn.innerHTML = "Delete List";
      delbtn.classList.add("deleteButton");
      

      delbtn.addEventListener("click", function (evt) {
        deleteListElement(value.id);

      });
      div.insertBefore(delbtn, div.lastElementChild);
    }
  } catch (error) {
    console.log(error);
  }
}
