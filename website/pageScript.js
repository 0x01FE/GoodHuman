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
    
    const username = usernameElm.value;
    const password = passwordElm.value;
    
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
    const elm = document.createElement("div");
    // add task properties to div
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
    const myRewards = await getRewardsFromGroupIBelong();
    
    const userInfoTextElm = document.getElementById("userInfoText");
    userInfoTextElm.innerHTML = `${username} - ${myPoints} points`;
    
    const tasks = getTaskFromGroupIBelong(task);
    const rewards = getRewardsFromGroupIBelong(task);
    const task_container = document.getElementById("task_container");
    const reward_container = document.getElementById("reward_container");
    
    task_container.children = []
    reward_container.children = []
    for(const task of tasks) {
        task_container.appendChild(createTaskElement(task));
    }
    for(const reward of rewards) {
        task_container.appendChild(createRewardElement(reward));
    }
}