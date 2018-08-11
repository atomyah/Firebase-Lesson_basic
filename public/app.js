document.addEventListener('DOMContentLoaded', function() {
  var $input = document.querySelector('#input')
  var $output = document.querySelector('#output')
  // ここに処理を追加していきます
  var db = firebase.database() // データベースへの参照を得る
  var messageRef = db.ref('/message') // '/message'への参照を作成する

  $input.addEventListener('input', function(e) {
  var target = e.target
  messageRef.set(target.value) // .set() を使ってデータを書き込む
  })

  messageRef.on('value', function(snapshot) {
    $output.textContent = snapshot.val()
  })


  var $signin = document.querySelector('#signin')
  var provider = new firebase.auth.GoogleAuthProvider();
  // Twitter: firebase.auth.TwitterAuthProvider()
  // Facebook: firebase.auth.FacebookAuthProvider()
  // GitHub: firebase.auth.GithubAuthProvider()


/*
  signin.addEventListener('click', function() {
    alert('バカボンのパパ');
  })
  下のaddEventListenerのclickがどうしても発火してくれなくてハマった。ブラウザのキャッシュの挙動らしい。ブラウザを再起動かFirefoxを使用してOKだった(泣)
*/
  $signin.addEventListener('click', function() {
    firebase.auth().signInWithRedirect(provider)
      .then(function(authData) { console.log(authData);})
      .catch(function(error) { console.log(error);})
  })

  firebase.auth().onAuthStateChanged(function(user) { //firebase.auth().onAuthStateChanged()を使うと、ユーザーの認証状態の変化に合わせて、コールバックが実行できる
    if (user) {
      var $profile = document.querySelector('#profile')
      $profile.innerHTML = `
        <div>uid: ${user['uid']}</div>
        <div>displayName: ${user['displayName']}</div>
        <div>email: ${user['email']}</div>
        <img src="${user['photoURL']}" width="100">
        `
    }
    // else { firebase.auth().signInWithRedirect(provider) のようにして認証画面にリダイレクトしたりできる、かも…}
  })

  var $signout = document.querySelector('#signout')

  $signout.addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
      location.reload()
    })
  })

})
