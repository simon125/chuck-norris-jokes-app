

//?firstName=
//?lastName=
//http://api.icndb.com/jokes/random?limitTo=[nerdy,explicit]
//
//
const setCategoriesOfJokes = (categories) => {
    console.log(categories)
    const categoriesUI = categories.map(el =>
        `<option value="${el}">${el}</option>`
    )
    categoriesUI.push('<option value="every">every</option>')
    document.querySelector('select').innerHTML = categoriesUI.join('')
}

const setCountOfJokes = (countOfJokes) => {
    document.querySelector('#actualCountOfJokes').innerText = `${countOfJokes}`
    document.querySelector('small.text-muted').innerText = `Maximum value: ${countOfJokes}`
}
const fetchFromLocalStorage = () => {

}
const addToLocalStorage = () => {

}
const deleteFromLocalStorage = () => {

}
const displayStoredJokes = () => {

}

const getDataFromNorrisAPI = () => {

    const xhrCategories = new XMLHttpRequest()
    const xhrCountOfJokes = new XMLHttpRequest()

    xhrCountOfJokes.open('GET', 'http://api.icndb.com/jokes/count', true)
    xhrCategories.open('GET', 'http://api.icndb.com/categories', true)

    xhrCategories.onload = () => {
        if (xhrCategories.status === 200) {
            const categories = JSON.parse(xhrCategories.responseText)
            console.log(categories)
            setCategoriesOfJokes(categories.value)
        }
    }
    xhrCountOfJokes.onload = () => {
        if (xhrCountOfJokes.status === 200) {
            const countOfJokes = JSON.parse(xhrCountOfJokes.responseText)
            setCountOfJokes(countOfJokes.value)
        }
    }

    xhrCategories.send()
    xhrCountOfJokes.send()

}

const displayJokes = (jokes, category) => {
    const output = document.getElementById('output')
    output.innerHTML = ''
    jokes.map(el => {
        const card = document.createElement('div')
        const categories = el.categories.join(' ')
        card.className = 'card mt-3'
        card.innerHTML = `
            <div class="card-header">
                <span class="badge badge-primary">${categories}</span>
            </div>
            <div class="card-body">
            <p class="card-text">${el.joke}</p>
            </div>
            <div class="card-footer"><button class="btn btn-success">Add to collection</button></div>
        `
        output.appendChild(card)
    })
}
const displayAlert = () => {
    const output = document.getElementById('output')
    const alert = document.createElement('div')
    alert.className = 'alert alert-danger'
    alert.innerText = 'Something went wrong!'
    output.appendChild(alert)
    setTimeout(() => {
        output.querySelector('div.alert').remove()
    }, 2000)

}

const getJokesFromServer = (number, limitTo, firstName, lastName) => {

    let url = `http://api.icndb.com/jokes/random/${number}?limitTo=[nerdy,explicit]&firstName=Szymon&lastName=Oleszek`

    if (limitTo.length !== 0 && limitTo[0] !== 'every') {
        if (limitTo.length == 2) url = `http://api.icndb.com/jokes/random/${number}?limitTo=[${limitTo[0]},${limitTo[1]}]&`
        else {
            url = `http://api.icndb.com/jokes/random/${number}?limitTo=[${limitTo[0]}]&`
        }
    } else {
        url = `http://api.icndb.com/jokes/random/${number}?`
    }

    if (firstName && lastName) {
        url = url + `firstName=${firstName}&lastName=${lastName}`
    } else if (firstName !== '') {
        url = url + `firstName=${firstName}`
    } else if (lastName !== '') {
        url = url + `lastName=${lastName}`
    } else {
        url = url
    }

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            if (response.type === 'success') displayJokes(response.value)
            else {
                displayAlert()
            }
        } else console.log('dupa zbita')
    }
    xhr.send()
}

const getJokesFormSubmitHandle = e => {
    e.preventDefault()
    const number = document.querySelector('input[type="number"]').value

    const firstName = e.target.form.firstName.value

    const lastName = e.target.form.lastName.value
    const category = e.target.form.category.value
    getJokesFromServer(number, [category], firstName, lastName)
}

document.addEventListener("DOMContentLoaded", e => {
    getDataFromNorrisAPI()
});

document.getElementById('submitFormBtn').addEventListener('click', getJokesFormSubmitHandle)