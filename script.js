// const shortid = require("shortid");

let addBtn = document.querySelector(".add-btn");
let addFlag = false;//toggle display of modal(ticket)
//to remove
let removeFlag = false;
let removeBtn = document.querySelector(".remove-btn");

let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textarea = document.querySelector(".textarea-cont");

let colors = ["lightpink", "lightblue", "lightgreen", "black"]; 
let modalPriorityColor = colors[colors.length-1]; //choosing default color

let allPriorityColor = document.querySelectorAll(".priority-color");

let toolboxColors = document.querySelectorAll(".color");

let ticketArr = []; //Array to store the object of tickets


//Display tickets From LOcal Storage
if(localStorage.getItem('jiraa_tickets')){
    ticketArr = JSON.parse(localStorage.getItem("jiraa_tickets"))
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}

//TOOlBox feature to display only selected priority tickets
for(let i=0;i<toolboxColors.length;i++){
     toolboxColors[i].addEventListener("click", (e)=>{
        let currToolboxColor = toolboxColors[i].classList[0];
        // console.log(currToolboxColor);
        let filteredTickets =  ticketArr.filter((ticketObj, idx) => {
            return currToolboxColor === ticketObj.ticketColor;
        });

        //remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
        //display filtered tickets
        filteredTickets.forEach((ticketObj) =>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
     })

}


//Toolbox double click feature to display all tickets
let toolBoxCont = document.querySelector(".toolbox-cont");
toolBoxCont.addEventListener("dblclick", (e) =>{
    let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketArr.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
});




//listener for modal priority coloring
allPriorityColor.forEach((colorEle) => {
    colorEle.addEventListener("click", (e) =>{
        allPriorityColor.forEach((colorElem) =>{
            colorElem.classList.remove("border");
        })
        colorEle.classList.add("border");
        modalPriorityColor = colorEle.classList[0];
        // console.log(modalPriorityColor);
        createTicket(modalPriorityColor,textarea.value);
        modalCont.style.display = "none";
        addFlag= false;
        textarea.value = "";
        modalPriorityColor = colors[colors.length-1];
        allPriorityColor.forEach((colorElem) =>{
            colorElem.classList.remove("border");
        })
        allPriorityColor[allPriorityColor.length-1].classList.add("border")
    });
});



//To save the ticket using Enter key
modalCont.addEventListener("keydown", (e)=>{
    let key = e.key;
    if(key === "Enter"){
        // console.log(modalPriorityColor + " after shift");
        createTicket(modalPriorityColor,textarea.value);
        modalCont.style.display = "none";
        addFlag= false; //to toggle display of modal
        textarea.value = ""; //remove text inside textarea 
        modalPriorityColor = colors[colors.length-1];
    }
});


//Add button functionality
addBtn.addEventListener("click", (e) =>{
    //display Modal
    //generate ticket

    //addflag = true -> display modal
    addFlag = !addFlag; //toggle display of modal(ticket)
    if(addFlag){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
});






//Create ticket function and push to array
function createTicket(ticketColor, ticketTask, ticketID){
    
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="taskarea">
        ${ticketTask}
    </div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>
    `;
    mainCont.appendChild(ticketCont);

    //create object of ticket and add to arr
    if(!ticketID){
        ticketArr.push({ticketColor, ticketTask, ticketID: id});
        localStorage.setItem("jiraa_tickets", JSON.stringify(ticketArr));
    }

    handleRemoval(ticketCont,id);
    handlelock(ticketCont , id);
    handleColor(ticketCont , id);
}


//Handle color when click on color bar of the ticket
function handleColor(ticket, id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) =>{
        //get ticket idx from ticketArr
        let ticketIDx = getTicketIdx(id);

        let currTicketColor = ticketColor.classList[1];
        let currColorIdx = colors.findIndex((color) =>{
            return currTicketColor === color;
        })
        currColorIdx = (currColorIdx +1)%colors.length;
        let newTicketColor = colors[currColorIdx];
        ticketColor.classList.remove(currTicketColor);
        ticketColor.classList.add(newTicketColor);

        //modify data in local storage
        ticketArr[ticketIDx].ticketColor = newTicketColor;
        localStorage.setItem("jiraa_tickets", JSON.stringify(ticketArr));
    });
}

//to get ticket idx in ticket arr
function getTicketIdx(id) {
let ticketIdx = ticketArr.findIndex((tickeObj) => {
return id === tickeObj.ticketID;
})
return ticketIdx;
}


//Delete button toggle functionality
removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;

    if(removeFlag){
        removeBtn.classList.add('btn-background')
        console.log(removeFlag);
        
    }else{
        removeBtn.classList.remove('btn-background')
        console.log(removeFlag);
    }

    
})

//DELETe Functionality
function handleRemoval(ticket, id){
        
        ticket.addEventListener('click', (e) => {
            if(!removeFlag) return; 
            let ticketIdx = getTicketIdx(id);
            ticketArr.splice(ticketIdx,1);
            localStorage.setItem("jiraa_tickets", JSON.stringify(ticketArr));
            ticket.remove();
        })      
}
             
        
        
        

    

//Lock FUnctionality to edit content
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
function handlelock(ticket, id){
    let lockBtn = ticket.querySelector(".ticket-lock");
    let ticketLock = lockBtn.children[0];
    let ticketTaskarea = ticket.querySelector(".taskarea");

    ticketLock.addEventListener("click", (e)=>{
        let ticketIdx = getTicketIdx(id)
        if(ticketLock.classList.contains(lockClass)){
        ticketLock.classList.remove(lockClass);
        ticketLock.classList.add(unlockClass);
        ticketTaskarea.setAttribute("contenteditable", "true");
        }else{
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskarea.setAttribute("contenteditable", "false");
        }

        //Modify ticket task in local storage
        ticketArr[ticketIdx].ticketTask = ticketTaskarea.innerText;
        localStorage.setItem("jiraa_tickets", JSON.stringify(ticketArr));
        l
    })
}