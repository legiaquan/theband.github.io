let promise = new Promise(
    // Executor
    function (resolve, reject) {
        // logic
        // success resolve
        // fail reject
        resolve();
    }
);

promise.
    then(function (){
        console.log("success");
    })
    .catch(function (err) {
        console.log("err");
    })
    .finally(function () {
        console.log("done");
    });

let promise1 = new Promise(function (resolve) {
    setTimeout(function(){
        resolve(['1']);
    },2000)
})

// let promise2 = new Promise(function (resolve) {
//     setTimeout(function(){
//         resolve(['2', '3']);
//     },5000)
// })

let promise2 = Promise.reject('Error');


Promise.all([promise1,promise2])
    .then(function (result){
        let array = [...result[0],...result[1]];
    })
    .catch(function(err){
        console.log("🚀 ~ file: promise.js ~ line 45 ~ err", err);
    })


let users = [
    {
        id: 1,
        name: 'John',
    },
    {
        id: 2,
        name: 'Smith',
    },
    {
        id: 3,
        name: 'Mike',
    }
];

let comments = [
    {
        id: 1,
        id_user: 1,
        comment: 'Hello there!',
    },
    {
        id: 3,
        id_user: 2,
        comment: 'Hello John!',
    },
];

function getComments () {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(comments);
        },1000)
    })
}

function getUsersById (userIds){
    return new Promise(function (resolve) {
        var result = users.filter((user) => {
            return userIds.includes(user.id);
        })

        setTimeout(function () {
            resolve(result);
        }, 1000)
    })
};

getComments()
    .then(function (comments) {
        let userIds = comments.map((user) => user.id_user)
        return getComments(userIds)
                    .then(function (user){
                        return {
                            users: users,
                            comments: comments,
                        };
                    });
    }).then(function (data) {
        let commentBlock = document.querySelector('.comment-block');
        let html = '';

        data.comments.map((comment) => {
            var user = data.users.find((user) => comment.id_user == user.id);
            html += `<li>${user.name}: ${comment.comment}</li>`
        })

        commentBlock.innerHTML = html;
    })

let postApi = 'http://localhost:3000/courses';

/* CRUD
    - Create -> POST
    - READ -> GET
    - UPDATE -> PUT, PATCH
    - DELETE -> DELETE
*/

function getCourse (callback) {
    fetch(postApi)
        .then(response => response.json())
        .then(callback)
        .catch(err => console.error(err));
}

function renderCourses (courses) {
    var html = courses.map(course => `<li>
            <h2>${course.name}</h2>
            <p>${course.description}</p>
        </li>`)
        html = html.join('');
        document.querySelector('.courses-block').innerHTML = html;
}

function start() {
    getCourse(renderCourses);
    handleCreateCourse();
}
start();


function handleCreateCourse () {
    let createBtn = document.querySelector('#create');
    createBtn.onclick = function () {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        
        var formData = {
            name : name,
            description : description
        };
        createCourse(formData, renderCourses);
    }
}

function createCourse (data, callback) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    } ;
    console.log(options);
    fetch(postApi, options)
        .then(response => response.json())
        .then(callback)
        .catch(err => console.error(err));
}