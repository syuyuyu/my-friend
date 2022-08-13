//宣告變數
const base_URL = 'https://lighthouse-user-api.herokuapp.com'
const index_URL = base_URL + '/api/v1/users/'
// const showAPI_URL = index_URL + id
const cardContainer = document.querySelector('#card-container')

// 1. 取得API 資料
// 2. 動態產生card(img + name)
// 3. card click event
// 4. 跳出modal
// 5. 對應資料放入modal

// 製作modal內容
function createModal(data) {
  const modalTitle = document.querySelector('#modal-title')
  const modalImage = document.querySelector('#modal-image')
  const modalUserAge = document.querySelector('#modal-user-age')
  const modalUserBirth = document.querySelector('#modal-user-birth')
  const modalUserEmail = document.querySelector('#modal-user-email')
  const modalUserGender = document.querySelector('#modal-user-gender')
  const modalUserUpdatedaAt = document.querySelector('#modal-user-updatedAt')



  // console.log(data)
  axios.get(index_URL + data)
    .then(response => {
      let dataInfo = response.data
      // console.log(dataInfo)

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

// 取得id
cardContainer.addEventListener('click',
  function getUserId(e) {
    let targetParent = e.target.parentElement
    console.log(targetParent)
    if (targetParent.matches('.clickCard')) {
      let userId = targetParent.dataset.id
      // createModal(userId)
    } else {
      let userId = targetParent.parentElement.dataset.id
      // createModal(userId)
    }
    createModal(userId)
  })

// render user card
// (將啟動modal的data set 直接放到div裡)
function addUserInfoToCard(data) {
  let rawHTML = ''
  for (let i = 0; i < 4; i++) {
    rawHTML += `
    <div class="col mx-3">
      <a data-bs-toggle="modal" data-bs-target="#userModal">
        <div class="card h-100 clickCard" data-id="${data[i].id}">
          <img src="${data[i].avatar}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${data[i].name}</h5>
            <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.</p>
          </div>
        </div>
      </a>
    </div>
    `
  }
  cardContainer.innerHTML = rawHTML
}


// axios API
let users = []
axios.get('https://lighthouse-user-api.herokuapp.com/api/v1/users')
  .then(res => {
    users.push(...res.data.results)
    addUserInfoToCard(users)
  })
  .catch(err => {
    console.log(err)
  })