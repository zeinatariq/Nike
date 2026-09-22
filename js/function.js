function getStudent(studentId) {
    let student = { id: studentId };

    registerInputs.forEach(function (input) {
        let key = input.name,
            value = input.value;
        student[key] = value;
    });

    return student;
}

function addStudent() {
    let focusInput = registerForm.querySelector("input:focus"),
        invalidInput = registerForm.querySelector("input[data-valid='false']");
        
    focusInput?.blur();
    let invalidClassInput = registerForm.querySelector("input.is-invalid");

    if (invalidClassInput !== null || invalidInput !== null) {
        return;
    }
    
    let student = getStudent(++id);
    students.push(student);
    updateLocalstorage();
    showStudent(student);
    isNoData(students);
    resetForm();
}




function showStudent(student) {
    tableBody.innerHTML += `
        <tr data-student-id="${student.id}">
            <td>${student.id}</td>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.phone}</td>
            <td>
                <div class="buttons">
                    <button class="btn btn-info text-light me-2" onclick="insertStudentIntoForm(${student.id})">Edit</button>
                    <button class="btn btn-danger text-light" onclick="deleteStudent(${student.id},this)">Delete</button>
                </div>
            </td>
        </tr>
    `;
}

function showStudents(data) {
    tableBody.innerHTML = ` <tr>
        <td id="TableAlert" class="table-warning text-center" colspan="7">There are no data</td>
    </tr>`;
    data.forEach(function (student) {
        showStudent(student);
    });
    isNoData(data);
}

function checkInput(input) {
    let inputName = input.name,
        inputValue = input.value,
        isEmpty = inputValue === "",
        errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`),
        isInvalid = !regexInputs[inputName].test(inputValue),
        errorMsg = "";

    if (isEmpty) {
        errorMsg = "This field is required.";
    } else if (isInvalid) {
        errorMsg = "Invalid field.";
    }

    if (isEmpty || isInvalid) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        if (errorEle) {
            errorEle.textContent = errorMsg;
            errorEle.classList.remove('d-none');
        }
        input.dataset.valid = false;
    } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        if (errorEle) {
            errorEle.classList.add('d-none');
        }
        input.dataset.valid = true;
    }
}

function resetForm() {
    registerForm.reset();
    registerInputs.forEach(function (input) {
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        let errorEle = document.querySelector(`p.alert[data-error-name="${input.name}"]`);
        if (errorEle) {
            errorEle.classList.add('d-none');
        }
    });
    registerForm.setAttribute('data-type', 'add');
    delete registerForm.dataset.studentId;
}

function updateLocalstorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function getStudentIndex(id) {
    return students.findIndex((student) => student.id == id);
    
}

function deleteStudent(id, that) {
    if (!confirm("Are you sure?")) {
        return; 
    }
    let studentIndex = getStudentIndex(id),
        trEle = that.closest('tr');

    students.splice(studentIndex, 1);
    trEle.remove();
    updateLocalstorage();
    isNoData(students);
}
function isNoData(data){

    let TableAlert = document.querySelector("#TableAlert");
    if (data.length == 0) {
        TableAlert.classList.remove('d-none');
        
    } else {
        TableAlert.classList.add('d-none');
    }
}

function insertStudentIntoForm(id) {
    resetForm();
    let editStudent = students.find(function (student) {
        return student.id == id;
    }),
        formBtn = registerForm.querySelector("button");
    
    for (let input of registerInputs) {
        input.value = editStudent[input.name];
    };

    formBtn.textContent = "Edit";
    formBtn.classList.add('btn-info', 'text-light');
    formBtn.classList.remove('btn-success');
    registerForm.setAttribute('data-type', 'edit');
    registerForm.setAttribute('data-student-id', id);
}


function editStudent() {
    let studentId = registerForm.dataset.studentId,
        student = getStudent(studentId),
        studentIndex = getStudentIndex(studentId),
        trEle = tableBody.querySelector(`tr[data-student-id="${studentId}"]`);

    students[studentIndex] = student;

    trEle.innerHTML = `
        <td>${student.id}</td>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>${student.phone}</td>
        <td>
            <div class="buttons">
                <button class="btn btn-info text-light me-2" onclick="insertStudentIntoForm(${student.id})">Edit</button>
                <button class="btn btn-danger text-light" onclick="deleteStudent(${student.id},this)">Delete</button>
            </div>
        </td>`;

    updateLocalstorage();
    resetForm();
}


function search(searchValue) {
    let filteredStudents = students.filter(function (student) {
        return student.firstName.toLowerCase().includes(searchValue.toLowerCase()) || 
            student.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.email.toLowerCase().includes(searchValue.toLowerCase()) || 
            student.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.age.toLowerCase().includes(searchValue.toLowerCase());
    });
    showStudents(filteredStudents);
}
