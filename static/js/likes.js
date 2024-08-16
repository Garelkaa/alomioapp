function OpenUserDetailProfile() {
    document.getElementById("UserDetailProfile").style.display = "flex";
    document.body.style.overflow = "hidden"; // Отключаем прокрутку страницы
}

function CloseUserDetailProfile() {
    document.getElementById("UserDetailProfile").style.display = "none";
    document.body.style.overflow = ""; // Восстанавливаем прокрутку страницы
}
