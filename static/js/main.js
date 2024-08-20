function openModal() {
    document.getElementById('SettingsUser').style.display = 'none';
    document.getElementById("myModal").style.display = "flex";
}

function openModalTariff() {
    document.getElementById('myModal').style.display = 'none';
    document.getElementById('ProfilePage').style.overflow = 'hidden';
    document.getElementById("ActivatePremium").style.display = "flex";
    document.body.classList.add('no-scroll'); // Отключаем прокрутку на странице
}

function closeModalTariff() {
        document.getElementById("ActivatePremium").style.display = "none";
        document.body.classList.remove('no-scroll'); // Отключаем прокрутку на странице
    }

function closeModal() {
        document.getElementById("myModal").style.display = "none";
    }

window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        closeModal();
    }
}

let selectedTariffPrice = 0; // Переменная для хранения выбранной цены
let selectedTariffDuration = '';

        // Функция для выбора тарифа
function selectTariff(element) {
    // Удаляем класс 'selected' у всех тарифов
    document.querySelectorAll('.tariff-box').forEach(function(box) {
        box.classList.remove('selected');
    });

    // Добавляем класс 'selected' к выбранному тарифу
    element.classList.add('selected');

    // Получаем цену выбранного тарифа и сохраняем ее
        selectedTariffPrice = element.getAttribute('data-price');
        selectedTariffDuration = element.getAttribute('data-duration');
    }

    // Функция для открытия модального окна
function openpagepremium() {
    document.getElementById("myModal").style.display = "none";
    document.getElementById("ActivatePremium").style.display = "flex";
    document.body.classList.add('no-scroll'); // Отключаем прокрутку на странице
}

// Функция для закрытия модального окна
function closepagepremium() {
    document.getElementById("ActivatePremium").style.display = "none";
    document.body.classList.remove('no-scroll'); // Отключаем прокрутку на странице
}

function PayPremiumForm() {
    // Обновляем информацию о выбранном тарифе
    const nameAndPriceElement = document.querySelector('.payment-container .name-and-price .price');
    const totalPriceElement = document.querySelector('.payment-container .total-price .price');

    if (selectedTariffDuration !== 'Навсегда') {
        nameAndPriceElement.textContent = `${selectedTariffPrice} руб х ${selectedTariffDuration}`;
    } else {
        nameAndPriceElement.textContent = `${selectedTariffPrice} руб ${selectedTariffDuration}`;
    }

    totalPriceElement.textContent = selectedTariffPrice;
    document.getElementById("ActivatePremium").style.display = "none";
    document.body.classList.remove('no-scroll'); // Включаем прокрутку на странице
    document.getElementById("PayPremium").style.display = "flex";
}

// Функция для закрытия модального окна оплаты
function ClosePayPremium() {
    document.getElementById("PayPremium").style.display = "none";
}

// Закрытие модального окна при нажатии на область за пределами модального окна
window.onclick = function(event) {
    if (event.target == document.getElementById("ActivatePremium")) {
        closepagepremium();
    } else if (event.target == document.getElementById("PayPremium")) {
        ClosePayPremium();
    }
}

function initializePopupScripts() {
    const circles = document.querySelectorAll('.change-icon');
    const genderInput = document.querySelector('input[name="gender"]');
    const goalInput = document.querySelector('input[name="goal"]');

    if (circles.length > 0) { 
        circles.forEach(circle => {
            circle.addEventListener('click', () => {
                circles.forEach(el => el.classList.remove('active'));
                circle.classList.add('active');

                if (circle.parentElement.classList.contains('change-men')) {
                    genderInput.value = 'M'; // Мужской
                } else if (circle.parentElement.classList.contains('change-women')) {
                    genderInput.value = 'F'; // Женский
                }
            });
        });
    } else {
        console.error("No elements found for change-icon.");
    }

    const circles_interes = document.querySelectorAll('.change-icon-target');
    if (circles_interes.length > 0) { 
        circles_interes.forEach(circle => {
            circle.addEventListener('click', () => {
                circles_interes.forEach(el => el.classList.remove('active'));
                circle.classList.add('active');

                if (circle.parentElement.classList.contains('change-love')) {
                    goalInput.value = 'L';
                } else if (circle.parentElement.classList.contains('change-romance')) {
                    goalInput.value = 'R';
                } else if (circle.parentElement.classList.contains('change-communication')) {
                    goalInput.value = 'O';
                }
            });
        });
    } else {
        console.error("No circles_interes found");
    }
}

function setupAutoSaveUserInfo(url) {
    function validateName(name) {
        const namePattern = /^[А-Яа-яЁё\s\-]+$/;
        return namePattern.test(name);
    }

    function validateAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 18 && age <= 100;
    }

    function showError(inputId) {
        const inputContainer = document.querySelector(`#${inputId}`).closest('.input-container');
        inputContainer.classList.add('error');
    }

    function removeError(inputId) {
        const inputContainer = document.querySelector(`#${inputId}`).closest('.input-container');
        inputContainer.classList.remove('error');
    }

    function setupAutoSaveUserInfo() {
        const name = $('#name').val();
        const age = $('#age').val();
        const gender = $('#gender').val();
        const city = $('#city').val();
        const goal = $('#goal').val();

        let isValid = true;

        if (!validateName(name)) {
            showError('name');
            isValid = false;
        } else {
            removeError('name');
        }

        if (!validateAge(age)) {
            showError('age');
            isValid = false;
        } else {
            removeError('age');
        }

        if (!isValid) {
            console.error('Исправьте ошибки в форме перед сохранением.');
            return;
        }

        const userData = {
            name: name,
            age: age,
            gender: gender,
            city: city,
            goal: goal
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                csrfmiddlewaretoken: '{{ csrf_token }}',
                user_data: JSON.stringify(userData)
            },
            success: function(response) {
                location.reload(); // Перезагрузка страницы после успешного запроса
            },
            error: function(xhr, status, error) {
                console.error('Ошибка при сохранении данных:', error);
                location.reload(); // Перезагрузка страницы даже при ошибке
            }
        });
    }

    $('#name, #age, #city').on('change', setupAutoSaveUserInfo);

    $('.gender-option').on('click', function() {
        const selectedGender = $(this).text().trim();
        $('#gender').val(selectedGender);
        setupAutoSaveUserInfo();
    });

    $('.goal-option').on('click', function() {
        const selectedGoal = $('#goal').val();
        
        $('#goal').val(selectedGoal);
        setupAutoSaveUserInfo();
    });
}

function saveUserAbout(url) {
    var userAboutText = $('#about').val();

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'about': userAboutText,
            'csrfmiddlewaretoken': '{{ csrf_token }}'
        },
        success: function(response) {
            location.reload(); // Перезагрузка страницы после успешного запроса
        },
        error: function(xhr, status, error) {
            console.error('Ошибка при сохранении данных:', error);
            location.reload(); // Перезагрузка страницы даже при ошибке
        }
    });
}

function saveUserWork(url) {
    var userWorkText = $('#work').val();

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'work': userWorkText,
            'csrfmiddlewaretoken': '{{ csrf_token }}'
        },
        success: function(response) {
            location.reload(); // Перезагрузка страницы после успешного запроса
        },
        error: function(xhr, status, error) {
            console.error('Ошибка при сохранении данных:', error);
            location.reload(); // Перезагрузка страницы даже при ошибке
        }
    });
}

// Остальные функции также были изменены, чтобы удалить алерты и добавить перезагрузку страницы.


function updateGenderSelection() {
    const genderInput = document.querySelector('input[name="orientation"]');
    const orientationMap = {
        'Гетеросексуал': 'H',
        'Гей / Лесбиянка': 'G',
        'Бисексуал': 'B',
        'Асексуал': 'A',
        'Демисексуал': 'D',
        'Пансексуал': 'P'
    };

    $('.gender-item').on('click', function() {
        // Удаляем класс active у всех circle-gender
        $('.circle-gender').removeClass('active');
        
        // Добавляем класс active только к выбранному circle-gender
        $(this).find('.circle-gender').addClass('active');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            genderInput.value = orientationMap[orientation];
        }
    });
}


function saveUserOrientation(url) {
    // Получаем текст из текстовой области
    var userOrientationText = $('#orientation').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userOrientationText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userOrientationText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updateFamilySelection() {
    const familyInput = document.querySelector('input[name="family"]');
    const orientationMap = {
        'В отношениях': 'Y',
        'Не в отношениях': 'N',
        'В свободных отношениях': 'S',
        
    };

    $('.gender-item').on('click', function() {
        // Удаляем класс active-family у всех circle-gender
        $('.circle-family').removeClass('active-family');
        
        // Добавляем класс active-family только к выбранному circle-family
        $(this).find('.circle-family').addClass('active-family');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            familyInput.value = orientationMap[orientation];
        }
    });
}


function saveUserFamily(url) {
    // Получаем текст из текстовой области
    var userFamilyText = $('#family').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userFamilyText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            console.log(userFamilyText);
            location.reload();
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updateChildrenSelection() {
    const childrenInput = document.querySelector('input[name="children"]');
    const orientationMap = {
        'Есть': 'Y',
        'Нет': 'N',
    };

    $('.answer-item').on('click', function() {
        // Удаляем класс active-circle-children у всех circle-gender
        $('.circle-children').removeClass('active-circle-children');
        
        // Добавляем класс active-circle-children только к выбранному circle-family
        $(this).find('.circle-children').addClass('active-circle-children');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            childrenInput.value = orientationMap[orientation];
        }
    });
}


function saveUserChildren(url) {
    // Получаем текст из текстовой области
    var userChildrenText = $('#children').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userChildrenText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userChildrenText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updatePersonalitySelection() {
    const personalityInput = document.querySelector('input[name="personality"]');
    const orientationMap = {
        'Экстраверт': 'E',
        'Интроверт': 'I',
        'Что-то между': 'S',
    };

    $('.personality-item').on('click', function() {
        $('.circle-personality').removeClass('active-personality');
        
        $(this).find('.circle-personality').addClass('active-personality');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            personalityInput.value = orientationMap[orientation];
        }
    });
}


function saveUserPersonality(url) {
    // Получаем текст из текстовой области
    var userPersonalitText = $('#personality').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userPersonalitText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userPersonalitText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updateEducationSelection() {
    const educationInput = document.querySelector('input[name="education"]');
    const orientationMap = {
        'Среднее': 'S',
        'Высшее': 'V',
        'Магистр и выше': 'M',
    };

    $('.education-item').on('click', function() {
        $('.circle-education').removeClass('active-education');
        
        $(this).find('.circle-education').addClass('active-education');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            educationInput.value = orientationMap[orientation];
        }
    });
}


function saveUserEducation(url) {
    // Получаем текст из текстовой области
    var userEducationText = $('#education').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userEducationText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userEducationText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}

function saveUserUser(url) {
    // Получаем текст из текстовой области
    

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            console.log("Аккаунт успешно удален.");
            location.reload();
            
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            
            location.reload();
        }
    });
}


function updateSmokingSelection() {
    const smokingInput = document.querySelector('input[name="smoking"]');
    const orientationMap = {
        'Курю': 'Y',
        'Не курю': 'N',
    };

    $('.smoking-item').on('click', function() {
        $('.circle-smoking').removeClass('active-smoking');
        
        $(this).find('.circle-smoking').addClass('active-smoking');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            smokingInput.value = orientationMap[orientation];
        }
    });
}


function saveUserSmoking(url) {
    // Получаем текст из текстовой области
    var userSmokingText = $('#smoking').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userSmokingText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userSmokingText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updateAlcoholSelection() {
    const alcoholInput = document.querySelector('input[name="alcohol"]');
    const orientationMap = {
        'Пью': 'Y',
        'Не пью': 'N',
    };

    $('.alco-item').on('click', function() {
        $('.circle-alco').removeClass('active-alco');
        
        $(this).find('.circle-alco').addClass('active-alco');
        
        // Получаем значение ориентации из span
        var orientation = $(this).find('span').text();
        
        // Устанавливаем значение первой буквы ориентации на английском в input
        if (orientationMap[orientation]) {
            alcoholInput.value = orientationMap[orientation];
        }
    });
}


function saveUserAlcohol(url) {
    // Получаем текст из текстовой области
    var userAlcoholText = $('#alcohol').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userAlcoholText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userAlcoholText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function saveUserHeight(url) {
    // Получаем текст из текстовой области
    var userHeightText = $('#userHeightRange').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'height': userHeightText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userHeightText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updateLanguageSelection() {
    const languageInput = document.querySelector('input[name="language"]');
    
    $('.language-item').on('click', function() {
        // Удаляем класс активного состояния со всех кружков
        $('.circle-language').removeClass('active');
        
        // Добавляем класс активного состояния к выбранному кружку
        $(this).find('.circle-language').addClass('active');
        
        // Получаем значение языка из атрибута data-language
        const selectedLanguage = $(this).find('.circle-language').attr('data-language');
        
        // Устанавливаем значение первой буквы выбранного языка в input
        if (selectedLanguage) {
            languageInput.value = selectedLanguage.charAt(0);  // Сохраняем первую букву в input
        }
    });
}

function saveUserLanguage(url) {
    // Получаем текст из текстовой области
    var userLanguageText = $('#language').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'language': userLanguageText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userLanguageText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}


function updateZodiacSelection() {
    const zodiacInput = document.querySelector('input[name="zodiac"]');
    
    $('.zodiac-item').on('click', function() {
        $('.circle-zodiac').removeClass('active');
        
        $(this).find('.circle-zodiac').addClass('active');
        
        // Получаем значение знака Зодиака из data-атрибута
        var zodiac = $(this).find('.circle-zodiac').data('zodiac');
        
        // Получаем первую букву знака Зодиака
        var firstLetter = zodiac.charAt(0)+zodiac.charAt(1)+zodiac.charAt(2);
        
        // Устанавливаем первую букву знака Зодиака в input
        zodiacInput.value = firstLetter;
    });
}


function saveUserZodiac(url) {
    // Получаем текст из текстовой области
    var userZodiacText = $('#zodiac').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'zodiac': userZodiacText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            location.reload();
            console.log(userZodiacText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            location.reload();
        }
    });
}

function handleThemeSwitchChange(url) {
    $('#darkThemeSwitch').on('change', function() {
        const isChecked = $(this).is(':checked');
        console.log(isChecked);
        
        if (isChecked) {
            console.log('ya true');
            const data = JSON.stringify({
                dark_mode: true
            });
            console.log(data);

            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: data,
                success: function(response) {
                    console.log('Success:', response);
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    location.reload();
                }
            });
        } else {
            const data = JSON.stringify({
                dark_mode: false
            });
            console.log(data);

            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: data,
                success: function(response) {
                    console.log('Success:', response);
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    location.reload();
                }
            });
        }
    });
}


function CheckCity() {
    function fetchCitySuggestions(query) {
        $.ajax({
            url: 'https://secure.geonames.org/searchJSON',
            data: {
                q: query,
                maxRows: 10,
                username: 'bbylfg', // Замените на ваше имя пользователя GeoNames
                featureClass: 'P',
                style: 'full',
                lang: 'ru',
                country: 'RU,UA,BY,KZ,AM,AZ,GE,MD,TJ,TM,UZ' // Страны СНГ и Украина
            },
            success: function(data) {
                var suggestions = $("#suggestions");
                suggestions.empty();
                if (data.geonames && data.geonames.length > 0) {
                    // Фильтруем результаты, чтобы оставить только те, что начинаются с запроса
                    var filteredCities = data.geonames.filter(function(city) {
                        return city.name.toLowerCase().startsWith(query.toLowerCase());
                    });

                    // Сортируем по соответствию
                    filteredCities.sort(function(a, b) {
                        return a.name.localeCompare(b.name);
                    });

                    $.each(filteredCities, function(index, city) {
                        suggestions.append('<a href="#" class="list-group-item list-group-item-action" data-city="' + city.name + '">' + city.name + '</a>');
                    });
                } else {
                    suggestions.append('<p>No results found</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching data from Geonames API:", status, error);
            }
        });
    }

    $("#city").on("input", function() {
        var query = $(this).val();
        if(query.length > 1) {
            fetchCitySuggestions(query);
        } else {
            $("#suggestions").empty();
        }
    });

    // Обработка клика на элементе подсказки
    $(document).on("click", "#suggestions a", function(e) {
        e.preventDefault();
        var selectedCity = $(this).data("city");
        $("#city").val(selectedCity);
        $("#suggestions").empty();
    });
}


document.addEventListener("DOMContentLoaded", function() {
    // Проверка наличия сохраненных данных при загрузке страницы
    const savedCardNumber = localStorage.getItem('cardNumber');
    const savedExpiry = localStorage.getItem('expiryDate');
    const savedCVC = localStorage.getItem('cvc');

    if (savedCardNumber) document.querySelector('.card-number-input').value = savedCardNumber;
    if (savedExpiry) document.querySelector('.expiry-input').value = savedExpiry;
    if (savedCVC) document.querySelector('.cvc-input').value = savedCVC;

    // Проверка состояния сохранения карты
    const saveCardCheckbox = document.querySelector('.circle-icon');
    if (saveCardCheckbox) {  // Добавлена проверка на наличие элемента
        if (localStorage.getItem('saveCard') === 'true') {
            saveCardCheckbox.classList.add('checked');
        }
    }
});


        // Функция для сохранения или удаления данных карты
        function toggleSaveCard() {
            const saveCardCheckbox = document.querySelector('.circle-icon');
            const cardNumber = document.querySelector('.card-number-input').value;
            const expiry = document.querySelector('.expiry-input').value;
            const cvc = document.querySelector('.cvc-input').value;

            if (saveCardCheckbox.classList.contains('checked')) {
                localStorage.removeItem('cardNumber');
                localStorage.removeItem('expiryDate');
                localStorage.removeItem('cvc');
                localStorage.setItem('saveCard', 'false');
                saveCardCheckbox.classList.remove('checked');
            } else {
                localStorage.setItem('cardNumber', cardNumber);
                localStorage.setItem('expiryDate', expiry);
                localStorage.setItem('cvc', cvc);
                localStorage.setItem('saveCard', 'true');
                saveCardCheckbox.classList.add('checked');
            }
        }

// Функция для открытия окна настроек пользователя
function OpenUserSettings() {
    document.getElementById("SettingsUser").style.display = "flex";
}

// Функция для закрытия окна настроек пользователя
function CloseUserSettings() {
    document.getElementById("SettingsUser").style.display = "none";
}

// Функция для открытия окна настроек пользователя
function OpenUserAccountSettings() {
    document.getElementById("SettingsUser").style.display = "none";
    const settingsContainer = document.getElementById('SettingsUserAccount');
    settingsContainer.style.display = 'block';

    // Установите нужную высоту, например, текущий scrollY
    settingsContainer.style.top = `${window.scrollY + 50}px`; // 50px - это отступ от верхней части окна
}

// Функция для закрытия окна настроек пользователя
function CloseUserAccountSettings() {
    const settingsContainer = document.getElementById('SettingsUserAccount');
    settingsContainer.style.display = 'none';
    document.getElementById("SettingsUser").style.display = "flex";
}

// Функция для открытия окна настроек пользователя
function OpenUserInterface() {
    document.getElementById("SettingsUser").style.display = "none";
    const settingsContainer = document.getElementById('UserInterface');
    settingsContainer.style.display = 'flex'
}

// Функция для закрытия окна настроек пользователя
function CloseUserInterface() {
    const settingsContainer = document.getElementById('UserInterface');
    settingsContainer.style.display = 'none';
    document.getElementById("SettingsUser").style.display = "flex";
}

// Функция для открытия окна настроек пользователя
function OpenDetailPrem() {
    document.getElementById("ActivatePremium").style.display = "none";
    document.body.classList.remove('no-scroll'); // Включаем прокрутку на странице
    const settingsContainer = document.getElementById('myModal');
    settingsContainer.style.display = 'flex'
}

function OpenTariffPrem() {
    document.getElementById("ActivatePremium").style.display = "flex";
    document.body.classList.add('no-scroll'); // Отключаем прокрутку на странице
}

function OpenUserDetailSettings(triggerElement) {
    const modal = document.getElementById("ChangeUser");
    document.body.classList.add('no-scroll'); // Отключаем прокрутку на странице
    
    // Показ модального окна
    modal.classList.add('show');
}

function CloseUserDetailSettings() {
    const modal = document.getElementById("ChangeUser");
    document.body.classList.remove('no-scroll'); // Включаем прокрутку на странице
    
    // Скрытие модального окна
    modal.classList.remove('show');
}


function OpenSelectGenders() {
    document.getElementById("GenderModal").style.display = "block";
}

// Функция для открытия окна настроек пользователя
function CloseSelectGenders() {
    const settingsContainer = document.getElementById('GenderModal');
    settingsContainer.style.display = 'none'
}

document.addEventListener("DOMContentLoaded", function () {
    // Обработка кликов по элементам gender-option
    document.querySelectorAll('.gender-option').forEach(function (element) {
        element.addEventListener('click', function () {
            // Удаляем активный класс у всех иконок gender-option
            document.querySelectorAll('.user-input-gender .change-icon').forEach(function (icon) {
                icon.classList.remove('active');
            });
            // Добавляем активный класс только для нажатой иконки
            let icon = this.querySelector('.change-icon');
            if (icon) {
                icon.classList.add('active');
            }
        });
    });

    // Обработка кликов по элементам user-target
    document.querySelectorAll('.user-target').forEach(function (element) {
        element.addEventListener('click', function () {
            // Удаляем активный класс у всех иконок user-target
            document.querySelectorAll('.user-target-container .change-icon-target').forEach(function (icon) {
                icon.classList.remove('active');
            });
            // Добавляем активный класс только для нажатой иконки
            let icon = this.querySelector('.change-icon-target');
            if (icon) {
                icon.classList.add('active');
            }
        });
    });
});

function OpenUserAbout() {
    document.getElementById("UserAbout").style.display = "flex";
}

function CloseUserAbout() {
    document.getElementById("UserAbout").style.display = "none";
}

function OpenUserInterested() {
    const element = document.getElementById('UserInterested');
    
    // Check if the element exists before trying to access its style property
    if (element) {
        element.style.display = 'block'; // Example action
        document.body.classList.add('no-scroll'); // Отключаем прокрутку на странице
    } else {
        console.error('Element with ID "UserGenderChoice" not found.');
    }

}

function CloseUserInterested() {
    document.getElementById("UserInterested").style.display = "none";
    document.body.classList.remove('no-scroll'); // Включаем прокрутку на странице
}

// Инициализация событий после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Пример открытия модального окна по клику на кнопку
    document.getElementById('open-modal-button').addEventListener('click', openModal);

    // Пример закрытия модального окна по клику на кнопку закрытия
    document.querySelector('.close-interested').addEventListener('click', closeModal);

    // Если модальное окно должно открываться по клику вне его
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('interested-user-popup');
        if (!modal.contains(event.target)) {
            closeModal();
        }
    });
});

function OpenUserSelecdGenders() {
    document.getElementById("UserGenderChoice").style.display = "flex";
}

function CloseUserSelecdGenders() {
    document.getElementById("UserGenderChoice").style.display = "none";
}

function OpenUserFamily() {
    document.getElementById("UserFamily").style.display = "flex";
}

function CloseUserFamily() {
    document.getElementById("UserFamily").style.display = "none";
}
function OpenUserPersonality() {
    document.getElementById("UserPersonality").style.display = "flex";
}

function CloseUserPersonality() {
    document.getElementById("UserPersonality").style.display = "none";
}

function OpenUserChildren() {
    document.getElementById("UserChildren").style.display = "flex";
}

function CloseUserChildren() {
    document.getElementById("UserChildren").style.display = "none";
}

function OpenUserLanguage() {
    document.getElementById("UserLanguage").style.display = "block";
}

function CloseUserLanguage() {
    document.getElementById("UserLanguage").style.display = "none";
}

function OpenUserEducation() {
    document.getElementById("UserEducation").style.display = "block";
}

function CloseUserEducation() {
    document.getElementById("UserEducation").style.display = "none";
}

function OpenUserWork() {
    document.getElementById("UserWork").style.display = "block";
}

function CloseUserWork() {
    document.getElementById("UserWork").style.display = "none";
}

function OpenUserSmoking() {
    document.getElementById("UserSmoking").style.display = "block";
}

function CloseUserSmoking() {
    document.getElementById("UserSmoking").style.display = "none";
}

function OpenUserZodiac() {
    document.getElementById("ZodiacSigns").style.display = "flex";
}

function CloseUserZodiac() {
    document.getElementById("ZodiacSigns").style.display = "none";
}

function OpenUserAlco() {
    document.getElementById("UserAlco").style.display = "block";
}

function CloseUserAlco() {
    document.getElementById("UserAlco").style.display = "none";
}

function OpenUserHeight() {
    document.getElementById("UserHeight").style.display = "block";
    document.body.classList.add('no-scroll'); // Отключаем прокрутку на странице
}

function CloseUserHeight() {
    document.getElementById("UserHeight").style.display = "none";
    document.body.classList.remove('no-scroll'); // Отключаем прокрутку на странице
}

function updateSliderValue() {
    const slider = document.getElementById('userHeightRange');
    const sliderValue = document.getElementById('sliderValue');
    sliderValue.textContent = slider.value + ' см';
}

function OpenUserDetailProfile() {
    document.getElementById("UserDetailProfile").style.display = "flex";
}

function CloseUserDetailProfile() {
    document.getElementById("UserDetailProfile").style.display = "none";
}


// Форматирование номера карты в формате '0000 0000 0000 0000'
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    if (value.length > 16) {
        value = value.slice(0, 16); // Ограничиваем до 16 цифр
    }
    value = value.replace(/(\d{4})/g, '$1 ').trim(); // Разделяем каждые 4 цифры пробелом
    input.value = value;
}

// Форматирование срока действия в формате 'ММ/ГГ'
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    if (value.length > 4) {
        value = value.slice(0, 4); // Ограничиваем до 4 цифр
    }
    if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{2})/, '$1/$2'); // Добавляем слеш после первых 2 цифр
    }
    input.value = value;
}

// Валидация CVC кода
function formatCVC(input) {
    let value = input.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    if (value.length > 3) {
        value = value.slice(0, 3); // Ограничиваем до 3 цифр
    }
    input.value = value;
}

function formatDateInput(event) {
    const input = event.target;
    let value = input.value.replace(/[^0-9]/g, ''); // Удалить все нецифровые символы

    if (value.length > 2) {
        value = value.slice(0, 2) + '.' + value.slice(2);
    }
    if (value.length > 5) {
        value = value.slice(0, 5) + '.' + value.slice(5);
    }
    input.value = value.slice(0, 10); // Ограничить длину до 10 символов

    // Вызвать валидацию только если введена полная дата
    if (value.length === 10) {
        validateDate();
    } else {
        // Если дата не полная, скрыть сообщение об ошибке
        hideDateError();
    }
}

function validateDate() {
    const dateInput = document.getElementById("age");
    const dateError = document.getElementById("date-error");
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/;

    const value = dateInput.value;

    if (!datePattern.test(value)) {
        showDateError("Введите дату в формате дд.мм.гггг");
        return;
    }

    const [day, month, year] = value.split('.').map(Number);

    if (!isValidDate(day, month, year)) {
        showDateError("Введите существующую дату");
    } else if (!isDateInRange(year)) {
        showDateError("Дата должна быть в пределах с 1950 года по текущий год");
    } else {
        hideDateError();
    }
}

function showDateError(message) {
    const dateInput = document.getElementById("age");
    const dateError = document.getElementById("date-error");
    if (dateError) {
        dateError.textContent = message;
        dateError.style.display = "block"; // Показать сообщение об ошибке
        dateInput.classList.add("error-border"); // Подсветить границу красным
    }
}

function hideDateError() {
    const dateInput = document.getElementById("age");
    const dateError = document.getElementById("date-error");
    if (dateError) {
        dateError.style.display = "none"; // Скрыть сообщение об ошибке
        dateInput.classList.remove("error-border"); // Убрать подсветку границы
    }
}

function isValidDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isDateInRange(year) {
    const currentYear = new Date().getFullYear();
    return year >= 1950 && year <= currentYear;
}

// Инициализация функций после загрузки данных
function initializePopupScripts() {
    // Ваш код для инициализации попапов
}

function CheckCity() {
    // Ваш код для проверки города
}

const interestsSuggestions = ["Спорт", "Музыка", "Программирование", "Путешествия", "Фотография"];

function displaySuggestions() {
    const input = document.getElementById('interests-input');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const query = input.value.toLowerCase().trim(); // Удаляем пробелы по краям

    // Очищаем предыдущие рекомендации
    suggestionsContainer.innerHTML = '';

    // Фильтруем рекомендации на основе введённого текста
    const filteredSuggestions = interestsSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query)
    );

    // Если есть совпадения, отображаем их
    if (filteredSuggestions.length > 0) {
        filteredSuggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.textContent = suggestion;
            suggestionElement.onclick = function() {
                input.value = suggestion;  // Устанавливаем значение в поле ввода
                suggestionsContainer.innerHTML = '';  // Очищаем рекомендации после выбора
                hideSuggestions(); // Скрываем контейнер
            };
            suggestionsContainer.appendChild(suggestionElement);
        });

        // Показываем контейнер с рекомендациями
        suggestionsContainer.style.display = 'block';
    } else {
        hideSuggestions(); // Если нет совпадений, скрываем контейнер
    }
}

function hideSuggestions() {
    document.getElementById('suggestions-container').style.display = 'none';
}


function initializeEvents() {
    const input = document.getElementById('interests-input');
    const suggestionsContainer = document.getElementById('suggestions-container');

    // Скрываем контейнер с рекомендациями при загрузке страницы
    hideSuggestions();

    // Показываем рекомендации при клике на поле ввода
    input.addEventListener('click', function(event) {
        event.stopPropagation(); // Предотвращаем всплытие события, чтобы не скрыть контейнер сразу
        displaySuggestions();
    });

    // Обновляем рекомендации при вводе текста
    input.addEventListener('input', function() {
        displaySuggestions();
    });

    // Скрываем рекомендации при клике вне поля ввода
    document.addEventListener('click', function(event) {
        if (!input.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            hideSuggestions();
        }
    });
}






