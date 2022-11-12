// const host = window.location.protocol + "//" + window.location.host + "/";
const host = "http://127.0.0.1:5000/";

var user_name = null;
var user_pass = null;

window.onload = () => {
    user_name = localStorage.getItem("user_name");
    user_pass = localStorage.getItem("user_pass");
    if(user_name && user_pass) login(user_name, user_pass)
}
function isLoggedIn() {
    return (user_name && user_pass);
}
function login(user_name, user_pass) {
    createUser().then(() => {
        localStorage.setItem("user_name", user_name);
        localStorage.setItem("user_pass", user_pass);
    }).catch(err => console.log("Error creating/logging in user!", err));
}
function getHttp(path, headers) {
    console.log("GETTING!", path, headers);
    return new Promise(async (resolve, reject) => {
        if (!headers) {
            headers = {}
        }
        headers.Accept = 'application/json';
        headers['Content-Type'] = 'application/json';
        headers['Access-Control-Allow-Origin'] = '*'
        headers.user_name = user_name;
        headers.user_pass = user_pass;
        const response = await fetch(host + path, {
            method: 'GET',
            headers: headers,
        });

        response.json().then(data => {
            console.log("GOT JSON: ", data);
            resolve(data);
        }).catch(error => {
            console.log("NO JSON :(")
            resolve({})
            // reject(error);
        })
    })
}

function postHttp(path, body, headers) {
    console.log("POSTING!", path, body, headers);
    return new Promise(async (resolve, reject) => {
        if (!headers) {
            headers = {}
        }
        headers.Accept = 'application/json';
        headers['Content-Type'] = 'application/json';
        headers['Access-Control-Allow-Origin'] = '*'
        headers.user_name = user_name;
        headers.user_pass = user_pass;
        
        const response = await fetch(host + path, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });
        response.json().then(data => {
            console.log("GOT JSON: ", data);
            resolve(data);
        }).catch(error => {
            console.log("NO JSON :(");
            resolve({});
            // reject(error);
        })
    })
}

function hashPassword(pass) {
    return pass;
}
function createUser() {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("members/add", {});
        if (res.group_id) {
            resolve(res.group_id);
        } else {
            reject(res);
        }
    });   
}

function joinGroup(group_id) {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("members/joingroup", {
            group_id: group_id,
        });
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getGroupIOwn() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("members/group");
        if (res.group_id) {
            resolve(res.group_id)
        } else {
            reject(res);
        }
    })
}

function getGroupIBelongTo() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("members/allgroups")
        if (res.group_id) {
            resolve(res.group_id);
        } else {
            reject(res);
        }
    })
}

function getMyPoints() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("currency/user");
        if (res.points) {
            resolve(res.points);
        } else {
            reject(res);
        }
    })
}

function setUserPoints(user_name, points) {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("currency/set", {
            user_name: user_name,
            points: points,
        });
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function redeemReward(taskName) {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("task/submit", {
            reward_name: taskName,
        });
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function addTask(taskName, description, time, points, repeat) {
    return new Promise(async (resolve, reject) => {
        let postBody = {
            task_name: taskName,
            description: description,
            type: "one off",
            time: time,
            points: points,
        }
        if (repeat != null) {
            postBody.type = "repeat";
            postBody.repeat = repeat;
        }
        res = await postHttp("task/add",postBody);
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getUserSubmittedRewards() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getUserSubmittedRewards");
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function reviewUserSubmittedTask(review, task_id) {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("reviewUserSubmittedTask", {
            review: review,
        }, {task_id: task_id});
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getTaskFromGroupIOwn(task) {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTaskFromGroupIOwn", {task_name: task});
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getTaskFromGroupIBelong(task) {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTaskFromGroupIBelong", {task_name: task});
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getTasksFromGroupIOwn() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTasksFromGroupIOwn");
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getTasksFromGroupIBelong() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTasksFromGroupIBelong");
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function addRewards(rewardName, description, points) {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("addReward", {
            reward_name: rewardName,
            description: description,
            points: points,
        });
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getUserSubmittedTasks() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getUserSubmittedTasks");
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function reviewUserSubmittedReward(review, task_id) {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("reviewUserSubmittedReward", {
            review: review,
        }, {task_id: task_id});
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getRewardFromGroupIOwn(reward_id) {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardFromGroupIOwn", {reward_id: reward_id});
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getRewardFromGroupIBelong(reward_id) {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardFromGroupIBelong", {reward_id: reward_id});
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getRewardsFromGroupIOwn() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardsFromGroupIOwn");
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}

function getRewardsFromGroupIBelong() {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardsFromGroupIBelong");
        if (!res.error) {
            resolve(res);
        } else {
            reject(res);
        }
    })
}
