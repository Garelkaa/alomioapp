function openModal() {
    document.getElementById('SettingsUser').style.display = 'none';
    document.getElementById("myModal").style.display = "flex";
    }

function openModalTariff() {
    document.getElementById('myModal').style.display = 'none';
    document.getElementById("ActivatePremium").style.display = "flex";
    }

function closeModalTariff() {
        document.getElementById("ActivatePremium").style.display = "none";
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
}

// Функция для закрытия модального окна
function closepagepremium() {
    document.getElementById("ActivatePremium").style.display = "none";
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

    function autoSave() {
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
                console.log('Данные успешно сохранены');
            },
            error: function(xhr, status, error) {
                console.error('Ошибка при сохранении данных:', error);
            }
        });
    }

    $('#name, #age, #city').on('change', autoSave);

    $('.gender-option').on('click', function() {
        const selectedGender = $(this).text().trim();
        $('#gender').val(selectedGender);
        autoSave();
    });

    $('.goal-option').on('click', function() {
        const selectedGoal = $('#goal').val();
        
        $('#goal').val(selectedGoal);
        autoSave();
    });
}


function saveUserAbout(url) {
    // Получаем текст из текстовой области
    var userAboutText = $('#about').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'about': userAboutText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            alert('Данные успешно сохранены');
            console.log(userAboutText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
        }
    });
}


function saveUserWork(url) {
    // Получаем текст из текстовой области
    var userWorkText = $('#work').val();

    // Отправляем данные на сервер
    $.ajax({
        url: url, // Замените на URL вашего эндпоинта
        type: 'POST',
        data: {
            'work': userWorkText,
            'csrfmiddlewaretoken': '{{ csrf_token }}' // Если вы используете Django
        },
        success: function(response) {
            // Обработка успешного ответа от сервера
            alert('Данные успешно сохранены');
            console.log(userWorkText);
            CloseUserWork(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
        }
    });
}

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
            alert('Данные успешно сохранены');
            console.log(userOrientationText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userFamilyText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userChildrenText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userPersonalitText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userEducationText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log("Аккаунт успешно удален.");
            
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при удалении аккаунта.ы');
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
            alert('Данные успешно сохранены');
            console.log(userSmokingText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userAlcoholText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userHeightText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userLanguageText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            alert('Данные успешно сохранены');
            console.log(userZodiacText);
            CloseUserAbout(); // Закрыть модальное окно после успешного сохранения
        },
        error: function(xhr, status, error) {
            // Обработка ошибок
            alert('Произошла ошибка при сохранении данных');
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
            if (localStorage.getItem('saveCard') === 'true') {
                saveCardCheckbox.classList.add('checked');
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
function OpenUserAccountNotifical() {
    document.getElementById("SettingsUser").style.display = "none";
    const settingsContainer = document.getElementById('NotificalUser');
    settingsContainer.style.display = 'flex'
}

// Функция для закрытия окна настроек пользователя
function CloseUserAccountNotifical() {
    const settingsContainer = document.getElementById('NotificalUser');
    settingsContainer.style.display = 'none';
    document.getElementById("SettingsUser").style.display = "flex";
}

// Функция для открытия окна настроек пользователя
function OpenUserConfidentiality() {
    document.getElementById("SettingsUser").style.display = "none";
    const settingsContainer = document.getElementById('ConfidentialityUser');
    settingsContainer.style.display = 'flex'
}

// Функция для закрытия окна настроек пользователя
function CloseUserConfidentiality() {
    const settingsContainer = document.getElementById('ConfidentialityUser');
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
function OpenUserBlocked() {
    document.getElementById("SettingsUser").style.display = "none";
    const settingsContainer = document.getElementById('UserBlocked');
    settingsContainer.style.display = 'flex'
}

// Функция для закрытия окна настроек пользователя
function CloseUserBlocked() {
    const settingsContainer = document.getElementById('UserBlocked');
    settingsContainer.style.display = 'none';
    document.getElementById("SettingsUser").style.display = "flex";
}

// Функция для открытия окна настроек пользователя
function OpenDetailPrem() {
    document.getElementById("ActivatePremium").style.display = "none";
    const settingsContainer = document.getElementById('myModal');
    settingsContainer.style.display = 'flex'
}

function OpenTariffPrem() {
    document.getElementById("ActivatePremium").style.display = "flex";
}

function OpenUserDetailSettings(triggerElement) {
    const modal = document.getElementById("ChangeUser");
    const rect = triggerElement.getBoundingClientRect();

    // Set the position of the modal to be above the trigger element
    modal.style.position = 'absolute';
    modal.style.left = `${rect.left + window.scrollX}px`;
    modal.style.top = `${rect.top + window.scrollY - modal.offsetHeight}px`; // Position it above the trigger
    modal.style.display = 'block'; // Make the modal visible
}

function CloseUserDetailSettings() {
    const modal = document.getElementById("ChangeUser");
    modal.style.display = 'none'; // Hide the modal
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
    } else {
        console.error('Element with ID "UserGenderChoice" not found.');
    }

}


function CloseUserInterested() {
    document.getElementById("UserInterested").style.display = "none";
}

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
}

function CloseUserHeight() {
    document.getElementById("UserHeight").style.display = "none";
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
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
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
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                }
            });
        }
    });
}



