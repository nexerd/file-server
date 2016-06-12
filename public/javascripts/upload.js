document.forms.upload.onsubmit = function() {
  var input = this.elements.file;
  var file = input.files[0];
  if (file) {
    upload(file);
  }
  return false;
}

function upload(file) {

  var xhr = new XMLHttpRequest();
  var progress = document.getElementById('progress');
  // обработчик для закачки
  xhr.upload.onprogress = function(event) {
    log(event.loaded + ' / ' + event.total);
    progress.innerText='Загружено ' + Math.round(event.loaded/event.total*100) + '%';
  }

  // обработчики успеха и ошибки
  // если status == 200, то это успех, иначе ошибка
  xhr.onload = xhr.onerror = function() {
    if (this.status == 200) {
      log("success");
      progress.innerText='Файл загружен!';
    } else {
      log("error " + this.status);
       progress.innerText='Ошбибка!' + this.status;
    }
  };

  xhr.open("POST", "upload", true);
  xhr.send(file);
}