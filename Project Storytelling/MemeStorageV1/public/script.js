let i = 0;
let elementArray = [];
let li = document.getElementById("listOfElements");


function buildDivs() {
    $(li).empty();
    for (element of elementArray) {
        let todo = document.createElement("div");
        todo.className = "input-group mb-2";
        if (element.claimed === false && element.finished === false && element.abandoned === false) {
            todo.innerHTML =
            `<div class="input-group mb-3" id="x` + element.id + `">
                <input type="text" class="form-control" placeholder="`+ element.input + `" aria-label="Recipient's username" aria-describedby="button-addon2" disabled>
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="claim('x` + element.id + `')">Claim</button>
            </div>`;
        }
        else if (element.claimed === true) {
            todo.innerHTML =
            `<div class="input-group mb-3">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" onclick="complete('x` + element.id + `')">
                </div>
                <input type="text" class="form-control" placeholder="`+ element.input + `" aria-label="Text input with checkbox" disabled>
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="abandon('x` + element.id + `')">Abandon</button>
            </div>`;
        }
        else if (element.abandoned === true)
        {
            todo.innerHTML =
            `<div class="input-group mb-3" id="x` + element.id + `">
                <input type="text" class="form-control" placeholder="`+ element.input + `" aria-label="Recipient's username" aria-describedby="button-addon2" disabled>
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="claim('x` + element.id + `')">Claim</button>
            </div>`;
        }
        else if (element.finished === true)
        {
            todo.innerHTML =
            `<div class="input-group mb-3">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" onclick="claim('x` + element.id + `')" checked>
                </div>
                <input type="text" class="form-control" placeholder="`+ element.input + `" aria-label="Text input with checkbox" style="text-decoration:line-through;" disabled>
            </div>`;
        }
        $(li).append(todo);
    }
}

$(document).ready(() => {
    $("body").on("click", "#addButton", function(){
        let input = document.getElementById("enterTask").value;
        if (input.trim().length != 0) {
            let id = i += 1
            let tmp = new taskState(id, input);
            elementArray.push(tmp);
            enterTask.value = "";
            $("#enterTask").attr('value') == "";
        }
        buildDivs();
    });
    $("#removeButton").click( ()=>{
        for (element of elementArray) {
            if (element.finished === true) {
                var index = elementArray.indexOf(element);
                if (index > -1) {
                    elementArray.splice(index, 1);
                }
            }
        }
        buildDivs();
    })
});

function claim(input) {
    for(element of elementArray)
    {
        if ("x" + element.id === input)
        {
            element.claimed = true;
            element.finished = false;
            element.abandoned = false;
        }
    }
    buildDivs();

}

function abandon(input) {
    for(element of elementArray)
    {
        if ("x" + element.id === input)
        {
            element.abandoned = true;
            element.claimed = false;
            element.finished = false;
        }
    }
    buildDivs();
}

function complete(input) {
    for(element of elementArray)
    {
        if ("x" + element.id === input)
        {
            element.abandoned = false;
            element.claimed = false;
            element.finished = true;
        }
    }
    buildDivs();
}

function taskState(id, inp) {
    this.id = id;
    this.input = inp;
    this.claimed = false;
    this.finished = false;
    this.abandoned = false;
}