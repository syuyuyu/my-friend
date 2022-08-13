//宣告變數
const base_URL = 'https://lighthouse-user-api.herokuapp.com'
const index_URL = base_URL + '/api/v1/users/'
// const showAPI_URL = index_URL + id
const cardContainer = document.querySelector('#card-container')
const pagination = document.querySelector('#pagination')
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const btnFavorite = document.querySelector('#btn-favorite')
const USERS_PER_PAGE = 20
let usersFilter = []
const users = JSON.parse(localStorage.getItem('myFavoriteUsers'))


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
// function addToFavorite(btnId) {
//   // const favList = JSON.parse(localStorage.getItem('myFavoriteUsers')) || []

//   let user = users.find((user) => user.id === btnId)
//   if (favList.some((user) => user.id === btnId)) {
//     return alert('已在收藏中')
//   }
//   favList.push(user)
//   localStorage.setItem('myFavoriteUsers', JSON.stringify(favList))
// }

// 刪除收藏
function removeFavorite(btnId) {
  let removeIndex = users.findIndex((user) => user.id === btnId)
  users.splice(removeIndex, 1)

  localStorage.setItem('myFavoriteUsers', JSON.stringify(users))
  renderUsers(users)
}




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
      removeFavorite(Number(e.target.dataset.id))
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
      <button class="btn btn-light me-md-2" id="btn-favorite" type="button" data-id="${item.id}">X 取消收藏</button>
    </div>
  `
  })
  cardContainer.innerHTML = rawHTML
}

renderUsers(users)