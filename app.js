// Tüm elementleri seçtik
const form=document.querySelector("#todo-form");
const todoinput=document.querySelector("#todo");
const todolist=document.querySelector(".list-group");
const firstcardbody=document.querySelectorAll(".card-body")[0];
const secondcardbody=document.querySelectorAll(".card-body")[1];
const filter=document.querySelector("#filter");
const clearbutton=document.querySelector("#clear-todos");

eventListener();


function eventListener(){//Tüm eventler

    form.addEventListener("submit", addtodo);
    document.addEventListener("DOMContentLoaded",LoadedAllTodos);
    secondcardbody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterdtodos);
    clearbutton.addEventListener("click", clearAllTodoas);

}

function clearAllTodoas(e){
    if(confirm("Tüm Todoları Temizlemek İstediğinize Emin Misiniz?")){
        //arayüzden todoları silmek
        while(todolist.firstElementChild!=null){
            todolist.removeChild(todolist.firstElementChild);


        }
        // localstrogeden tamamını silmek
        localStorage.removeItem("todos");
    }

}

function filterdtodos(e){
    const filterValue=e.target.value.toLowerCase(); // Bütün Todoları küçük harfe çevirmek için
    const listItems=document.querySelectorAll(".list-group-item");

    listItems.forEach(function(items){
        const text =items.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){//aranan değer todoların içinde var mı diye kontrol ediyoruz
            //bulamadı
            items.setAttribute("style", "display:none !important"); //css özelliği eklemek için

        }
        else{
            items.setAttribute("style", "display:block"); //css özelliği eklemek için
        }

    });
}

// Todoları yani li classlarını arayüzden silmek için
function deleteTodo(e){
    if(e.target.className==="fa fa-remove"){
        e.target.parentElement.parentElement.remove();// li yi silebilmek için iki üste çıktık li yi sildik.
        deleteTodoFromStroge(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo başarılı bir şekilde silindi...");
    }

}

function deleteTodoFromStroge(deletetodo){
    let todos=getTodosFromStroge(); //local strogeden Todoları array olarak aldık
         todos.forEach(function(todo,index){
            if(todo === deletetodo){
             todos.splice(index,1); //arraydan veri sil ek için kullanılır seçilen indeksten itibaren 1 tane veri silecek
            }
            });
            localStorage.setItem("todos", JSON.stringify(todos));
}

// todoları localstrogeden alıp sayfaya yüklenmesi için olan fonksiyon.
function LoadedAllTodos(){
    let todos=getTodosFromStroge();

    todos.forEach(function(todo){
        addtodoToUI(todo);
    })

}
function todoControl(Newtodo) {//Girilen todo önceden girilmiş mi diye kontrol ettik.
    let control = getTodosFromStroge();
    if (control.indexOf(Newtodo) === -1) {
        return false;
    }
    return true;
}

function addtodo(e){
const Newtodo=todoinput.value.trim();

if(Newtodo===""){
    showAlert("danger","Lütfen bir todo girin...");
    /* <div class="alert alert-danger" role="alert">
                        This is a danger alert—check it out!
                      </div>*/

}
else if (todoControl(Newtodo)) {
    showAlert("warning", "Böyle bir todo zaten var!");
}
else{

    addtodoToUI(Newtodo);
    addtodoTostroge(Newtodo);
    showAlert("success","Başarılı bir şekilde eklendi ...");
    }
    e.preventDefault();
    }

function getTodosFromStroge(){//strogeden Todoları alma
    let todos;
    if(localStorage.getItem("todos")===null){
        todos=[];
    }
    else{
        todos=JSON.parse(localStorage.getItem("todos"));//string olan ifadeyi diziye çevirmek için kullanılır.
    }
     return todos;
}

// tarayıcıda uygulma kısmında bulunan storage ye kayıt ettiriyoruz. Tarayıcıyı kapatsak bile gitmemesi için 
function addtodoTostroge(Newtodo){
    // let todos;
    // if(localStorage.getItem("todos")===null){
    //     todos=[];
    // }
    // else{
    //     todos=JSON.parse(localStorage.getItem("todos"));//strin olan ifadeyi diziye çevirmek için kullanılır.
    // }
    let todos=getTodosFromStroge();//üst tarafrta yazdıgımız fonksiyonu çagırdık.
    todos.push(Newtodo);//bize gönderilen stringi eklemek için
    localStorage.setItem("todos", JSON.stringify(todos));//degeri güncellemek için kullandık

}

function showAlert(type,message){
    const alert=document.createElement("div");
    alert.className=`alert alert-${type}`; // tipi danger olunca kırmızı, success olunca yeşil olması için
    alert.textContent=message;
    firstcardbody.appendChild(alert);
// oluştuktan 2 saniye sonra alerti silmesi için olan fonksiyon
    setTimeout(function(){
        alert.remove();
    },2000)
    

}

function addtodoToUI(Newtodo){//string degerini UI ya string item olarak ekeleyecek
    /*
    <li class="list-group-item d-flex justify-content-between">
    Todo 1
    <a href = "#" class ="delete-item">
    <i class = "fa fa-remove"></i>
    </a></li>*/

    //list item oluşturma
    const listItem=document.createElement("li");
    //Link oluşturma
    const link=document.createElement("a");
    link.href="#";
    link.className="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    listItem.className="list-group-item d-flex justify-content-between";
    //text note ile tododa yazacak texti çektik
    listItem.appendChild(document.createTextNode(Newtodo));
    listItem.appendChild(link);

    // todo liste list itemi eklememiz gerekiyor.
    todolist.appendChild(listItem);
    todoinput.value="";//todo ekledikten sonra inputun içindekini boşaltmak için
}