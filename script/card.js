const dataCount = document.getElementById("count");

const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }

}

//main data load
const loadLesson = async () => {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const issues = await res.json();

    displayLesson(issues.data);

    return issues.data;
};
// modal 
const loadWordDetail = async (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    // console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}


const displayWordDetails = (lessons) => {
    console.log(lessons);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    
    <div class="">
                <h2 class="text-2xl font-bold mb-3">${lessons.title}</h2>

                <!-- Status Row -->
                <div class="flex items-center gap-3 text-sm mb-4">
                    <span class="badge badge-success">${lessons.status}</span>
                    <span class="text-gray-500">Opened by  ${lessons.author}</span>
                    <span class="text-gray-400">•</span>
                    <span class="text-gray-500">${new Date(lessons.createdAt).toLocaleDateString()}</span>
                </div>

                <!-- Tags -->
                <div class="flex gap-2 mb-4">
                    ${lessons.labels.map(label =>
        `<span class="badge badge-outline">${label}</span>`).join("")}
                </div>

                <!-- Description -->
                <p class="text-gray-600 mb-6">
                    ${lessons.description}
                </p>

                <!-- Info Card -->
                <div class="bg-base-200 rounded-lg p-5 flex justify-between items-center mb-6">
                    <div>
                        <p class="text-sm text-gray-500">Assignee:</p>
                        <p class="font-semibold">${lessons.assignee ? lessons.assignee : "Unassigned"}</p>
                    </div>

                    <div class="text-right">
                        <p class="text-sm text-gray-500">Priority:</p>
                        <span class="badge badge-error">${lessons.priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn btn-primary">Close</button>
                    </form>
                </div>
            </div>
    `;
    document.getElementById("word_modal").showModal();
}
//data load and append
const displayLesson = (lessons) => {
    dataCount.innerText = lessons.length;
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    lessons.forEach(lesson => {
        const borderTop = lesson.status === "open" ? "border-t-green-500" : "border-t-purple-500";
        const card = document.createElement("div");
        card.innerHTML = `
        <div onclick="loadWordDetail(${lesson.id})" class="max-w-sm bg-base-100 shadow-lg rounded-xl border ${borderTop} border-t-4">

            <!-- Top Bar -->
            <div class="h-1  rounded-t-xl"></div>

            <div class="p-5 space-y-4">

                <!-- Header -->
                <div  class="flex justify-between items-center">
                    <div  class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <img src="./assets/Open-Status.png" alt="">
                    </div>

                    <span class="badge bg-red-200">${lesson.priority}</span>
                </div>

                <!-- Title -->
                <h2 " class="text-lg font-semibold">
                    ${lesson.title}
                </h2>

                <!-- Description -->
                <p class="text-sm text-gray-500">
                    ${lesson.description}
                </p>

                <!-- Tags -->
                <div class="flex gap-2">
                    <span class="badge bg-red-200 gap-1">
                        <img src="./assets/Vector.png" alt=""> BUG
                    </span>

                    <span class="badge bg-yellow-100 gap-1">
                        <img src="./assets/Vector (1).png" alt=""> HELP WANTED
                    </span>
                </div>

            </div>

            <!-- Footer -->
            <div class=" text-gray-400 text-sm px-5 py-3 space-y-2 ">
                <p>${lesson.id} by ${lesson.author}</p>
                <p>${lesson.createdAt}</p>
            </div>

        </div>
        `;
        wordContainer.append(card);
    });
    manageSpinner(false);
};

const buttonStyle = async (btnName) => {
    manageSpinner(true);

    // console.log(btnName)
    const allButton = document.getElementById('allbutton');
    const openButton = document.getElementById('openbutton');
    const closedButton = document.getElementById('closedbutton');
    const data = await loadLesson();
    //  console.log(data);
    if (btnName === 'all') {
        allButton.classList.add('btn-primary')
        openButton.classList.remove('btn-success', 'text-white')
        closedButton.classList.remove('btn-error', 'text-white')
        displayLesson(data);
    }
    else if (btnName === 'open') {
        allButton.classList.remove('btn-primary')
        openButton.classList.add('btn-success', 'text-white')
        closedButton.classList.remove('btn-error', 'text-white')
        const filterData = data.filter(lesson => lesson.status == "open")
        displayLesson(filterData);
    }
    else if (btnName === 'closed') {
        allButton.classList.remove('btn-primary')
        openButton.classList.remove('btn-success', 'text-white')
        closedButton.classList.add('btn-error', 'text-white')
        const filterData = data.filter(lesson => lesson.status == "closed");
        displayLesson(filterData);
    };
};

loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then((data) => {
            const allWord = data.data;
            const filterWords = allWord.filter(lesson => lesson.title.toLowerCase().includes(searchValue))
            displayLesson(filterWords);
        })
});

