// const host = window.location.protocol + "//" + window.location.host + "/";
const host = "http://127.0.0.1:5000/";
var user_name = null;
var user_pass = null;

window.onload = () => {
    user_name = localStorage.getItem("user_name");
    user_pass = localStorage.getItem("user_pass");
    if(user_name && user_pass) login(user_name, user_pass)
}

var isLoggedIn = () => (user_name && user_pass);

var login = (user_name, user_pass) => {
    createUser().then(() => {
        localStorage.setItem("user_name", user_name);
        localStorage.setItem("user_pass", user_pass);
    }).catch(err => console.log("Error creating/logging in user!", err));
}

var getHttp = (path, headers) => {
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
            reject(error);
        })
    })
}

var postHttp = (path, body, headers) => {
    console.log("POSTING!", path, body, headers);
    return new Promise(async (resolve, reject) => {
        if (!headers) headers = {};
        headers.Accept = 'application/json';
        headers['Content-Type'] = 'application/json';
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
            reject(error);
        })
    })
}

var hashPassword = (pass) => pass;

var createUser = () => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("members/add", {});
        res.group_id ? resolve(res.group_id) : reject(res);
    });   
}

var joinGroup = (group_id) => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("members/joingroup", { group_id: group_id });
        res.error ? reject(res) : resolve(res);
    });
}

var getGroupIOwn = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("members/group");
        res.group_id ? resolve(res.group_id) : reject(res);
    });
}

var getGroupIBelongTo = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("members/allgroups")
        res.group_id ? resolve(res.group_id) : reject(res);
    });
}

var getMyPoints = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("currency/user");
        res.points ? resolve(res.points) : reject(res);
    });
}

var setUserPoints = (user_name, points) => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("currency/set", { user_name: user_name, points: points });
        res.error ? reject(res) : resolve(res);
    });
}

var redeemReward = (taskName) => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("task/submit", { reward_name: taskName });
        res.error ? reject(res) : resolve(res);
    });
}

var addTask = (taskName, description, time, points, repeat) => {
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
        res.error ? reject(res) : resolve(res);
    });
}

var getUserSubmittedRewards = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getUserSubmittedRewards");
        res.error ? reject(res) : resolve(res);
    });
}

var reviewUserSubmittedTask = (review, task_id) => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("reviewUserSubmittedTask",
            { review: review }, 
            { task_id: task_id });
        res.error ? reject(res) : resolve(res);
    });
}

var getTaskFromGroupIOwn = (task) => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTaskFromGroupIOwn", {task_name: task});
        res.error ? reject(res) : resolve(res);
    });
}

var getTaskFromGroupIBelong = (task) => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTaskFromGroupIBelong", {task_name: task});
        res.error ? reject(res) : resolve(res);
    });
}

var getTasksFromGroupIOwn = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTasksFromGroupIOwn");
        res.error ? reject(res) : resolve(res);
    });
}

var getTasksFromGroupIBelong = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getTasksFromGroupIBelong");
        res.error ? reject(res) : resolve(res);
    });
}

var addRewards = (rewardName, description, points) => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("addReward", {
            reward_name: rewardName,
            description: description,
            points: points });
        res.error ? reject(res) : resolve(res);
    });
}

var getUserSubmittedTasks = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getUserSubmittedTasks");
        res.error ? reject(res) : resolve(res);
    });
}

var reviewUserSubmittedReward = (review, task_id) => {
    return new Promise(async (resolve, reject) => {
        res = await postHttp("reviewUserSubmittedReward",
            { review: review },
            {task_id: task_id});
        res.error ? reject(res) : resolve(res);
    });
}

var getRewardFromGroupIOwn = (reward_id) => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardFromGroupIOwn", {reward_id: reward_id});
        res.error ? reject(res) : resolve(res);
    });
}

var getRewardFromGroupIBelong = (reward_id) => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardFromGroupIBelong", {reward_id: reward_id});
        res.error ? reject(res) : resolve(res);
    });
}

var getRewardsFromGroupIOwn = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardsFromGroupIOwn");
        res.error ? reject(res) : resolve(res);
    });
}

var getRewardsFromGroupIBelong = () => {
    return new Promise(async (resolve, reject) => {
        res = await getHttp("getRewardsFromGroupIBelong");
        res.error ? reject(res) : resolve(res);
    });
}