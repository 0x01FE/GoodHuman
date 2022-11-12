# Endpoints

note that there might be more headers being sent to the endpoint but i only put the ones i'm actually using in the backend

# Members

### /members/add
type : POST
headers : {
    user_name : str,
    user_pass : str
}
payload : {
    group_id : int
}

returns 204

### /members/group
type : GET
headers : {
    user_name : str
}

return {group_id : int}

### /members/allgroups
type : GET
headers : {
    user_name : str
}

return {group_id : list}

### /members/joingroup
type : POST
headers : {
    user_name : str
}
payload : {
    group_id : int
}

return 204



# Currency

### /currency/user
type : GET
headers : {
    user_name : str
}

return {points : int}

### /currency/set
type : POST
payload : {
    user_name : str,
    points : int
}

return 204



# TASKS

### /task/submit
type : POST
headers : {
    user_name : str,
}
payload : {
    task_name : str,
    image : str
}
I'm assuming the image will be a str of b64 bytes

return 204

### /task/add
type : POST
payload : {
    task_name : str,
    points : int,
    type : str,
    repeat : str,
    time : str,
    description : str,
}
type ∈ {"one off", "repeat"}
repeat ∈ {"daily", "weekly"}

return 204


# REWARDS

### /reward/redeem
type : POST
headers : {
    user_name : str
}
payload : {
    reward_name : str
}

return 204





