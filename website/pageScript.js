prev = window.onload();
window.onload = () => {
    prev && prev();
    if(isLoggedIn()) {
        checkGroupMembership();
    }
}

function checkGroupMembership() {
    getGroupIBelongTo().then(group_id => {
        switchToUserScreen();
    }).catch(err => {
        reset_swaps();
        swap("loginScreen", "groupJoinScreen");
    });
}

function logInSignUp(type) {
    const usernameElm = document.getElementById("username");
    if(!checkWarnTextVal(usernameElm)) return;
    const passwordElm = document.getElementById("password");
    if(!checkWarnTextVal(passwordElm)) return;
    
    username = usernameElm.value;
    password = passwordElm.value;
    
    localStorage.setItem("user_name", username); localStorage.setItem("user_pass", password); // ????
    
    login(username, password);
}

function joinGroupButton() {
    const groupElm = document.getElementById("groupID");
    if(!checkWarnTextVal(groupElm)) return;
    const group_id = groupElm.value;
    joinGroup(group_id).then(() => {
        reset_swaps();
        checkGroupMembership();
    });
}

function createGroupButton() {
    const groupElm = document.getElementById("groupID");
    if(!checkWarnTextVal(groupElm)) return;
    const group_id = groupElm.value;
    // TODO: change your group id to this one
    reset_swaps();
    // checkGroupMembership();
}

function createTaskElement(task) {
    console.log(task);
    const elm = document.createElement("div");
    elm.className = "taskElement";
    
    const head = document.createElement("h2");
    head.className = "taskHead";
    head.innerHTML = task["task_name"];
    elm.appendChild(head);

    for(const [k, v] of Object.entries({
        "Points": task['points'],
        "Time": task['time'],
        "Description": task["description"]
    })) {
        const t = document.createElement("h5");
        t.innerHTML = `${k}: ${v}`;
        elm.appendChild(t);
    }
    return elm;
}
function createRewardElement(reward) {
    const elm = document.createElement("div");
    // add task properties to div
    return elm;
}

async function switchToUserScreen() {
    reset_swaps();
    swap("login_gui", "user_panel");
    const myPoints  = await getMyPoints();
    const myTasks   = await getTasksFromGroupIBelong();
    // const myRewards = await getRewardsFromGroupIBelong();
    // const rewards = getRewardsFromGroupIBelong(task);
    // const reward_container = document.getElementById("reward_container");
    // reward_container.children = []
    // for(const reward of rewards) {
        // task_container.appendChild(createRewardElement(reward));
    // }
    
    const userInfoTextElm = document.getElementById("userInfoText");
    userInfoTextElm.innerHTML = `${username} - ${myPoints} points`;
    
    const task_container = document.getElementById("task_container");
    
    task_container.children = []
    for(const task of myTasks) {
        task_container.appendChild(createTaskElement(task));
    }
}