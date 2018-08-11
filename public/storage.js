document.addEventListener('DOMContentLoaded', function() {
  var storage = firebase.storage()
  var imagesStorageRef = storage.ref('/images')

  var db = firebase.database()
  var imagesRef = db.ref('/images')

  var $file = document.querySelector('#file')

// アップロードの処理
  function upload(file) {
    return imagesRef.push({fileName: file.name}) // push()だけじゃレコード入らないゾー。なにかしら中身が必要だった。{fileName: file.name}を入れといた。
    .then(function(newImageRef) {
              console.log(newImageRef.key); //オブジェクトを表示。key:"-LJXb76hsDQa6YuhkUWY"
      return imagesStorageRef
        .child(newImageRef.key) // newImageRef.key でユニークなキーを取得
        .put(file)              // .put() でファイルをアップロード
        .then(function(snapshot) {
        var metadata = snapshot.metadata

        // snapshot.downloadURLではダウンロードURL情報を取ってこれない仕様になってる。下記の3行で処理
        imagesStorageRef.child(newImageRef.key).getDownloadURL().then(function(url) {
          var refURL = url;
          console.log(refURL);
        // ここまで。そんでもって、以下の8行でデータベースへセットする作業を行う。
            return newImageRef.set({
              fileName: file.name,
              downloadURL: refURL,
              contentType: metadata.contentType,
              fullPath: metadata.fullPath,
              name: metadata.name,
              timeCreated: metadata.timeCreated
            })
          })
        });
    })
  }

// input要素のchangeイベントを購読
  $file.addEventListener('change', function(e) {
    var files = e.target.files  // input type="file"で、FileListという「配列っぽいけど配列ではないコレクション」を取得するんだと
    //Array.from(files).forEach(upload) // んで、扱いやすいようにArrayで配列へ変換するらしい。
    var promises = Array.from(files).map(upload) // forEachの代わりにmapを使用。「map」は配列データに使うメソッドであり、各要素1つずつに対して「コールバック関数」を実行し、その結果を新しい配列として返す
    // ァイルのアップロードが完了したタイミングで、処理を追加したいのでPromise.all()を使用
    Promise.all(promises).then(function() {
      // input[type="file"]の値をリセットする。つまり「ファイルが選択されていません」状態にもどす
      $file.value = null
    })
  })


// 下のimagesRef.on・・・から画像情報一覧取得後、DOMを構築して表示
  function renderImages(images) {
    var $images = document.querySelector('#images')
    $images.innerHTML = ''
    if (!images) return

    Object.keys(images).forEach(function(key) {
      var image = images[key]
      var $p = document.createElement('p')
      $p.style.border = 'solid 1px #000'
      $p.innerHTML = `
        <img src="${image.downloadURL}" width="100%">
        <span>${image.fileName}</span>
        <button>remove</button>
      `
      $p.querySelector('button').addEventListener('click', function() {
        imagesStorageRef.child(key).delete().then(function () {
          imagesRef.child(key).remove()
        })
      })
      $images.appendChild($p)
    })
  }

// imagesRefを使って画像情報の一覧を取得
  imagesRef.on('value', function(snapshot) { // var imagesRef = db.ref('/images')
    var images = snapshot.val()              // imagesには画像情報の一覧が格納されている
    renderImages(images)
  })
})
