// Global variables
let startX, startY, currentX, currentY;
let isSwiping = false;
let swipeEnabled = true;
let profiles = [];
let currentIndex = 0;

const genderLabels = {
    'F': 'Женский',
    'M': 'Мужской',
    'A': 'Все'
};

const orientationLabels = {
    'H': 'Гетеросексуал',
    'G': 'Гей / Лесбиянка',
    'B': 'Бисексуал',
    'A': 'Асексуал',
    'D': 'Демисексуал',
    'P': 'Пансексуал'
};

const relationshipLabels = {
    'Y': 'В отношениях',
    'N': 'Не в отношениях',
    'S': 'В свободных отношениях'
};

const childrensLabels = {
    'Y': 'Есть',
    'N': 'Нет'
};

const languageLabels = {
    'E': 'Английский',
    'S': 'Испанский',
    'C': 'Китайский',
    'F': 'Французский',
    'G': 'Немецкий',
    'R': 'Русский',
    'J': 'Японский',
    'I': 'Итальянский',
    'P': 'Португальский',
    'A': 'Арабский',
    'K': 'Корейский',
    'H': 'Хинди',
    'D': 'Голландский',
    'W': 'Шведский',
    'T': 'Турецкий',
    'Gr': 'Греческий'
};

const personalityLabels = {
    'E': 'Экстраверт',
    'I': 'Интроверт',
    'S': 'Что-то между'
};

const zodiacLabels = {
    'Ari': 'Овен',
    'Tau': 'Телец',
    'Gem': 'Близнецы',
    'Can': 'Рак',
    'Leo': 'Лев',
    'Vir': 'Дева',
    'Lib': 'Весы',
    'Sco': 'Скорпион',
    'Sag': 'Стрелец',
    'Cap': 'Козерог',
    'Aqu': 'Водолей',
    'Pis': 'Рыбы'
};

const educationLabels = {
    'S': 'Среднее',
    'M': 'Магистр',
    'V': 'Высшее'
};

// Other label mappings...

// Load profiles from the server
function loadProfiles() {
    fetch('/card/get_profiles/')
        .then(response => response.json())
        .then(data => {
            profiles = data;
            currentIndex = 0; // Убедитесь, что индекс профиля правильный
            updateProfileInfo();
        })
        .catch(error => console.error('Ошибка при загрузке профилей:', error));
}



function updateCarousel() {
    const carouselInner = document.getElementById('carouselInner');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    carouselInner.innerHTML = ''; // Clear old carousel items
    indicatorsContainer.innerHTML = ''; // Clear old indicators

    if (profiles.length > 0) {
        const profile = profiles[currentIndex];
        const images = profile.images; // Получаем изображения профиля
        
        images.forEach((image, index) => {
            // Create carousel item
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) {
                carouselItem.classList.add('active');
            }

            const img = document.createElement('img');
            img.src = image;
            img.classList.add('d-block', 'w-100');
            img.alt = `Image of ${profile.name}`;
            carouselItem.appendChild(img);
            carouselInner.appendChild(carouselItem);

            // Create carousel indicator
            const indicator = document.createElement('li');
            indicator.setAttribute('data-target', '#carouselExampleControls');
            indicator.setAttribute('data-slide-to', index.toString());
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicatorsContainer.appendChild(indicator);
        });
    }
}




// Update profile information on the page
function updateProfileInfo() {
    const profile = profiles[currentIndex];
    if (profile) {
        document.querySelector('.user-name').textContent = profile.name || "Не указано";
        document.querySelector('.user-age').textContent = profile.age || "Не указано";
        updateAdditionalInfo();
        updateCarousel(); // обновляем карусель после обновления профиля
    }
}

function getChoiceText(choice, choices) {
    return choices[choice] || "Не указано";
}


// Update additional profile information
function updateAdditionalInfo() {
    const profile = profiles[currentIndex];
    if (profile) {
        document.querySelector('.text-container').textContent = profile.about || "Нет информации";

        const userItems = document.querySelector('.user-items-container');
        userItems.innerHTML = '';
        if (profile.interests) {
            profile.interests.split(',').forEach(interest => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('user-item');
                itemDiv.textContent = interest.trim();
                userItems.appendChild(itemDiv);
            });
        }

        // Обновление дополнительной информации
        document.getElementById('gender').textContent = getChoiceText(profile.gender, genderLabels);
        document.getElementById('city').textContent = profile.city || "Не указан";
        document.getElementById('orientation').textContent = getChoiceText(profile.orientation, orientationLabels);
        document.getElementById('relationship').textContent = getChoiceText(profile.relationship, relationshipLabels);
        document.getElementById('children').textContent = getChoiceText(profile.childrens, childrensLabels);
        document.getElementById('languages').textContent = profile.languages ? profile.languages.split(',').map(lang => languageLabels[lang] || lang).join(', ') : "Не указано";
        document.getElementById('personality').textContent = getChoiceText(profile.personality, personalityLabels);
        document.getElementById('zodiac').textContent = getChoiceText(profile.zodiac, zodiacLabels);
        document.getElementById('education').textContent = getChoiceText(profile.education, educationLabels);
        document.getElementById('work').textContent = profile.work || "Не указано";
    }
}

// Handle touch events for swiping
function handleTouchStart(event) {
    if (!swipeEnabled) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    currentX = startX;
    currentY = startY;
    isSwiping = false;
}

function handleTouchMove(event) {
    if (!swipeEnabled) return;
    if (!isSwiping) {
        let deltaX = event.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 20) {
            isSwiping = true;
        }
    }
    if (isSwiping) {
        let deltaX = event.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
            const overlayApprove = document.querySelector('.overlay.approve');
            const overlayReject = document.querySelector('.overlay.reject');
            if (deltaX > 0) {
                overlayApprove.style.opacity = Math.min(deltaX / 100, 1);
            } else {
                overlayReject.style.opacity = Math.min(-deltaX / 100, 1);
            }
            let rotateAngle = deltaX * 0.1;
            document.getElementById('cardStack').style.transform = `translateX(${deltaX}px) rotate(${rotateAngle}deg)`;
        }
    }
}

function handleTouchEnd(event) {
    if (!swipeEnabled) return;
    let deltaX = event.changedTouches[0].clientX - startX;
    const cardStack = document.getElementById('cardStack');
    const overlayApprove = document.querySelector('.overlay.approve');
    const overlayReject = document.querySelector('.overlay.reject');
    if (cardStack) {
        cardStack.classList.remove('swipe-right', 'swipe-left');
        if (isSwiping) {
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    approveProfile();
                } else {
                    rejectProfile();
                }
            } else {
                cardStack.style.transform = 'none';
            }
        } else {
            cardStack.style.transform = 'none';
        }
        cardStack.style.transition = 'transform 0.3s ease';
        cardStack.style.transform = 'none';
    }
    if (overlayApprove) overlayApprove.style.opacity = 0;
    if (overlayReject) overlayReject.style.opacity = 0;
    isSwiping = false;
}

// Handle profile approval
// Handle profile approval
// Handle profile approval
function approveProfile() {
    console.log('Profile approved');
    const profile = profiles[currentIndex];
    
    // Send AJAX request to add to likes
    fetch('/card/add_like/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken() // CSRF токен для защиты
        },
        body: JSON.stringify({
            'liked_user_id': profile.id  // Здесь передаем ID пользователя
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('User liked successfully');
        } else {
            console.error('Error liking user:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));

    document.getElementById('cardStack').classList.add('swipe-right');
    const overlayApprove = document.querySelector('.overlay.approve');
    if (overlayApprove) {
        overlayApprove.style.opacity = 1;
    }
    setTimeout(() => {
        currentIndex++;
        if (currentIndex >= profiles.length) currentIndex = 0;
        updateProfileInfo();
        updateCarousel();
    }, 300);
}


function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        let [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}

// Handle profile rejection
function rejectProfile() {
    console.log('Profile rejected');
    document.getElementById('cardStack').classList.add('swipe-left');
    const overlayReject = document.querySelector('.overlay.reject');
    if (overlayReject) {
        overlayReject.style.opacity = 1;
    }
    setTimeout(() => {
        currentIndex++;
        if (currentIndex >= profiles.length) currentIndex = 0;
        updateProfileInfo();
        updateCarousel();
    }, 300);
}

function openSettings() {
    swipeEnabled = false; // Отключаем свайпы
    scrollPosition = window.pageYOffset; // Запоминаем текущую позицию прокрутки
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`; // Corrected this line
    document.body.classList.add('modal-open'); // Отключаем прокрутку страницы
    document.getElementById('settingsModal').style.display = 'block';
}


function closeSettings() {
    swipeEnabled = true; // Включаем свайпы обратно
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition); // Восстанавливаем позицию прокрутки
    document.body.classList.remove('modal-open'); // Включаем прокрутку страницы
    document.getElementById('settingsModal').style.display = 'none';
}


// Set gender filter
function setGender(gender, element) {
    if (!gender || !element) {
        console.error('Отсутствует значение gender или элемент.');
        return;
    }

    console.log(`Переданное значение gender: ${gender}`); // Отладка

    const allOptions = document.querySelectorAll('.gender-option');
    
    allOptions.forEach(option => {
        option.classList.remove('active');
        option.querySelector('.circle-g').style.backgroundColor = 'transparent';
    });
    
    element.classList.add('active');
    element.querySelector('.circle-g').style.backgroundColor = '#5C61A9';
    
    const genderInput = document.getElementById('gender-input');
    if (genderInput) {
        switch (gender) {
            case 'all':
                genderInput.value = '';
                break;
            case 'male':
                genderInput.value = 'M';
                break;
            case 'female':
                genderInput.value = 'F';
                break;
            default:
                genderInput.value = '';
                break;
        }
        console.log(`Скрытое поле ввода обновлено на: ${genderInput.value}`);
    } else {
        console.error('Не удалось найти скрытое поле ввода с ID gender-input.');
    }
    
    console.log(`Выбран пол: ${gender}`);
}


function updateAgeText() {
    const minAge = document.getElementById('minAgeRange').value;
    const maxAge = document.getElementById('maxAgeRange').value;
    document.getElementById('minAgeText').innerText = `От: ${minAge}`;
    document.getElementById('maxAgeText').innerText = `До: ${maxAge}`;
}

// Apply settings
function applySettings() {
    const minAge = document.getElementById('minAgeRange').value;
    const maxAge = document.getElementById('maxAgeRange').value;
    const gender =document.getElementById('gender-input').value || 'A';

    if (minAge > maxAge) {
      alert('Минимальный возраст не может быть больше максимального.');
      return;
    }

    // Отправка AJAX-запроса
    fetch('/card/update-settings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gender: gender,
        min_age: minAge,
        max_age: maxAge
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        
        closeSettings();
        location.reload(true);
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    })
    .catch(error => console.error('Ошибка при отправке данных:', error));
  }
// Initialize
// Initialize event listeners and other setup tasks
document.addEventListener('DOMContentLoaded', () => {
    // Load profiles and initialize carousel
    loadProfiles();

    // Check for the existence of elements before adding event listeners
    const minAgeRange = document.getElementById('minAgeRange');
    const maxAgeRange = document.getElementById('maxAgeRange');
    const applySettingsButton = document.getElementById('applySettings');
    const cardStack = document.getElementById('cardStack');

    // Add event listeners only if elements exist
    if (minAgeRange) {
        minAgeRange.addEventListener('input', updateAgeText);
    } else {
        console.warn('Element with ID "minAgeRange" not found');
    }

    if (maxAgeRange) {
        maxAgeRange.addEventListener('input', updateAgeText);
    } else {
        console.warn('Element with ID "maxAgeRange" not found');
    }

    if (applySettingsButton) {
        applySettingsButton.addEventListener('click', applySettings);
    } else {
        console.warn('Element with ID "applySettings" not found');
    }

    if (cardStack) {
        cardStack.addEventListener('touchstart', handleTouchStart);
        cardStack.addEventListener('touchmove', handleTouchMove);
        cardStack.addEventListener('touchend', handleTouchEnd);
    } else {
        console.warn('Element with ID "cardStack" not found');
    }

    // Add event listeners for gender options
    document.querySelectorAll('.gender-option').forEach(option => {
        option.addEventListener('click', function() {
            setGender(this.dataset.gender, this);
        });
    });
});

