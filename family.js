//宣告變數
const base_URL = 'https://lighthouse-user-api.herokuapp.com'
const index_URL = base_URL + '/api/v1/users/'
// const showAPI_URL = index_URL + id
const cardContainer = document.querySelector('#card-container')
const pagination = document.querySelector('#pagination')
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const btnFavorite = document.querySelector('#btn-favorite')
let users = []
const USERS_PER_PAGE = 20
let usersFilter = []



// 算出頁碼對應的users
function getUsersByPage(page) {
  // 1 0-14
  // 2 15-29
  // 3 30-44
  // 4 45-59
  const startData = (page - 1) * USERS_PER_PAGE
  return users.slice(startData, startData + USERS_PER_PAGE)
}

// render分頁器上的頁數
function renderPaginator(amount) {
  let totalPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= totalPages; page++) {
    rawHTML += `
  <li class="page-item"><a class="page-link" href="#" data-id="${page}">${page}</a></li>
    `
  }
  pagination.innerHTML = rawHTML
}

// 製作modal內容
function createModal(data) {
  const modalTitle = document.querySelector('#modal-title')
  const modalImage = document.querySelector('#modal-image')
  const modalUserAge = document.querySelector('#modal-user-age')
  const modalUserBirth = document.querySelector('#modal-user-birth')
  const modalUserEmail = document.querySelector('#modal-user-email')
  const modalUserGender = document.querySelector('#modal-user-gender')
  const modalUserUpdatedaAt = document.querySelector('#modal-user-updatedAt')

  axios.get(index_URL + data)
    .then(response => {
      let dataInfo = response.data

      modalTitle.innerText = dataInfo.name
      modalUserAge.innerText = 'Age : ' + dataInfo.age
      modalUserBirth.innerText = 'Birthday : ' + dataInfo.birthday
      modalUserEmail.innerText = 'Email : ' + dataInfo.email
      modalUserGender.innerText = 'Gender : ' + dataInfo.gender
      modalUserUpdatedaAt.innerText = 'Updated at : ' + dataInfo.updated_at
      modalImage.innerHTML = `
      <img src="${dataInfo.avatar}" alt="poster img">
      `
    })
    .catch(err => {
      console.log('error:' + err)
    })
}

// 新增收藏
function addToFavorite(btnId) {
  const favList = JSON.parse(localStorage.getItem('myFavoriteUsers')) || []
  let user = users.find((user) => user.id === btnId)
  if (favList.some((user) => user.id === btnId)) {
    return alert('已在收藏中')
  }
  favList.push(user)
  localStorage.setItem('myFavoriteUsers', JSON.stringify(favList))
}


// take search bar value
searchForm.addEventListener('submit', function getSearchValue(e) {
  e.preventDefault()
  let inputValue = searchInput.value.toLowerCase().trim()

  usersFilter = users.filter(user =>
    user.name.toLowerCase().includes(inputValue))

  if (usersFilter.length === 0) {
    alert('搜尋不到' + inputValue)
  }

  renderUsers(usersFilter)
  renderPaginator(usersFilter.length)

  searchInput.value = ''
})


// 分頁器 click
pagination.addEventListener('click', function onPaginationClick(e) {
  let onPage = Number(e.target.dataset.id)

  renderUsers(getUsersByPage(onPage))

})

// 取得id
cardContainer.addEventListener('click',
  function getUserId(e) {
    let targetParent = e.target.parentElement

    if (targetParent.matches('.clickCard')) {
      let userId = targetParent.dataset.id
      createModal(userId)
    } else if (targetParent.matches('.card-body')) {
      let userId = targetParent.parentElement.dataset.id
      createModal(userId)

    } else if (e.target.matches('.btn')) {
      // get btn id
      addToFavorite(Number(e.target.dataset.id))
    }

  })



// render user card
function renderUsers(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col mx-3">
      <div>
        <a data-bs-toggle="modal" data-bs-target="#userModal" class="container-a">
          <div class="card clickCard" data-bs-toggle="modal" data-bs-target="#userModal" data-id="${item.id}">
            <img src="${item.avatar}" alt="...">
            <div class="card-body">
               <h5 class="card-title text-center">${item.name}</h5>
             </div>
          </div>
        </a>
      </div>
      <button class="btn btn-light me-md-2" id="btn-favorite" type="button" data-id="${item.id}">+收藏</button>
    </div>
  `
  })
  cardContainer.innerHTML = rawHTML
}

// axios API
axios.get('https://lighthouse-user-api.herokuapp.com/api/v1/users')
  .then(res => {
    users.push(...res.data.results)
    renderPaginator(users.length)
    renderUsers(getUsersByPage(1))
  })
  .catch(err => {
    console.log(err)
  })