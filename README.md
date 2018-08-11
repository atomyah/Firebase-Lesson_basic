*一から始めるFirebase by CodeGrid 中島直博*

https://app.codegrid.net/series/2017-firebase-basic


最終回 ファイルのアップロード
そのままのコードでは動きません😭

`downloadURL: snapshot.downloadURL,`の部分。

調べたところ、getDownloadURL()を使わないとダメなようである。

また、DOMのEventListenerが発火しなかったりするが、ブラウザの問題。（ハマった😭）
再起動したり、クロームを使ってやってたらFirefoxに切り替えるなどしてみてー


